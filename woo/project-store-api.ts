import {
  array,
  integer,
  record,
  text,
  validateCart,
} from '../harness/validate';
import type { CartProjection } from '../src/engine/contract';
import { minor } from '../src/engine/money';

export interface ItemIdentity {
  ref: string;
  variant?: string;
}
function totals(input: unknown, path: string): Record<string, unknown> {
  const value = record(input, path);
  if (value.currency_code !== 'EUR' || value.currency_minor_unit !== 2)
    throw new Error(`${path}: unsupported or missing currency metadata`);
  return value;
}
function amount(value: unknown, path: string) {
  if (typeof value !== 'string' || !/^-?\d+$/.test(value))
    throw new Error(`${path}: expected an integer monetary string`);
  return minor(Number(value));
}

// Map captured item keys explicitly. This adapter never infers references or decisions.
export function projectStoreApi(
  input: unknown,
  identities: Record<string, ItemIdentity>,
): CartProjection {
  const raw = record(input, 'cart');
  const cartTotals = totals(raw.totals, 'cart.totals');
  const projection: CartProjection = {
    lines: array(raw.items, 'cart.items').map((item, index) => {
      const value = record(item, `cart.items[${index}]`);
      text(value.key, 'item.key');
      const identity = identities[value.key];
      if (!identity)
        throw new Error(`No reference mapping for item key: ${value.key}`);
      integer(value.quantity, 'item.quantity', 1);
      const line = totals(value.totals, 'item.totals');
      return {
        ...identity,
        qty: value.quantity,
        line_subtotal: amount(line.line_subtotal, 'line_subtotal'),
        line_subtotal_tax: amount(line.line_subtotal_tax, 'line_subtotal_tax'),
        line_total: amount(line.line_total, 'line_total'),
        line_total_tax: amount(line.line_total_tax, 'line_total_tax'),
      };
    }),
    coupons: array(raw.coupons, 'cart.coupons').map((item) => {
      const value = record(item, 'coupon');
      text(value.code, 'coupon.code');
      const coupon = totals(value.totals, 'coupon.totals');
      return {
        code: value.code,
        total_discount: amount(coupon.total_discount, 'total_discount'),
        total_discount_tax: amount(
          coupon.total_discount_tax,
          'total_discount_tax',
        ),
      };
    }),
    totals: {
      total_items: amount(cartTotals.total_items, 'total_items'),
      total_items_tax: amount(cartTotals.total_items_tax, 'total_items_tax'),
      total_discount: amount(cartTotals.total_discount, 'total_discount'),
      total_discount_tax: amount(
        cartTotals.total_discount_tax,
        'total_discount_tax',
      ),
    },
  };
  validateCart(projection);
  return projection;
}
