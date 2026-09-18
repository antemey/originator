import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import type {
  Action,
  CartProjection,
  Decision,
  Engine,
  Projection,
  Seed,
} from '../src/engine/contract';
import { createEngine } from '../src/engine/index';

// Bases and limits were recorded before execution in restart/initial-assertions.md.
// The frozen fixtures are evidence inputs, never expectations from engine output.
interface Capture {
  seed_file: string;
  actions: Action[];
  expected: Projection;
  checkpoints: { after_action: number; expected: CartProjection }[];
}
function json(path: string): unknown {
  return JSON.parse(readFileSync(path, 'utf8'));
}
const names = [
  'target-transitions',
  'target-mixed-replay',
  'lab-mirror-mixed',
  'lab-two-percent-nonsequential',
];
function capture(name: string): Capture {
  // These pinned files are also checked by the repository's frozen validators.
  const value = json(`fixtures/discovery/${name}.json`);
  expect(value).toEqual(
    expect.objectContaining({
      seed_file: expect.any(String),
      actions: expect.any(Array),
      expected: expect.any(Object),
      checkpoints: expect.any(Array),
    }),
  );
  return value as Capture;
}
function seed(path = 'target/seed.json'): Seed {
  const value = json(path);
  expect(value).toEqual(
    expect.objectContaining({
      schema_version: 1,
      configured: true,
      products: expect.any(Array),
      coupons: expect.any(Array),
    }),
  );
  return value as Seed;
}
function normalized(cart: CartProjection) {
  return {
    ...cart,
    lines: [...cart.lines].sort((a, b) =>
      JSON.stringify([a.ref, a.variant]).localeCompare(
        JSON.stringify([b.ref, b.variant]),
      ),
    ),
    coupons: [...cart.coupons].sort((a, b) => a.code.localeCompare(b.code)),
  };
}
function same(actual: CartProjection, expected: CartProjection, label: string) {
  const details = `${label}\nexpected=${JSON.stringify(expected)}\nactual=${JSON.stringify(actual)}`;
  expect.soft(normalized(actual), details).toEqual(normalized(expected));
  // Sorting keeps all identities; duplicate, missing and extra entries still fail.
  for (const row of [...actual.lines, ...actual.coupons, actual.totals]) {
    for (const [field, value] of Object.entries(row)) {
      if (field.startsWith('line_') || field.startsWith('total_')) {
        expect
          .soft(Number.isSafeInteger(value), `${label}:${field}`)
          .toBe(true);
      }
    }
  }
}
function replay(engine: Engine, fixture: Capture) {
  const decisions: Decision[] = [];
  fixture.actions.forEach((action, index) => {
    const before = engine.snapshot();
    const result = engine.dispatch(action);
    decisions.push({ action_index: index, ...result });
    const expected = fixture.expected.decisions[index];
    expect(expected).toBeDefined();
    expect
      .soft(decisions[index], `decision ${index}`)
      .toMatchObject(expected ?? {});
    if (!result.accepted) {
      // Contract assertion even when no immediate merchant checkpoint exists.
      same(engine.snapshot(), before, `refusal non-mutation ${index}`);
    }
    for (const checkpoint of fixture.checkpoints) {
      if (checkpoint.after_action === index) {
        same(
          engine.snapshot(),
          checkpoint.expected,
          `captured checkpoint ${index}`,
        );
      }
    }
  });
  const { decisions: expectedDecisions, ...expectedCart } = fixture.expected;
  expect(decisions).toHaveLength(expectedDecisions.length);
  same(engine.snapshot(), expectedCart, 'captured final projection');
  return decisions;
}
// Literal zero is a known safe minor-unit value; no implementation helper is used.
const zero = 0 as CartProjection['totals']['total_items'];
const empty: CartProjection = {
  lines: [],
  coupons: [],
  totals: {
    total_items: zero,
    total_items_tax: zero,
    total_discount: zero,
    total_discount_tax: zero,
  },
};
function populated() {
  const engine = createEngine();
  const fixture = capture('target-mixed-replay');
  engine.reset(seed(fixture.seed_file));
  replay(engine, fixture);
  return engine;
}

