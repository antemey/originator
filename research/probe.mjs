import { existsSync, writeFileSync } from 'node:fs';
import { setTimeout } from 'node:timers/promises';

// Operator-only local reference capture. Secrets live in memory, never in output.
const mode = process.argv[2];
if (!['mirror', 'interaction'].includes(mode))
  throw new Error('Expected mirror|interaction');
const attempt = process.argv[3] ?? 'first';
if (!/^[a-z0-9-]+$/.test(attempt))
  throw new Error('Expected a simple attempt label');
const output = `ai/traces/discovery/phase-b-lab-${mode}-${attempt}.json`;
if (existsSync(output)) throw new Error(`Preserve existing capture: ${output}`);
const base = 'http://127.0.0.1:8088/?rest_route=/wc/store/v1/cart';
const initial = await fetch(base);
let nonce = initial.headers.get('Nonce');
const cookies = new Map();
function remember(response) {
  nonce = response.headers.get('Nonce') || nonce;
  for (const header of response.headers.getSetCookie()) {
    const pair = header.split(';')[0];
    const index = pair.indexOf('=');
    cookies.set(pair.slice(0, index), pair.slice(index + 1));
  }
}
function headers() {
  return {
    'Content-Type': 'application/json',
    Nonce: nonce,
    Cookie: [...cookies].map(([key, value]) => `${key}=${value}`).join('; '),
  };
}
remember(initial);
const empty = await initial.json();
if (!initial.ok || !nonce || empty.items.length)
  throw new Error('Expected a fresh empty local cart');
const records = [
  {
    date: new Date().toISOString(),
    label: 'initial-empty',
    endpoint: '',
    status: initial.status,
    payload: null,
    body: empty,
  },
];
const actions = [
  [
    'update-customer',
    {
      shipping_address: { country: 'FR', city: 'Paris', postcode: '75001' },
      billing_address: { country: 'FR', city: 'Paris', postcode: '75001' },
    },
    'context',
  ],
  ['add-item', { id: 10, quantity: 1 }, 'add-coffee'],
  ['add-item', { id: 11, quantity: 1 }, 'add-accessory'],
  ['apply-coupon', { code: 'DECOUVERTE10' }, 'apply-decouverte10'],
];
if (mode === 'interaction')
  actions.push(
    ['apply-coupon', { code: 'LAB20' }, 'apply-lab20'],
    ['remove-coupon', { code: 'LAB20' }, 'remove-lab20'],
  );
for (const [endpoint, payload, label] of actions) {
  const response = await fetch(`${base}/${endpoint}`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  });
  const body = await response.json();
  remember(response);
  records.push({
    date: new Date().toISOString(),
    label,
    endpoint,
    status: response.status,
    payload,
    body,
  });
  if (!response.ok) break;
  // The native session handler saves at shutdown, after the REST response.
  await setTimeout(250);
  const persisted = await fetch(base, { headers: headers() });
  remember(persisted);
  const snapshot = await persisted.json();
  records.push({
    date: new Date().toISOString(),
    label: `${label}-persisted`,
    endpoint: '',
    status: persisted.status,
    payload: null,
    body: snapshot,
  });
  const identity = (cart) =>
    JSON.stringify({
      items: cart.items?.map((item) => [item.id, item.quantity, item.totals]),
      coupons: cart.coupons,
      totals: cart.totals,
    });
  if (!persisted.ok || identity(snapshot) !== identity(body)) {
    console.error(
      'Cart persistence differs from action response; capture is incomplete.',
    );
    process.exitCode = 1;
    break;
  }
}
const aliases = new Map();
function sanitize(value) {
  if (Array.isArray(value)) return value.map(sanitize);
  if (!value || typeof value !== 'object') return value;
  const result = {};
  for (const [key, item] of Object.entries(value)) {
    if (/^(billing_address|shipping_address|shipping_rates)$/.test(key))
      continue;
    if (/cookie|nonce|token|authorization/i.test(key))
      result[key] = '[REDACTED]';
    else if (key === 'key' && typeof item === 'string') {
      if (!aliases.has(item)) aliases.set(item, `item-${aliases.size + 1}`);
      result[key] = aliases.get(item);
    } else result[key] = sanitize(item);
  }
  return result;
}
writeFileSync(
  output,
  `${JSON.stringify(
    {
      source: base,
      provenance: 'lab',
      woo_version: '10.1.2',
      mode,
      context: {
        country: 'FR',
        city: 'Paris',
        postcode: '75001',
        role: 'guest',
        currency: 'EUR',
      },
      redaction:
        'Headers and authorization values excluded. Addresses and shipping-rate payloads omitted. Item keys consistently aliased. Retained monetary strings unchanged.',
      records: sanitize(records),
    },
    null,
    2,
  )}\n`,
  { flag: 'wx' },
);
console.log(`${output}: ${records.length} actual responses retained`);
if (records.some((record) => record.status >= 400)) process.exitCode = 1;
