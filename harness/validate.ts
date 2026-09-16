import { readFileSync, realpathSync } from 'node:fs';
import { basename, isAbsolute, relative, resolve, sep } from 'node:path';
import type {
  Action,
  CartProjection,
  Context,
  Projection,
  Seed,
  Settings,
} from '../src/engine/contract';

export interface Fixture {
  schema_version: 1;
  id: string;
  provenance: 'target' | 'lab' | 'derived' | 'synthetic';
  source: {
    date: string;
    url?: string;
    capture_hash?: string;
    woo_version?: string;
    extensions_detected?: string[];
    action_channel?: string;
  };
  context: Context;
  seed_file?: string;
  actions: Action[];
  expected?: Projection;
  checkpoints?: { after_action: number; expected: CartProjection }[];
  notes?: string;
}

export function fail(path: string, message: string): never {
  throw new Error(`${path}: ${message}`);
}
export function record(value: unknown, path: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    fail(path, 'expected an object');
  return value as Record<string, unknown>;
}
function keys(
  value: Record<string, unknown>,
  required: string[],
  optional: string[],
  path: string,
): void {
  for (const key of required)
    if (!(key in value)) fail(`${path}.${key}`, 'required field missing');
  for (const key of Object.keys(value))
    if (![...required, ...optional].includes(key))
      fail(`${path}.${key}`, 'unsupported field');
}
export function text(value: unknown, path: string): asserts value is string {
  if (typeof value !== 'string' || value.length === 0)
    fail(path, 'expected a nonempty string');
}
export function integer(
  value: unknown,
  path: string,
  minimum = -Number.MAX_SAFE_INTEGER,
): asserts value is number {
  if (
    typeof value !== 'number' ||
    !Number.isSafeInteger(value) ||
    value < minimum
  )
    fail(path, 'expected a safe integer in range');
}
function boolean(value: unknown, path: string): asserts value is boolean {
  if (typeof value !== 'boolean') fail(path, 'expected a boolean');
}
export function array(value: unknown, path: string): unknown[] {
  if (!Array.isArray(value)) fail(path, 'expected an array');
  return value;
}
function optionalText(
  value: Record<string, unknown>,
  fields: string[],
  path: string,
): void {
  for (const field of fields)
    if (field in value) text(value[field], `${path}.${field}`);
}
function unique(values: string[], path: string): void {
  if (new Set(values).size !== values.length) fail(path, 'duplicate identity');
}
export function lineKey(value: { ref: string; variant?: string }): string {
  return JSON.stringify([value.ref, value.variant ?? null]);
}
export function validateContext(
  input: unknown,
  path = 'context',
): asserts input is Context {
  const value = record(input, path);
  keys(
    value,
    ['country', 'role', 'currency', 'currency_minor_unit'],
    ['prices_include_tax'],
    path,
  );
  text(value.country, `${path}.country`);
  if (!/^[A-Z]{2}$/.test(value.country))
    fail(path, 'country must be an ISO two-letter code');
  if (
    value.role !== 'guest' ||
    value.currency !== 'EUR' ||
    value.currency_minor_unit !== 2
  )
    fail(path, 'unsupported customer or currency context');
  if ('prices_include_tax' in value)
    boolean(value.prices_include_tax, `${path}.prices_include_tax`);
}
export function validateAction(
  input: unknown,
  path = 'action',
): asserts input is Action {
  const value = record(input, path);
  switch (value.type) {
    case 'add':
    case 'set_qty':
      keys(value, ['type', 'ref', 'qty'], ['variant'], path);
      integer(value.qty, `${path}.qty`, 1);
      text(value.ref, `${path}.ref`);
      optionalText(value, ['variant'], path);
      return;
    case 'remove':
      keys(value, ['type', 'ref'], ['variant'], path);
      text(value.ref, `${path}.ref`);
      optionalText(value, ['variant'], path);
      return;
    case 'apply_coupon':
    case 'remove_coupon':
      keys(value, ['type', 'code'], [], path);
      text(value.code, `${path}.code`);
      return;
    default:
      fail(`${path}.type`, 'unsupported action');
  }
}
export function validateCart(
  input: unknown,
  path = 'cart',
  withDecisions = false,
): asserts input is CartProjection {
  const value = record(input, path);
  keys(
    value,
    ['lines', 'coupons', 'totals', ...(withDecisions ? ['decisions'] : [])],
    [],
    path,
  );
  const identities: string[] = [];
  for (const [i, item] of array(value.lines, `${path}.lines`).entries()) {
    const p = `${path}.lines[${i}]`;
    const line = record(item, p);
    keys(
      line,
      [
        'ref',
        'qty',
        'line_subtotal',
        'line_subtotal_tax',
        'line_total',
        'line_total_tax',
      ],
      ['variant'],
      p,
    );
    text(line.ref, `${p}.ref`);
    optionalText(line, ['variant'], p);
    integer(line.qty, `${p}.qty`, 1);
    for (const field of [
      'line_subtotal',
      'line_subtotal_tax',
      'line_total',
      'line_total_tax',
    ])
      integer(line[field], `${p}.${field}`);
    identities.push(JSON.stringify([line.ref, line.variant ?? null]));
  }
  unique(identities, `${path}.lines`);
  const codes: string[] = [];
  for (const [i, item] of array(value.coupons, `${path}.coupons`).entries()) {
    const p = `${path}.coupons[${i}]`;
    const coupon = record(item, p);
    keys(coupon, ['code', 'total_discount', 'total_discount_tax'], [], p);
    text(coupon.code, `${p}.code`);
    codes.push(coupon.code);
    integer(coupon.total_discount, `${p}.total_discount`);
    integer(coupon.total_discount_tax, `${p}.total_discount_tax`);
  }
  unique(codes, `${path}.coupons`);
  const totals = record(value.totals, `${path}.totals`);
  const fields = [
    'total_items',
    'total_items_tax',
    'total_discount',
    'total_discount_tax',
  ];
  keys(totals, fields, [], `${path}.totals`);
  for (const field of fields) integer(totals[field], `${path}.totals.${field}`);
}
export function validateProjection(
  input: unknown,
  actionCount?: number,
): asserts input is Projection {
  validateCart(input, 'projection', true);
  const value = record(input, 'projection');
  const decisions = array(value.decisions, 'projection.decisions');
  if (actionCount !== undefined && decisions.length !== actionCount)
    fail('projection.decisions', 'one ordered decision per action is required');
  for (const [i, item] of decisions.entries()) {
    const p = `projection.decisions[${i}]`;
    const decision = record(item, p);
    keys(decision, ['action_index', 'accepted'], ['code', 'message'], p);
    integer(decision.action_index, `${p}.action_index`, 0);
    if (decision.action_index !== i)
      fail(p, 'decision indices must be contiguous and ordered from zero');
    boolean(decision.accepted, `${p}.accepted`);
    optionalText(decision, ['code', 'message'], p);
  }
}
export function validateSeedPath(value: unknown): asserts value is string {
  text(value, 'seed_file');
  if (
    !/^target\/(?:[A-Za-z0-9_-]+\/)*[A-Za-z0-9_.-]+\.json$/.test(value) ||
    value.split('/').includes('..')
  )
    fail('seed_file', 'must name a JSON file under target/');
}
export function validateFixture(
  input: unknown,
  file?: string,
  requireExpected = true,
): asserts input is Fixture {
  const value = record(input, 'fixture');
  keys(
    value,
    ['schema_version', 'id', 'provenance', 'source', 'context', 'actions'],
    ['seed_file', 'expected', 'checkpoints', 'notes'],
    'fixture',
  );
  if (value.schema_version !== 1) fail('schema_version', 'expected 1');
  text(value.id, 'id');
  if (!/^[A-Za-z0-9_-]+$/.test(value.id)) fail('id', 'unsupported identifier');
  if (file && basename(file, '.json') !== value.id)
    fail('id', 'must match the JSON filename');
  if (
    !['target', 'lab', 'derived', 'synthetic'].includes(
      String(value.provenance),
    )
  )
    fail('provenance', 'unsupported provenance');
  if ((value.provenance === 'synthetic') !== value.id.startsWith('_'))
    fail('id', 'only synthetic tooling fixtures use an underscore prefix');
  const source = record(value.source, 'source');
  keys(
    source,
    ['date'],
    [
      'url',
      'capture_hash',
      'woo_version',
      'extensions_detected',
      'action_channel',
    ],
    'source',
  );
  text(source.date, 'source.date');
  if (
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(
      source.date,
    ) ||
    !Number.isFinite(Date.parse(source.date))
  )
    fail('source.date', 'expected an ISO timestamp with timezone');
  optionalText(
    source,
    ['url', 'capture_hash', 'woo_version', 'action_channel'],
    'source',
  );
  if (
    'url' in source &&
    (typeof source.url !== 'string' || !/^https?:\/\//.test(source.url))
  )
    fail('source.url', 'expected an HTTP(S) URL');
  if (
    'capture_hash' in source &&
    !/^[a-f0-9]{64}$/.test(String(source.capture_hash))
  )
    fail('source.capture_hash', 'expected SHA-256');
  if ('extensions_detected' in source)
    for (const item of array(
      source.extensions_detected,
      'source.extensions_detected',
    ))
      text(item, 'source.extensions_detected[]');
  validateContext(value.context);
  if ('seed_file' in value) validateSeedPath(value.seed_file);
  const actions = array(value.actions, 'actions');
  actions.forEach((action, i) => {
    validateAction(action, `actions[${i}]`);
  });
  if (requireExpected && !('expected' in value))
    fail('expected', 'required for verification');
  if ('expected' in value) validateProjection(value.expected, actions.length);
  if ('checkpoints' in value) {
    const indices: string[] = [];
    for (const item of array(value.checkpoints, 'checkpoints')) {
      const checkpoint = record(item, 'checkpoint');
      keys(checkpoint, ['after_action', 'expected'], [], 'checkpoint');
      integer(checkpoint.after_action, 'checkpoint.after_action', 0);
      if (checkpoint.after_action >= actions.length)
        fail('checkpoint.after_action', 'outside the action sequence');
      indices.push(String(checkpoint.after_action));
      validateCart(checkpoint.expected, 'checkpoint.expected');
    }
    unique(indices, 'checkpoints');
  }
  optionalText(value, ['notes'], 'fixture');
}
function validateSettings(
  input: unknown,
  path: string,
): asserts input is Settings {
  for (const [key, value] of Object.entries(record(input, path))) {
    if (
      !(
        typeof value === 'string' ||
        typeof value === 'boolean' ||
        (typeof value === 'number' && Number.isFinite(value))
      )
    )
      fail(`${path}.${key}`, 'expected a finite scalar setting');
  }
}
export function validateSeed(input: unknown): asserts input is Seed {
  const value = record(input, 'seed');
  keys(
    value,
    ['schema_version', 'configured', 'products', 'coupons', 'settings'],
    ['context'],
    'seed',
  );
  if (value.schema_version !== 1) fail('seed.schema_version', 'expected 1');
  boolean(value.configured, 'seed.configured');
  if ('context' in value) validateContext(value.context, 'seed.context');
  if (value.configured && !('context' in value))
    fail('seed.context', 'required for a configured seed');
  validateSettings(value.settings, 'seed.settings');
  const products = array(value.products, 'seed.products');
  const refs: string[] = [];
  for (const item of products) {
    const product = record(item, 'product');
    keys(
      product,
      ['ref', 'unit_price', 'tax_class', 'settings'],
      ['variant'],
      'product',
    );
    text(product.ref, 'product.ref');
    optionalText(product, ['variant'], 'product');
    integer(product.unit_price, 'product.unit_price', 0);
    text(product.tax_class, 'product.tax_class');
    validateSettings(product.settings, 'product.settings');
    refs.push(JSON.stringify([product.ref, product.variant ?? null]));
  }
  unique(refs, 'seed.products');
  const coupons = array(value.coupons, 'seed.coupons');
  const codes: string[] = [];
  for (const item of coupons) {
    const coupon = record(item, 'coupon');
    keys(coupon, ['code', 'type', 'amount', 'settings'], [], 'coupon');
    text(coupon.code, 'coupon.code');
    text(coupon.amount, 'coupon.amount');
    if (
      coupon.type !== 'percent' ||
      !/^\d+(?:\.\d+)?$/.test(coupon.amount) ||
      Number(coupon.amount) > 100
    )
      fail('coupon', 'expected a percentage between zero and 100');
    validateSettings(coupon.settings, 'coupon.settings');
    codes.push(coupon.code);
  }
  unique(codes, 'seed.coupons');
  if (
    !value.configured &&
    (products.length ||
      coupons.length ||
      Object.keys(record(value.settings, 'seed.settings')).length ||
      'context' in value)
  )
    fail('seed', 'an unconfigured seed must be empty');
}
export function loadFixture(file: string, requireExpected = true): Fixture {
  const value: unknown = JSON.parse(readFileSync(file, 'utf8'));
  validateFixture(value, file, requireExpected);
  return value;
}
export function resolveSeedFile(
  root: string,
  file = 'target/seed.json',
): string {
  validateSeedPath(file);
  const target = realpathSync(resolve(root, 'target'));
  const result = realpathSync(resolve(root, file));
  const rel = relative(target, result);
  if (!rel || rel === '..' || rel.startsWith(`..${sep}`) || isAbsolute(rel))
    fail('seed_file', 'resolved path escapes target/');
  return result;
}
export function loadSeed(root: string, fixture: Fixture): Seed {
  const value: unknown = JSON.parse(
    readFileSync(resolveSeedFile(root, fixture.seed_file), 'utf8'),
  );
  validateSeed(value);
  if (value.context) {
    for (const key of [
      'country',
      'role',
      'currency',
      'currency_minor_unit',
      'prices_include_tax',
    ] as const) {
      if (value.context[key] !== fixture.context[key])
        fail(`context.${key}`, 'fixture and seed contexts differ');
    }
  }
  return value;
}
