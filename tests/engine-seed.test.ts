import { expect, it } from 'vitest';
import { validateSeed } from '../harness/validate';
import type { Seed } from '../src/engine';
import { createEngine } from '../src/engine';
import { accept, discovery } from './engine-support';
import { syntheticSeed } from './helpers';

type InvalidSeed = (seed: Seed) => unknown;
const invalid: [string, InvalidSeed][] = [
  [
    'missing source price',
    (seed) => {
      const p = seed.products[0];
      if (p) Reflect.deleteProperty(p, 'unit_price');
      return seed;
    },
  ],
  [
    'fractional source integer',
    (seed) => {
      const p = seed.products[0];
      if (p) p.unit_price = 1.5;
      return seed;
    },
  ],
  [
    'unsafe source amount',
    (seed) => {
      const p = seed.products[0];
      if (p) p.unit_price = 10_000_000_001;
      return seed;
    },
  ],
  [
    'unsupported precision',
    (seed) => {
      const p = seed.products[0];
      if (p) p.price_precision = 2;
      return seed;
    },
  ],
  [
    'unknown global setting',
    (seed) => {
      seed.settings.unknown = true;
      return seed;
    },
  ],
  [
    'sequential discounts',
    (seed) => {
      seed.settings.sequential_discounts = true;
      return seed;
    },
  ],
  [
    'subtotal tax rounding',
    (seed) => {
      seed.settings.round_tax_at_subtotal = true;
      return seed;
    },
  ],
  [
    'missing tax rate',
    (seed) => {
      const p = seed.products[0];
      if (p) delete p.settings.tax_rate_percent;
      return seed;
    },
  ],
  [
    'unknown product setting',
    (seed) => {
      const p = seed.products[0];
      if (p) p.settings.unknown = true;
      return seed;
    },
  ],
  [
    'unknown coupon setting',
    (seed) => {
      const c = seed.coupons[0];
      if (c) c.settings.unknown = true;
      return seed;
    },
  ],
  [
    'unsupported context',
    (seed) => {
      if (seed.context) seed.context.prices_include_tax = false;
      return seed;
    },
  ],
  [
    'duplicate product',
    (seed) => {
      const p = seed.products[0];
      if (p) seed.products.push(structuredClone(p));
      return seed;
    },
  ],
  [
    'duplicate normalized coupon',
    (seed) => {
      const c = seed.coupons[0];
      if (c) seed.coupons.push({ ...c, code: c.code.toUpperCase() });
      return seed;
    },
  ],
  [
    'missing product array',
    (seed) => {
      Reflect.deleteProperty(seed, 'products');
      return seed;
    },
  ],
  ['null', () => null],
];

it.each(invalid)(
  'refuses %s on reset without replacing the previous valid state',
  (label, mutate) => {
    const engine = createEngine();
    engine.reset(discovery().seed);
    accept(engine);
    const before = engine.snapshot();
    const candidate = mutate(discovery().seed);
    // Known deliberate difference: the harness checks literal code identities;
    // the engine rejects case aliases because dispatch normalizes coupon codes.
    if (label === 'duplicate normalized coupon')
      expect(() => validateSeed(candidate)).not.toThrow();
    else expect(() => validateSeed(candidate)).toThrow();
    expect(() => engine.reset(candidate as Seed)).toThrow();
    expect(engine.snapshot()).toEqual(before);
    accept(engine, [{ type: 'remove_coupon', code: 'DECOUVERTE10' }]);
    expect(engine.snapshot().lines[0]?.line_total).toBe(946);
  },
);

it('unconfigured reset clears a populated cart and refuses subsequent work', () => {
  const engine = createEngine();
  engine.reset(discovery().seed);
  accept(engine);
  engine.reset({
    schema_version: 1,
    configured: false,
    products: [],
    coupons: [],
    settings: {},
  });
  expect(engine.snapshot()).toEqual(createEngine().snapshot());
  expect(engine.dispatch({ type: 'add', ref: 'spatules', qty: 1 })).toEqual({
    accepted: false,
    code: 'NOT_CONFIGURED',
  });
});

it.each([
  'target-transitions',
  'target-mixed-replay',
  'lab-mirror-mixed',
  'lab-two-percent-nonsequential',
])(
  'harness and engine accept the frozen seed selected by %s without changing it',
  (id) => {
    const { seed } = discovery(id);
    const original = structuredClone(seed);
    expect(() => validateSeed(seed)).not.toThrow();
    expect(() => createEngine().reset(seed)).not.toThrow();
    expect(seed).toEqual(original);
  },
);

it('harness and engine accept the legacy tooling seed and empty unconfigured seed', () => {
  for (const seed of [
    syntheticSeed(),
    {
      schema_version: 1,
      configured: false,
      products: [],
      coupons: [],
      settings: {},
    } satisfies Seed,
  ]) {
    expect(() => validateSeed(seed)).not.toThrow();
    expect(() => createEngine().reset(seed)).not.toThrow();
  }
});

it.each([
  ['unit_price', 0, true],
  ['unit_price', 10_000_000_000, true],
  ['unit_price', -1, false],
  ['unit_price', 10_000_000_001, false],
  ['unit_price', Number.MAX_SAFE_INTEGER + 1, false],
  ['unit_price', Number.NaN, false],
  ['unit_price', Number.POSITIVE_INFINITY, false],
  ['max_quantity', 1, true],
  ['max_quantity', 3, true],
  ['max_quantity', 0, false],
  ['max_quantity', 4, false],
  ['max_quantity', 1.5, false],
  ['native_id', 1, true],
  ['native_id', Number.MAX_SAFE_INTEGER, true],
  ['native_id', 0, false],
  ['native_id', Number.MAX_SAFE_INTEGER + 1, false],
] as const)(
  'harness and engine agree on derived %s=%s (valid=%s)',
  (field, value, valid) => {
    const { seed } = discovery();
    const product = seed.products[1];
    if (!product) throw new Error('Missing accessory');
    if (field === 'unit_price') product.unit_price = value;
    else product.settings[field] = value;
    const engine = createEngine();
    engine.reset(discovery().seed);
    accept(engine);
    const before = engine.snapshot();
    if (valid) {
      expect(() => validateSeed(seed)).not.toThrow();
      expect(() => engine.reset(seed)).not.toThrow();
      expect(engine.snapshot()).toEqual(createEngine().snapshot());
    } else {
      expect(() => validateSeed(seed)).toThrow();
      expect(() => engine.reset(seed)).toThrow();
      expect(engine.snapshot()).toEqual(before);
    }
  },
);
