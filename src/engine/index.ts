import type { Action, CartProjection, Engine, Seed } from './contract';
import { minor } from './money';

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

function emptyCart(): CartProjection {
  return {
    lines: [],
    coupons: [],
    totals: {
      total_items: minor(0),
      total_items_tax: minor(0),
      total_discount: minor(0),
      total_discount_tax: minor(0),
    },
  };
}

export function createEngine(): Engine {
  let seed: Seed | undefined;
  return {
    reset(nextSeed) {
      seed = structuredClone(nextSeed);
    },
    dispatch(action) {
      if (!validAction(action))
        return { accepted: false, code: 'OUT_OF_SCOPE' };
      if (
        'ref' in action &&
        !seed?.products.some(
          (p) => p.ref === action.ref && p.variant === action.variant,
        )
      ) {
        return { accepted: false, code: 'OUT_OF_SCOPE' };
      }
      // Deliberately no pricing, coupon decision logic, taxes or rounding.
      return { accepted: false, code: 'NOT_IMPLEMENTED' };
    },
    snapshot() {
      return emptyCart();
    },
  };
}