for (const name of names) {
  test(`captured evidence and reset/replay determinism: ${name}`, () => {
    const fixture = capture(name);
    const engine = populated();
    engine.reset(seed(fixture.seed_file));
    same(engine.snapshot(), empty, 'reset discards previous cart');
    const decisions = replay(engine, fixture);
    engine.reset(seed(fixture.seed_file));
    expect(replay(engine, fixture)).toEqual(decisions);
  });
}

const invalid: unknown[] = [
  null,
  [],
  {},
  { type: 'unsupported' },
  { type: 'add', ref: 'spatules' },
  { type: 'set_qty', ref: 'spatules' },
  { type: 'add', qty: 1 },
  { type: 'remove' },
  { type: 'apply_coupon' },
  { type: 'remove_coupon' },
  { type: 'apply_coupon', code: 10 },
  { type: 'remove_coupon', code: null },
  ...['add', 'set_qty'].flatMap((type) =>
    [0, -1, 0.5, Number.NaN, Number.POSITIVE_INFINITY, '1', null].map(
      (qty) => ({
        type,
        ref: 'spatules',
        qty,
      }),
    ),
  ),
  ...['add', 'set_qty', 'remove'].flatMap((type) => [
    { type, ref: 'unsupported-reference', qty: 1 },
    { type, ref: 'cafe-decouverte', variant: 'unsupported-variant', qty: 1 },
  ]),
];
for (const [index, action] of invalid.entries()) {
  test(`contract invalid/unsupported refusal ${index}: ${JSON.stringify(action)}`, () => {
    for (const occupied of [false, true]) {
      const engine = occupied ? populated() : createEngine();
      if (!occupied) engine.reset(seed());
      const before = engine.snapshot();
      // Deliberately cross the public boundary with invalid runtime values.
      const result = engine.dispatch(action as Action);
      expect.soft(result.accepted).toBe(false);
      expect.soft(result.code).toEqual(expect.any(String));
      expect.soft(result.code?.length).toBeGreaterThan(0);
      same(
        engine.snapshot(),
        before,
        `invalid action ${index}, occupied=${occupied}`,
      );
    }
  });
}

test('contract reset removes lab coupon availability and isolates instances', () => {
  const lab = capture('lab-two-percent-nonsequential');
  const engine = createEngine();
  engine.reset(seed(lab.seed_file));
  for (const action of lab.actions.slice(0, 4)) engine.dispatch(action);
  const untouchedLab = engine.snapshot();
  const other = populated();
  same(
    engine.snapshot(),
    untouchedLab,
    'separate instance does not mutate lab',
  );
  engine.reset(seed());
  same(engine.snapshot(), empty, 'lab to merchant reset');
  replay(engine, capture('target-mixed-replay'));
  const before = engine.snapshot();
  const result = engine.dispatch({ type: 'apply_coupon', code: 'LAB20' });
  expect(result.accepted).toBe(false);
  expect(result.code).toEqual(expect.any(String));
  same(engine.snapshot(), before, 'LAB20 unavailable in merchant seed');
  other.reset(seed(lab.seed_file));
  same(engine.snapshot(), before, 'reset in other instance has no effect');
});

test('contract snapshots are deep copies and remain stable after dispatch/reset', () => {
  const engine = populated();
  const stable = engine.snapshot();
  const detached = engine.snapshot();
  const original = structuredClone(stable);
  const line = detached.lines[0];
  const coupon = detached.coupons[0];
  expect(line).toBeDefined();
  expect(coupon).toBeDefined();
  if (line) Object.assign(line, { ref: 'tampered', qty: 999, line_total: -1 });
  if (coupon) Object.assign(coupon, { code: 'tampered', total_discount: -1 });
  Object.assign(detached.totals, { total_items: -1, total_discount_tax: -1 });
  same(engine.snapshot(), original, 'nested snapshot objects are detached');
  detached.lines.splice(0);
  detached.coupons.splice(0);
  same(engine.snapshot(), original, 'snapshot arrays are detached');
  engine.dispatch({ type: 'set_qty', ref: 'spatules', qty: 2 });
  same(stable, original, 'earlier snapshot survives dispatch');
  engine.reset(seed());
  same(stable, original, 'earlier snapshot survives reset');
  same(engine.snapshot(), empty, 'reset is empty');
});
