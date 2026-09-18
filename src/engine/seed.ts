import type { Seed } from './contract';

function object(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== 'object' || Array.isArray(input))
    throw new Error('Invalid seed object');
  return input as Record<string, unknown>;
}
function fields(
  value: Record<string, unknown>,
  required: string[],
  optional: string[] = [],
): void {
  if (
    required.some((key) => !Object.hasOwn(value, key)) ||
    Object.keys(value).some((key) => ![...required, ...optional].includes(key))
  )
    throw new Error('Missing or unsupported seed field');
}
function text(value: unknown): asserts value is string {
  if (typeof value !== 'string' || !value.length)
    throw new Error('Invalid seed string');
}
function integer(value: unknown, min: number, max: number): void {
  if (
    typeof value !== 'number' ||
    !Number.isSafeInteger(value) ||
    value < min ||
    value > max
  )
    throw new Error('Seed integer outside supported bounds');
}

export function identity(value: { ref: string; variant?: string }): string {
  return JSON.stringify([value.ref, value.variant ?? null]);
}

// Independent boundary validation: the engine cannot import the harness.
export function copySeed(input: unknown): Seed {
  const seed = object(input);
  fields(
    seed,
    ['schema_version', 'configured', 'products', 'coupons', 'settings'],
    ['context'],
  );
  if (seed.schema_version !== 1 || typeof seed.configured !== 'boolean')
    throw new Error('Unsupported seed version or configuration status');
  if (!Array.isArray(seed.products) || !Array.isArray(seed.coupons))
    throw new Error('Invalid seed catalogue');
  const settings = object(seed.settings);
  if (!seed.configured) {
    if (
      seed.products.length ||
      seed.coupons.length ||
      Object.keys(settings).length ||
      'context' in seed
    )
      throw new Error('Unconfigured seed must be empty');
    return structuredClone(input) as Seed;
  }
  const context = object(seed.context);
  fields(
    context,
    ['country', 'role', 'currency', 'currency_minor_unit'],
    ['prices_include_tax'],
  );
  if (
    context.role !== 'guest' ||
    context.currency !== 'EUR' ||
    context.currency_minor_unit !== 2 ||
    typeof context.country !== 'string' ||
    !/^[A-Z]{2}$/.test(context.country) ||
    ('prices_include_tax' in context &&
      typeof context.prices_include_tax !== 'boolean')
  )
    throw new Error('Unsupported seed context');
  const tooling =
    Object.keys(settings).length === 0 &&
    seed.coupons.length === 0 &&
    seed.products.every((p: unknown) => object(p).tax_class === 'synthetic');
  if (!tooling) {
    fields(settings, [
      'model',
      'sequential_discounts',
      'round_tax_at_subtotal',
    ]);
    if (
      settings.model !== 'woo-percent-v1' ||
      settings.sequential_discounts !== false ||
      settings.round_tax_at_subtotal !== false ||
      context.country !== 'FR' ||
      context.prices_include_tax !== true
    )
      throw new Error(
        'Unsupported seed settings: requires inclusive FR non-sequential woo-percent-v1',
      );
  }
  const identities = new Set<string>();
  const references = new Set<string>();
  for (const inputProduct of seed.products) {
    const p = object(inputProduct);
    fields(
      p,
      ['ref', 'unit_price', 'price_precision', 'tax_class', 'settings'],
      ['variant'],
    );
    text(p.ref);
    text(p.tax_class);
    if ('variant' in p) text(p.variant);
    integer(p.unit_price, 0, 10_000_000_000);
    if (p.price_precision !== 6 && !(tooling && p.price_precision === 2))
      throw new Error('Unsupported source price precision');
    const key = JSON.stringify([p.ref, p.variant ?? null]);
    if (identities.has(key)) throw new Error('Duplicate product identity');
    identities.add(key);
    references.add(p.ref);
    const s = object(p.settings);
    if (tooling) {
      fields(s, []);
      continue;
    }
    fields(s, [
      'tax_rate_percent',
      'sold_individually',
      'max_quantity',
      'name',
      'native_id',
    ]);
    if (
      !['5.5', '20'].includes(String(s.tax_rate_percent)) ||
      typeof s.tax_rate_percent !== 'string' ||
      typeof s.sold_individually !== 'boolean'
    )
      throw new Error('Unsupported product settings');
    integer(s.max_quantity, 1, 3);
    if (s.sold_individually && s.max_quantity !== 1)
      throw new Error('Sold-individually quantity must be one');
    text(s.name);
    integer(s.native_id, 1, Number.MAX_SAFE_INTEGER);
  }
  const codes = new Set<string>();
  for (const inputCoupon of seed.coupons) {
    const c = object(inputCoupon);
    fields(c, ['code', 'type', 'amount', 'settings']);
    text(c.code);
    if (c.type !== 'percent' || (c.amount !== '10' && c.amount !== '20'))
      throw new Error('Unsupported coupon type or amount');
    const code = c.code.toLowerCase();
    if (codes.has(code)) throw new Error('Duplicate coupon identity');
    codes.add(code);
    const s = object(c.settings);
    fields(s, ['eligible_ref', 'individual_use']);
    if (
      typeof s.eligible_ref !== 'string' ||
      !references.has(s.eligible_ref) ||
      s.individual_use !== false
    )
      throw new Error('Unsupported coupon eligibility settings');
  }
  const copy = structuredClone(input) as Seed;
  for (const coupon of copy.coupons) coupon.code = coupon.code.toLowerCase();
  return copy;
}
