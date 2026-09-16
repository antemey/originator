import type { MinorUnits } from './money';

export interface Context {
  country: string;
  role: 'guest';
  currency: 'EUR';
  currency_minor_unit: 2;
  prices_include_tax?: boolean;
}

// Configuration values are evidence-backed inputs, never inferred by the stub.
export type Settings = Record<string, string | number | boolean>;
export interface Product {
  ref: string;
  variant?: string;
  unit_price: MinorUnits;
  tax_class: string;
  settings: Settings;
}
export interface Coupon {
  code: string;
  type: 'percent';
  amount: string;
  settings: Settings;
}
export interface Seed {
  schema_version: 1;
  configured: boolean;
  context?: Context;
  products: Product[];
  coupons: Coupon[];
  settings: Settings;
}
export type Action =
  | { type: 'add' | 'set_qty'; ref: string; variant?: string; qty: number }
  | { type: 'remove'; ref: string; variant?: string }
  | { type: 'apply_coupon' | 'remove_coupon'; code: string };

export type Result =
  | { accepted: true; code?: string; message?: string }
  | { accepted: false; code: string; message?: string };
export interface Decision {
  action_index: number;
  accepted: boolean;
  code?: string;
  message?: string;
}
export interface LineProjection {
  ref: string;
  variant?: string;
  qty: number;
  line_subtotal: MinorUnits;
  line_subtotal_tax: MinorUnits;
  line_total: MinorUnits;
  line_total_tax: MinorUnits;
}
export interface CouponProjection {
  code: string;
  total_discount: MinorUnits;
  total_discount_tax: MinorUnits;
}
export interface CartProjection {
  lines: LineProjection[];
  coupons: CouponProjection[];
  totals: {
    total_items: MinorUnits;
    total_items_tax: MinorUnits;
    total_discount: MinorUnits;
    total_discount_tax: MinorUnits;
  };
}
export interface Projection extends CartProjection {
  decisions: Decision[];
}
export interface Engine {
  reset(seed: Seed): void;
  dispatch(action: Action): Result;
  snapshot(): CartProjection;
}
