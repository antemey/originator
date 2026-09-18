import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, it } from 'vitest';
import { repoRoot } from '../harness/paths';
import { array, record } from '../harness/validate';
import { projectStoreApi } from '../woo/project-store-api';

function syntheticCart() {
  const metadata = { currency_code: 'EUR', currency_minor_unit: 2 };
  return {
    items: [
      {
        key: 'synthetic-key',
        quantity: 1,
        totals: {
          ...metadata,
          line_subtotal: '1234',
          line_subtotal_tax: '234',
          line_total: '1111',
          line_total_tax: '211',
        },
      },
    ],
    coupons: [
      {
        code: 'SYNTHETIC',
        totals: {
          ...metadata,
          total_discount: '123',
          total_discount_tax: '23',
        },
      },
    ],
    totals: {
      ...metadata,
      total_items: '1111',
      total_items_tax: '211',
      total_discount: '123',
      total_discount_tax: '23',
    },
  };
}
it('projects exposed synthetic amounts without recalculation or invented decisions', () => {
  const cart = projectStoreApi(syntheticCart(), {
    'synthetic-key': { ref: 'SYNTHETIC-ITEM' },
  });
  expect(cart.lines[0]?.line_total).toBe(1111);
  expect(cart.totals.total_items_tax).toBe(211);
  expect(cart).not.toHaveProperty('decisions');
});
it.each(['12.5', '', 'NaN', '9007199254740992'])(
  'refuses invalid monetary text %s',
  (text) => {
    const raw = syntheticCart();
    raw.totals.total_items = text;
    expect(() =>
      projectStoreApi(raw, { 'synthetic-key': { ref: 'SYNTHETIC-ITEM' } }),
    ).toThrow();
  },
);
it('refuses missing fields, missing mapping and incorrect currency metadata', () => {
  expect(() => projectStoreApi(syntheticCart(), {})).toThrow('mapping');
  const raw = syntheticCart();
  raw.totals.currency_minor_unit = 3;
  expect(() =>
    projectStoreApi(raw, { 'synthetic-key': { ref: 'SYNTHETIC-ITEM' } }),
  ).toThrow('currency');
  expect(() => projectStoreApi({}, {})).toThrow();
});

// Literal expectations transcribed directly from the retained response fields.
// In particular, the two-coupon aggregate is not the sum of displayed coupons.
it.each([
  ['phase-b-target-sequence.json', 'add-coffee', false, false],
  ['phase-b-target-sequence.json', 'apply-decouverte10', true, false],
  ['phase-b-lab-interaction-measured.json', 'apply-lab20', true, true],
] as const)(
  'audits captured monetary fields in %s / %s',
  (file, label, mixed, twoCoupons) => {
    const capture = record(
      JSON.parse(
        readFileSync(join(repoRoot, 'ai/traces/discovery', file), 'utf8'),
      ),
      'capture',
    );
    const response = array(capture.records, 'capture.records').find(
      (item) => record(item, 'record').label === label,
    );
    const raw = record(response, 'record').body;
    expect(
      projectStoreApi(raw, {
        'item-1': { ref: 'cafe-decouverte', variant: '250g-grains' },
        'item-2': { ref: 'spatules' },
      }),
    ).toEqual({
      lines: [
        {
          ref: 'cafe-decouverte',
          variant: '250g-grains',
          qty: 1,
          line_subtotal: 946,
          line_subtotal_tax: 52,
          line_total: twoCoupons ? 662 : mixed ? 851 : 946,
          line_total_tax: twoCoupons ? 36 : mixed ? 47 : 52,
        },
        ...(mixed
          ? [
              {
                ref: 'spatules',
                qty: 1,
                line_subtotal: 125,
                line_subtotal_tax: 25,
                line_total: 125,
                line_total_tax: 25,
              },
            ]
          : []),
      ],
      coupons: [
        ...(mixed
          ? [
              {
                code: 'decouverte10',
                total_discount: 95,
                total_discount_tax: 5,
              },
            ]
          : []),
        ...(twoCoupons
          ? [{ code: 'lab20', total_discount: 190, total_discount_tax: 10 }]
          : []),
      ],
      totals: {
        total_items: mixed ? 1071 : 946,
        total_items_tax: mixed ? 77 : 52,
        total_discount: twoCoupons ? 284 : mixed ? 95 : 0,
        total_discount_tax: twoCoupons ? 16 : mixed ? 5 : 0,
      },
    });
  },
);
