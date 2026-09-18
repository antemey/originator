import type { Action, Coupon, Engine, Result, Seed } from './contract';
import { type CartLine, calculate } from './pricing';
import { copySeed, identity } from './seed';

export type * from './contract';

function validAction(input: unknown): input is Action {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return false;
  const value = input as Record<string, unknown>;
  const text = (v: unknown) => typeof v === 'string' && v.length > 0;
  switch (value.type) {
    case 'add':
    case 'set_qty':
    case 'remove':
      return (
        text(value.ref) &&
        (!('variant' in value) || text(value.variant)) &&
        (value.type === 'remove' ||
          (Number.isSafeInteger(value.qty) && Number(value.qty) > 0)) &&
        Object.keys(value).every((key) =>
          [
            'type',
            'ref',
            'variant',
            ...(value.type === 'remove' ? [] : ['qty']),
          ].includes(key),
        )
      );
    case 'apply_coupon':
    case 'remove_coupon':
      return (
        text(value.code) &&
        Object.keys(value).every((key) => ['type', 'code'].includes(key))
      );
    default:
      return false;
  }
}

export function createEngine(): Engine {
  let seed: Seed | undefined;
  let lines: CartLine[] = [];
  let coupons: Coupon[] = [];
  let cart = calculate(lines, coupons);
  const refuse = (code = 'OUT_OF_SCOPE'): Result => ({ accepted: false, code });
  return {
    reset(nextSeed) {
      const copy = copySeed(nextSeed);
      seed = copy;
      lines = [];
      coupons = [];
      cart = calculate(lines, coupons);
    },
    dispatch(action) {
      if (!validAction(action)) return refuse();
      if (!seed?.configured) return refuse('NOT_CONFIGURED');
      const product =
        'ref' in action
          ? seed.products.find((p) => identity(p) === identity(action))
          : undefined;
      if ('ref' in action && !product) return refuse();
      // Synthetic inputs contain no evidenced tax/pricing model.
      if (seed.settings.model !== 'woo-percent-v1')
        return refuse('NOT_IMPLEMENTED');
      let nextLines = lines.map((line) => ({ ...line }));
      let nextCoupons = [...coupons];
      if ('ref' in action && product) {
        const line = nextLines.find(
          (l) => identity(l.product) === identity(product),
        );
        if (action.type !== 'add' && !line)
          return refuse('woocommerce_rest_cart_invalid_key');
        if (action.type === 'remove') {
          nextLines = nextLines.filter((l) => l !== line);
        } else {
          const increment =
            action.type === 'add' && product.settings.sold_individually
              ? 1
              : action.qty;
          const qty =
            action.type === 'add' ? (line?.qty ?? 0) + increment : action.qty;
          if (product.settings.sold_individually && qty > 1) {
            return {
              accepted: false,
              code: 'readonly_quantity',
              message: `La quantité de « ${product.settings.name} » ne peut pas être modifiée`,
            };
          }
          if (
            !Number.isSafeInteger(qty) ||
            qty > Number(product.settings.max_quantity)
          )
            return refuse();
          if (line) line.qty = qty;
          else nextLines.push({ product, qty });
        }
        nextCoupons = nextCoupons.filter((coupon) =>
          nextLines.some((l) => l.product.ref === coupon.settings.eligible_ref),
        );
      } else if ('code' in action) {
        const code = action.code.toLowerCase();
        const coupon = seed.coupons.find((c) => c.code === code);
        const applied = nextCoupons.some((c) => c.code === code);
        if (action.type === 'remove_coupon') {
          if (!applied) return refuse('woocommerce_rest_cart_coupon_error');
          nextCoupons = nextCoupons.filter((c) => c.code !== code);
        } else {
          if (!coupon) {
            return {
              accepted: false,
              code: 'woocommerce_rest_cart_coupon_error',
              message: `Le code promo &laquo;&nbsp;${code}&nbsp;&raquo; n’existe pas !`,
            };
          }
          if (
            applied ||
            !nextLines.some(
              (l) => l.product.ref === coupon.settings.eligible_ref,
            )
          )
            return refuse('woocommerce_rest_cart_coupon_error');
          nextCoupons.push(coupon);
        }
      }
      try {
        const nextCart = calculate(nextLines, nextCoupons);
        lines = nextLines;
        coupons = nextCoupons;
        cart = nextCart;
        return { accepted: true };
      } catch (error) {
        if (error instanceof RangeError) return refuse('OUT_OF_BOUNDS');
        throw error;
      }
    },
    snapshot() {
      return structuredClone(cart);
    },
  };
}
