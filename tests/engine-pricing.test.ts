import { expect, it } from 'vitest';
import { diff } from '../harness/compare';
import { createEngine } from '../src/engine';
import { accept, coffee, discovery } from './engine-support';

it('two non-sequential coupons use separate rendering and aggregate rounding', () => {
  const engine = createEngine();
  engine.reset(discovery('lab-two-percent-nonsequential').seed);
  accept(engine);
  const single = engine.snapshot();
  accept(engine, [{ type: 'apply_coupon', code: 'LAB20' }]);
  const both = engine.snapshot();
  // Literal independent lab observation: apply-lab20 in the retained capture.
  expect(both.lines[0]).toMatchObject({ line_total: 662, line_total_tax: 36 });
  expect(both.coupons).toEqual([
    { code: 'decouverte10', total_discount: 95, total_discount_tax: 5 },
    { code: 'lab20', total_discount: 190, total_discount_tax: 10 },
  ]);
  expect(both.totals).toEqual({
    total_items: 1071,
    total_items_tax: 77,
    total_discount: 284,
    total_discount_tax: 16,
  });
  accept(engine, [{ type: 'remove_coupon', code: 'LaB20' }]);
  expect(engine.snapshot()).toEqual(single);
});

it('reversing coupon and line insertion order preserves calculated identities', () => {
  const seed = discovery('lab-two-percent-nonsequential').seed;
  const first = createEngine();
  first.reset(seed);
  accept(first);
  accept(first, [{ type: 'apply_coupon', code: 'LAB20' }]);
  const second = createEngine();
  second.reset(seed);
  accept(second, [
    { type: 'add', ref: 'spatules', qty: 1 },
    { type: 'add', ...coffee, qty: 1 },
    { type: 'apply_coupon', code: 'LAB20' },
    { type: 'apply_coupon', code: 'DECOUVERTE10' },
  ]);
  expect(diff(first.snapshot(), second.snapshot())).toEqual([]);
});

it('add increments and set_qty replaces quantity; removal recalculates all amounts', () => {
  const engine = createEngine();
  engine.reset(discovery().seed);
  accept(engine);
  const one = engine.snapshot();
  accept(engine, [{ type: 'add', ref: 'spatules', qty: 1 }]);
  expect(engine.snapshot().lines[1]).toMatchObject({
    qty: 2,
    line_total: 250,
    line_total_tax: 50,
  });
  expect(engine.snapshot().totals).toMatchObject({
    total_items: 1196,
    total_items_tax: 102,
    total_discount: 95,
  });
  accept(engine, [{ type: 'set_qty', ref: 'spatules', qty: 1 }]);
  expect(engine.snapshot()).toEqual(one);
  accept(engine, [{ type: 'remove', ref: 'spatules' }]);
  expect(engine.snapshot().totals).toEqual({
    total_items: 946,
    total_items_tax: 52,
    total_discount: 95,
    total_discount_tax: 5,
  });
});

it.each([
  [1_004_999, 167, 33],
  [1_005_000, 168, 33],
  [1_005_001, 168, 34],
])(
  'derived arithmetic keeps six-decimal source %i until line rounding',
  (price, net, tax) => {
    // Derived arithmetic probes, not target or lab measurements.
    // At 1.005 EUR × 2, net is 1.675 and tax .335: distinct tie modes.
    const { seed } = discovery();
    const accessory = seed.products[1];
    if (!accessory) throw new Error('Missing accessory');
    accessory.unit_price = price;
    const engine = createEngine();
    engine.reset(seed);
    accept(engine, [{ type: 'add', ref: accessory.ref, qty: 2 }]);
    expect(engine.snapshot().lines[0]).toMatchObject({
      qty: 2,
      line_subtotal: net,
      line_subtotal_tax: tax,
      line_total: net,
      line_total_tax: tax,
    });
  },
);

