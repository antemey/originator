# Axes map — WooCommerce discount and totals engine (agent brief)

Faithful English translation of the supplied v0.1 research note, `inputs/carte-des-axes.md`. Its hypotheses and technical claims are preserved without validation, correction or expansion during setup. This is a hypothesis map for the next phase, not an authoritative contract or coverage requirement. Formula notation and status identifiers are retained from the source.

Version: 0.1, 2026-09-16. `file:line` references recorded on `trunk` on that date, in `plugins/woocommerce/includes/`. **Re-pin them to the pinned Woo version before any verdict.**

## Usage rules

- Every row is a **hypothesis** until a verdict. An empty `Verdict` column means untested.
- Status: `DUR` hard-coded (identical across all shops) · `CFG-G` global merchant setting · `CFG-C` coupon attribute · `HORS` outside the slice.
- Provenance to record in `Verdict`: `source` · `target` · `lab` · `inferred`.
- A `DUR` axis is validated locally. A `CFG-*` axis can only be claimed as verified on the target.
- The `Hook` column lists the filter through which an extension can alter the axis: if an extension detected on the target attaches to that filter, the axis becomes suspect until evidence is available.
- Slice: item amounts after discounts and taxes, excluding shipping, with a pinned customer context. The clone rejects everything marked `HORS`.

## A — Discount calculation (`class-wc-discounts.php`, `class-wc-cart-totals.php`)

| Id | Axis | Status | Ref. | Hypothesis | Observable through | Hook | Prediction | Verdict |
|---|---|---|---|---|---|---|---|---|
| A1 | Line price at internal precision | DUR | discounts:89 | `price = precision(prix_unitaire × qté)`; precision = decimal places + 2 | Store API `items[].totals.line_subtotal` | — | | |
| A2 | Percentage: floor per line | DUR | discounts:388 | `floor(price_to_discount × taux/100)` per line, in minor units | `items[].totals.line_total` | `woocommerce_coupon_get_discount_amount` (:392) | | |
| A3 | Percentage: remainder redistribution | DUR | discounts:410–413, 564–591 | cart discount = `round(total × taux)`; if Σ lines < cart discount, add 1 minor unit per item unit until the gap is filled, in line order | difference between `coupons[].totals.total_discount` and Σ `line_total` | — | | |
| A4 | Calculation base: sequential or original price | CFG-G | discounts:380, 443, 533 | `woocommerce_calc_discounts_sequentially`: `yes` → base = already discounted price; `no` → base = rounded original price | two coupons on the same line | — | | |
| A5 | Coupon application order | DUR | totals:383–402, 419–437 | sort: `fixed_product`(1) < `percent`(2) < `fixed_cart`(3); then ascending `limit_usage_to_x_items`; then, **only if sequential**, application position; then ascending amount; then descending id | compare application order with `coupons[]` | `woocommerce_coupon_sort` (:399) | | |
| A6 | Discount cap per line | DUR | discounts:400, 541 | `min(prix restant, remise)` | line at 0 | — | | |
| A7 | Fixed product: amount × quantity | DUR | discounts:428–470 | `amount × apply_quantity`, capped | `line_total` | same as A2 (:457) | | |
| A8 | Fixed cart: allocation across lines | DUR | discounts:479–510 | allocation per line via fixed product, remainder via A3 | Σ `line_total` vs `total_discount` | — | | |
| A9 | Limit to N items | CFG-C | discounts:369–378, 434, 523 | `apply_quantity = min(qté, N − déjà appliqué)`, accumulated across lines | cart with quantity > N | `woocommerce_coupon_get_apply_quantity` | | |

## B — Coupon state (state machine, `class-wc-cart.php`)

| Id | Axis | Status | Ref. | Hypothesis | Observable through | Hook | Prediction | Verdict |
|---|---|---|---|---|---|---|---|---|
| B1 | Already applied | DUR | cart:2097 | rejection, message `ALREADY_APPLIED` | POST `apply-coupon` → error | — | | |
| B2 | Individual-use coupon applied after others | CFG-C | cart:2103–2117 | removes all present coupons, then applies itself | `coupons[]` reduced to one | `woocommerce_apply_individual_use_coupon` | | |
| B3 | Ordinary coupon applied after an individual-use coupon | CFG-C | cart:2121–2131 | rejection, message `ALREADY_APPLIED_INDIV_USE_ONLY` | error, unchanged `coupons[]` | `woocommerce_apply_with_individual_use_coupon` | | |
| B4 | Removing a coupon | DUR | cart (`remove_coupon`) | full recalculation; resulting order follows A5, without remembering the previous order (except sequential A5) | `remove-coupon` then `cart` | — | | |

