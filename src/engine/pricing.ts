import type { CartProjection, Coupon, Product } from './contract';
import {
  cents,
  checked,
  inclusiveTax,
  minor,
  roundRatio,
  SCALE,
} from './money';

export interface CartLine {
  product: Product;
  qty: number;
}

export function calculate(
  lines: CartLine[],
  coupons: Coupon[],
): CartProjection {
  const items = lines.map(({ product, qty }) => ({
    product,
    qty,
    gross: checked(product.unit_price * qty * 100),
    rate: Number(product.settings.tax_rate_percent) * 10,
    discount: 0,
  }));
  // Calculation order is independent of the cart's display order.
  const ordered = [...items].sort(
    (a, b) => b.product.unit_price - a.product.unit_price,
  );
  const couponAmounts = new Map<string, { gross: number; tax: number }>();
  for (const coupon of [...coupons].sort(
    (a, b) => Number(a.amount) - Number(b.amount),
  )) {
    const eligible = ordered.filter(
      (item) =>
        item.product.ref === coupon.settings.eligible_ref &&
        cents(item.gross - item.discount * SCALE) > 0,
    );
    const allocations = eligible.map((item) => {
      const base = cents(item.gross);
      const available = cents(item.gross - item.discount * SCALE);
      const amount = Math.min(
        available,
        Math.floor(checked(base * Number(coupon.amount)) / 100),
      );
      item.discount += amount;
      return { item, base, amount };
    });
    const baseTotal = allocations.reduce((sum, a) => checked(sum + a.base), 0);
    let remainder =
      roundRatio(checked(baseTotal * Number(coupon.amount)), 100, 'down') -
      allocations.reduce((sum, a) => checked(sum + a.amount), 0);
    // WC_Discounts reconciles a coupon's rounded total one cent per unit.
    for (const allocation of allocations) {
      for (let unit = 0; unit < allocation.item.qty && remainder > 0; unit++) {
        if (
          cents(allocation.item.gross - allocation.item.discount * SCALE) > 0
        ) {
          allocation.amount++;
          allocation.item.discount++;
          remainder--;
        }
      }
    }
    const amount = { gross: 0, tax: 0 };
    for (const allocation of allocations) {
      const gross = checked(allocation.amount * SCALE);
      amount.gross = checked(amount.gross + gross);
      amount.tax = checked(
        amount.tax + inclusiveTax(gross, allocation.item.rate),
      );
    }
    couponAmounts.set(coupon.code, amount);
  }
  const projectedLines = items.map(
    ({ product, qty, gross, rate, discount }) => {
      const subtotalTax = inclusiveTax(gross, rate);
      const discounted = checked(gross - discount * SCALE);
      const totalTax = inclusiveTax(discounted, rate);
      return {
        ref: product.ref,
        ...(product.variant === undefined ? {} : { variant: product.variant }),
        qty,
        line_subtotal: cents(gross - subtotalTax),
        line_subtotal_tax: cents(subtotalTax, 'down'),
        line_total: cents(discounted - totalTax),
        line_total_tax: cents(totalTax, 'down'),
      };
    },
  );
  let discount = 0;
  let discountTax = 0;
  const projectedCoupons = coupons.map((coupon) => {
    const amount = couponAmounts.get(coupon.code);
    if (!amount) throw new Error('Missing calculated coupon');
    discount = checked(discount + amount.gross - amount.tax);
    discountTax = checked(discountTax + amount.tax);
    return {
      code: coupon.code,
      // WC_Cart coupon getters use wc_cart_round_discount (half down).
      total_discount: cents(amount.gross - amount.tax, 'down'),
      total_discount_tax: cents(amount.tax, 'down'),
    };
  });
  return {
    lines: projectedLines,
    coupons: projectedCoupons,
    totals: {
      total_items: minor(
        projectedLines.reduce(
          (sum, line) => checked(sum + line.line_subtotal),
          0,
        ),
      ),
      total_items_tax: minor(
        projectedLines.reduce(
          (sum, line) => checked(sum + line.line_subtotal_tax),
          0,
        ),
      ),
      total_discount: cents(discount),
      total_discount_tax: cents(discountTax),
    },
  };
}