it('pricing follows renamed catalogue, explicit prices and coupon eligibility', () => {
  const { seed } = discovery();
  const product = seed.products[0];
  const coupon = seed.coupons[0];
  if (!product || !coupon) throw new Error('Missing prepared input');
  product.ref = 'derived-product';
  product.variant = 'derived-variant';
  product.unit_price = 10_550_000;
  product.settings.name = 'Derived product';
  coupon.code = 'DERIVED10';
  coupon.settings.eligible_ref = product.ref;
  const engine = createEngine();
  engine.reset(seed);
  accept(engine, [
    { type: 'add', ref: product.ref, variant: product.variant, qty: 1 },
    { type: 'apply_coupon', code: coupon.code },
  ]);
  // 1055 cents inclusive at 5.5% gives exactly 1000 net + 55 tax.
  // 10% of 1055 is a half-cent discount, rounded half down to 105.
  expect(engine.snapshot().lines[0]).toMatchObject({
    ref: product.ref,
    variant: product.variant,
    line_subtotal: 1000,
    line_subtotal_tax: 55,
    line_total: 900,
    line_total_tax: 50,
  });
  expect(engine.snapshot().coupons[0]).toEqual({
    code: 'derived10',
    total_discount: 100,
    total_discount_tax: 5,
  });
});

it('source-derived sold-individually initial add normalizes quantity, without pricing unobserved units', () => {
  const engine = createEngine();
  engine.reset(discovery().seed);
  accept(engine, [{ type: 'add', ...coffee, qty: 3 }]);
  expect(engine.snapshot().lines[0]).toMatchObject({
    qty: 1,
    line_subtotal: 946,
  });
});

it('source-derived coupon half ties round down independently of aggregate rendering', () => {
  const { seed } = discovery();
  const accessory = seed.products[1];
  const coupon = seed.coupons[0];
  if (!accessory || !coupon) throw new Error('Missing prepared input');
  accessory.unit_price = 300_000;
  coupon.settings.eligible_ref = accessory.ref;
  const engine = createEngine();
  engine.reset(seed);
  accept(engine, [
    { type: 'add', ref: accessory.ref, qty: 1 },
    { type: 'apply_coupon', code: coupon.code },
  ]);
  // 30 gross cents, discount 3; coupon net 2.5 and tax .5, half down.
  // Cart aggregate fields retain the raw components until API rendering.
  expect(engine.snapshot().coupons[0]).toEqual({
    code: coupon.code,
    total_discount: 2,
    total_discount_tax: 0,
  });
  expect(engine.snapshot().totals).toMatchObject({
    total_discount: 3,
    total_discount_tax: 1,
  });
});

it('source-derived eligibility loss removes coupons and re-add does not resurrect them', () => {
  const engine = createEngine();
  engine.reset(discovery('lab-two-percent-nonsequential').seed);
  accept(engine);
  accept(engine, [
    { type: 'apply_coupon', code: 'LAB20' },
    { type: 'remove', ...coffee },
  ]);
  expect(engine.snapshot().coupons).toEqual([]);
  expect(engine.snapshot().totals).toEqual({
    total_items: 125,
    total_items_tax: 25,
    total_discount: 0,
    total_discount_tax: 0,
  });
  accept(engine, [{ type: 'add', ...coffee, qty: 1 }]);
  expect(engine.snapshot().coupons).toEqual([]);
  expect(
    engine.snapshot().lines.find((line) => line.ref === coffee.ref)?.line_total,
  ).toBe(946);
});

it.each([
  [1_054_999, 91, 9],
  [1_055_000, 90, 10],
])(
  'derived six-decimal price %i crosses the coupon base rounding threshold',
  (price, net, discount) => {
    const { seed } = discovery();
    const product = seed.products[0];
    if (!product) throw new Error('Missing product');
    product.unit_price = price;
    const engine = createEngine();
    engine.reset(seed);
    accept(engine, [
      { type: 'add', ...coffee, qty: 1 },
      { type: 'apply_coupon', code: 'DECOUVERTE10' },
    ]);
    // Derived from the documented native stages, not engine-generated expectations:
    // 105.4999 / 105.5000 gross cents round to coupon bases 105 / 106.
    // Their 10% discounts reconcile half down to 10 / 11 gross cents.
    // Retain the original gross for the line: 95.4999 / 94.5000 after discount.
    // At 5.5% inclusive tax those render as net 91 / 90, tax 5 in both cases.
    expect(engine.snapshot().lines).toEqual([
      {
        ...coffee,
        qty: 1,
        line_subtotal: 100,
        line_subtotal_tax: 5,
        line_total: net,
        line_total_tax: 5,
      },
    ]);
    expect(engine.snapshot().coupons).toEqual([
      {
        code: 'decouverte10',
        total_discount: discount,
        total_discount_tax: 1,
      },
    ]);
    expect(engine.snapshot().totals).toEqual({
      total_items: 100,
      total_items_tax: 5,
      total_discount: discount,
      total_discount_tax: 1,
    });
  },
);

