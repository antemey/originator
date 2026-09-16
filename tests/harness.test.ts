import { expect, it } from 'vitest';
import { diff, replay } from '../harness/compare';
import { validateFixture, validateSeedPath } from '../harness/validate';
import { createEngine } from '../src/engine';
import { minor } from '../src/engine/money';
import { example, syntheticSeed } from './helpers';

it('accepts the synthetic fixture and compares the executed stub, not a copied expected value', () => {
  const fixture = example();
  expect(() => validateFixture(fixture, '_example.json')).not.toThrow();
  expect(replay(createEngine(), syntheticSeed(), fixture).differences).toEqual(
    [],
  );
  if (!fixture.expected) throw new Error('Test requires expected projection');
  fixture.expected.totals.total_items = minor(1);
  const output = replay(createEngine(), syntheticSeed(), fixture);
  expect(output.projection.totals.total_items).toBe(0);
  expect(output.differences).toContainEqual({
    path: '$.totals.total_items',
    expected: 1,
    actual: 0,
  });
});
it.each([
  (value: Record<string, unknown>) => {
    delete value.expected;
  },
  (value: Record<string, unknown>) => {
    value.provenance = 'invented';
  },
  (value: Record<string, unknown>) => {
    value.actions = [{ type: 'add', ref: 'X', qty: 0 }];
  },
  (value: Record<string, unknown>) => {
    value.amount = 100;
  },
  (value: Record<string, unknown>) => {
    value.checkpoints = [{ after_action: 5, expected: {} }];
  },
])('rejects invalid verification fixture %#', (mutate) => {
  const fixture: Record<string, unknown> = { ...example() };
  mutate(fixture);
  expect(() => validateFixture(fixture)).toThrow();
});
it('rejects missing monetary fields, fractional money and incomplete actual projections', () => {
  const expected = createEngine().snapshot();
  const missing = { ...expected, totals: { total_items: 0 } };
  expect(diff(missing, expected).length).toBeGreaterThan(0);
  expect(diff(expected, missing).length).toBeGreaterThan(0);
  const fractional = {
    ...expected,
    totals: { ...expected.totals, total_items: 12.5 },
  };
  expect(diff(fractional, expected).length).toBeGreaterThan(0);
  const fixture = { ...example(), expected: { ...fractional, decisions: [] } };
  expect(() => validateFixture(fixture)).toThrow();
});
it('detects extra/missing lines and duplicates, while ignoring display order', () => {
  const line = {
    ref: 'A',
    qty: 1,
    line_subtotal: 0,
    line_subtotal_tax: 0,
    line_total: 0,
    line_total_tax: 0,
  };
  const empty = createEngine().snapshot();
  const cart = { ...empty, lines: [line, { ...line, ref: 'B' }] };
  expect(diff(cart, { ...cart, lines: [...cart.lines].reverse() })).toEqual([]);
  expect(diff(empty, cart).length).toBe(2);
  expect(diff(cart, empty).length).toBe(2);
  expect(diff(cart, { ...cart, lines: [line, line] }).length).toBeGreaterThan(
    0,
  );
  const coupons = [
    { code: 'A', total_discount: 0, total_discount_tax: 0 },
    { code: 'B', total_discount: 0, total_discount_tax: 0 },
  ];
  expect(
    diff({ ...empty, coupons }, { ...empty, coupons: [...coupons].reverse() }),
  ).toEqual([]);
});
it('checks expected messages exactly, including their original language', () => {
  const cart = createEngine().snapshot();
  const expected = {
    ...cart,
    decisions: [
      {
        action_index: 0,
        accepted: false,
        message: 'Captured synthetic message',
      },
    ],
  };
  const actual = {
    ...cart,
    decisions: [
      {
        action_index: 0,
        accepted: false,
        message: 'Different message',
        code: 'EXTRA_DETAIL',
      },
    ],
  };
  expect(diff(expected, actual)).toEqual([
    {
      path: '$.decisions[0].message',
      expected: 'Captured synthetic message',
      actual: 'Different message',
    },
  ]);
  expect(
    diff(
      { ...cart, decisions: [{ action_index: 0, accepted: false }] },
      actual,
    ),
  ).toEqual([]);
});
it('compares only explicitly captured checkpoints and preserves decision ordering', () => {
  const fixture = example();
  const checkpoint = fixture.checkpoints?.[0];
  if (!checkpoint) throw new Error('Missing synthetic checkpoint');
  checkpoint.expected.totals.total_items = minor(1);
  expect(
    replay(createEngine(), syntheticSeed(), fixture).differences[0]?.path,
  ).toContain('checkpoints[0]');
  if (!fixture.expected) throw new Error('Missing synthetic expectation');
  fixture.expected.decisions[0] = { action_index: 1, accepted: false };
  expect(() => validateFixture(fixture)).toThrow('ordered');
});
it.each([
  '../outside.json',
  '/tmp/seed.json',
  'target/../outside.json',
  'target/../../outside.json',
  'target/seed.txt',
])('rejects unsafe seed path %s', (file) => {
  expect(() => validateSeedPath(file)).toThrow();
});