## C — Coupon validation (`class-wc-discounts.php`)

| Id | Axis | Status | Ref. | Hypothesis | Observable through | Hook | Prediction | Verdict |
|---|---|---|---|---|---|---|---|---|
| C1 | Exclusion of sale items | CFG-C | discounts:855, 911 | `is_on_sale()` line excluded from the base; global rejection if no eligible line remains | unchanged `line_total` for the sale line | — | | |
| C2 | Minimum cart amount | CFG-C | discounts:735–760, 1205–1212 | compared with subtotal; tax-inclusive or tax-exclusive base according to `woocommerce_tax_display_cart` (:1205) | rejection at the boundary | `woocommerce_coupon_validate_minimum_amount` | | |
| C3 | Maximum cart amount | CFG-C | discounts:768–790 | same, upper bound | rejection at the boundary | `woocommerce_coupon_validate_maximum_amount` | | |
| C4 | Product / category restriction | CFG-C | discounts (`get_items_to_apply_coupon`) | base reduced to eligible lines | `line_total` per line | — | | |
| C5 | Minimum base: before or after preceding discounts | DUR | discounts:1205–1212 | subtotal **before** discounts | threshold crossed only by an earlier discount | — | | |

## D — Taxes and rounding (`class-wc-tax.php`, `trait-wc-item-totals.php`, `wc-core-functions.php`)

| Id | Axis | Status | Ref. | Hypothesis | Observable through | Hook | Prediction | Verdict |
|---|---|---|---|---|---|---|---|---|
| D1 | Prices entered inclusive or exclusive of tax | CFG-G | totals:238 | `woocommerce_prices_include_tax`; tax-inclusive → tax extracted by `calc_inclusive_tax` (tax:128) | `totals.total_items` vs `total_items_tax` | `woocommerce_price_inc_tax_amount` (tax:149) | | |
| D2 | Tax rounding mode | CFG-G (derived) | core-functions:1882–1890 | constant `WC_TAX_ROUNDING_MODE` = `auto` by default → **half-down if tax-inclusive, half-up if tax-exclusive** | cases at x,xx5 | — | | |
| D3 | Rounding per line or at subtotal | CFG-G | item-totals (`round_at_subtotal`) | `woocommerce_tax_round_at_subtotal`: `no` → each line rounded before summation | Σ lines vs `total_tax` | — | | |
| D4 | Internal tax precision | DUR | tax:117 | `round(x, décimales + 2)` | — (internal) | `woocommerce_tax_round` | | |
| D5 | Tax calculated after discount | DUR | totals (`calculate_item_totals`) | base = discounted line | `line_total_tax` | — | | |
| D6 | Two rates in the catalogue | CFG-G | tax (classes) | breakdown by class, separate `tax_lines[]` | `totals.tax_lines[]` | — | | |
| D7 | Compound rates | CFG-G | tax:130–149 | reverse order for tax-inclusive extraction | `tax_lines[]` | — | | |
| D8 | Number of decimal places | CFG-G | `wc_get_price_decimals` | changes internal precision (A1, D4) | `totals.currency_minor_unit` | — | | |

## E — Outside the slice (rejected by the clone)

| Id | Axis | Reason |
|---|---|---|
| E1 | Shipping, free-shipping threshold, coupon `free_shipping` | slice = items only |
| E2 | Fees (`fees`) | same |
| E3 | Customer location outside the pinned context, `adjust_non_base_location_prices` (totals:449, 481) | frozen context |
| E4 | Per-user / global usage limits, expiry dates | state outside the session |
| E5 | Pricing extensions (quantity, role, category rules) | scope gate |

## Guaranteed axes for the shortlist

A2 + A3 (percentage, floor and redistribution) and B2 + B3 (individual-use state machine): `DUR`, present on every shop, discount interaction satisfied with a single code on a multi-line cart.

Remaining slots (2 or 3), to be fixed when qualifying the target: one `CFG-G` changed from its default (D1 first, then A4 or D3) and one `CFG-C` carried by the public code (C1 first).

## Minimum probes per axis (to generate locally)

- A2/A3: 3 lines at 9.99 / 4.99 / 0.01, 15% coupon — verify Σ lines = round(total × 0.15).
- A4: two `percent` coupons on one line, toggle the setting.
- A5: apply `fixed_cart` then `percent`, compare with the reverse order; repeat in sequential mode.
- B2/B3: sequences `ordinary → individual-use` and `individual-use → ordinary`.
- C1: one sale line + one non-sale line, coupon with exclusion.
- D1/D2/D3: tax-inclusive price 9.99 at 20%, quantity 3, toggle all three settings.

## Revision log

- 0.1 — initial map from `trunk`, no verdict.