it('derived remainder goes to the higher-priced eligible variant regardless of insertion order', () => {
  const { seed } = discovery();
  const product = seed.products[0];
  if (!product) throw new Error('Missing product');
  seed.products = [
    { ...structuredClone(product), variant: 'higher', unit_price: 1_080_000 },
    { ...structuredClone(product), variant: 'lower', unit_price: 1_030_000 },
  ];
  // 108 + 103 gross cents: preliminary discounts 10 + 10, target 21.
  // The higher unit price receives the remainder: final gross 97 and 93.
  // Both orders must match literal amounts, not merely each other.
  for (const variants of [
    ['higher', 'lower'],
    ['lower', 'higher'],
  ]) {
    const engine = createEngine();
    engine.reset(seed);
    accept(
      engine,
      variants.map((variant) => ({
        type: 'add',
        ref: product.ref,
        variant,
        qty: 1,
      })),
    );
    accept(engine, [{ type: 'apply_coupon', code: 'DECOUVERTE10' }]);
    const cart = engine.snapshot();
    expect(cart.lines.find((line) => line.variant === 'higher')).toEqual({
      ref: product.ref,
      variant: 'higher',
      qty: 1,
      line_subtotal: 102,
      line_subtotal_tax: 6,
      line_total: 92,
      line_total_tax: 5,
    });
    expect(cart.lines.find((line) => line.variant === 'lower')).toEqual({
      ref: product.ref,
      variant: 'lower',
      qty: 1,
      line_subtotal: 98,
      line_subtotal_tax: 5,
      line_total: 88,
      line_total_tax: 5,
    });
    expect(cart.coupons).toEqual([
      { code: 'decouverte10', total_discount: 20, total_discount_tax: 1 },
    ]);
    expect(cart.totals).toEqual({
      total_items: 200,
      total_items_tax: 11,
      total_discount: 20,
      total_discount_tax: 1,
    });
    accept(engine, [{ type: 'remove', ref: product.ref, variant: 'higher' }]);
    expect(engine.snapshot().totals).toEqual({
      total_items: 98,
      total_items_tax: 5,
      total_discount: 9,
      total_discount_tax: 1,
    });
  }
});

it('derived maximum source price and quantity stay exact with a percentage coupon', () => {
  const { seed } = discovery('lab-two-percent-nonsequential');
  const product = seed.products[1];
  if (!product) throw new Error('Missing accessory');
  product.unit_price = 10_000_000_000;
  product.settings.max_quantity = 3;
  for (const coupon of seed.coupons) coupon.settings.eligible_ref = product.ref;
  const engine = createEngine();
  engine.reset(seed);
  accept(engine, [
    { type: 'add', ref: product.ref, qty: 3 },
    { type: 'apply_coupon', code: 'LAB20' },
  ]);
  expect(engine.snapshot().lines[0]).toEqual({
    ref: product.ref,
    qty: 3,
    line_subtotal: 2_500_000,
    line_subtotal_tax: 500_000,
    line_total: 2_000_000,
    line_total_tax: 400_000,
  });
  expect(engine.snapshot().totals).toEqual({
    total_items: 2_500_000,
    total_items_tax: 500_000,
    total_discount: 500_000,
    total_discount_tax: 100_000,
  });
  const before = engine.snapshot();
  expect(
    engine.dispatch({ type: 'add', ref: product.ref, qty: 1 }).accepted,
  ).toBe(false);
  expect(engine.snapshot()).toEqual(before);
});
