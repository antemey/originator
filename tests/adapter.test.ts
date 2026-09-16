import { expect, it } from 'vitest';
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
