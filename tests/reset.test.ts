import { expect, it } from 'vitest';
import { replay } from '../harness/compare';
import { createEngine } from '../src/engine';
import { minor } from '../src/engine/money';
import { accept, coffee, discovery } from './engine-support';

it('reset discards nonempty lines, coupons and totals', () => {
  const engine = createEngine();
  const { seed } = discovery('lab-two-percent-nonsequential');
  engine.reset(seed);
  const empty = engine.snapshot();
  accept(engine);
  accept(engine, [{ type: 'apply_coupon', code: 'LAB20' }]);
  expect(engine.snapshot().lines).toHaveLength(2);
  expect(engine.snapshot().coupons).toHaveLength(2);
  expect(engine.snapshot().totals.total_discount).toBe(284);
  engine.reset(seed);
  expect(engine.snapshot()).toEqual(empty);
  accept(engine, [{ type: 'add', ...coffee, qty: 1 }]);
  expect(engine.snapshot().lines[0]?.line_total).toBe(946);
  expect(engine.snapshot().coupons).toEqual([]);
});

it.each(['target-transitions', 'lab-two-percent-nonsequential'])(
  'reset and replay reproduce every decision and captured checkpoint: %s',
  (id) => {
    const engine = createEngine();
    const { seed, fixture } = discovery(id);
    const first = replay(engine, seed, fixture);
    expect(first.differences).toEqual([]);
    expect(first.projection.lines.length).toBeGreaterThan(0);
    const second = replay(engine, seed, fixture);
    expect(second).toEqual(first);
  },
);

it('reset copies nested seed data; snapshots copy rows, arrays and totals', () => {
  const engine = createEngine();
  const { seed } = discovery();
  const pristine = structuredClone(seed);
  engine.reset(seed);
  const product = seed.products[0];
  const coupon = seed.coupons[0];
  if (!product || !coupon || !seed.context)
    throw new Error('Missing prepared inputs');
  product.unit_price = 1;
  product.settings.max_quantity = 0;
  coupon.amount = '20';
  coupon.settings.eligible_ref = 'spatules';
  seed.context.country = 'US';
  seed.settings.sequential_discounts = true;
  seed.products.length = 0;
  seed.coupons.length = 0;
  accept(engine);
  const saved = engine.snapshot();
  const exposed = engine.snapshot();
  const line = exposed.lines[0];
  const applied = exposed.coupons[0];
  if (!line || !applied) throw new Error('Expected a populated snapshot');
  line.qty = 99;
  line.ref = 'mutated';
  line.line_total = minor(0);
  applied.code = 'mutated';
  applied.total_discount = minor(0);
  exposed.lines.length = 0;
  exposed.coupons.length = 0;
  exposed.totals.total_items = minor(999);
  expect(engine.snapshot()).toEqual(saved);
  const independent = createEngine();
  independent.reset(pristine);
  accept(independent);
  expect(engine.snapshot()).toEqual(independent.snapshot());
  accept(engine, [{ type: 'set_qty', ref: 'spatules', qty: 2 }]);
  expect(saved.lines[1]?.qty).toBe(1);
  expect(independent.snapshot()).toEqual(saved);
});

it('switching seeds removes the previous coupon catalogue and configuration', () => {
  const engine = createEngine();
  engine.reset(discovery('lab-two-percent-nonsequential').seed);
  accept(engine);
  accept(engine, [{ type: 'apply_coupon', code: 'LAB20' }]);
  engine.reset(discovery().seed);
  accept(engine);
  const before = engine.snapshot();
  expect(
    engine.dispatch({ type: 'apply_coupon', code: 'LAB20' }).accepted,
  ).toBe(false);
  expect(engine.snapshot()).toEqual(before);
  expect(before.totals.total_discount).toBe(95);
});
