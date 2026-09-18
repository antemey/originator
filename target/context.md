# Target configuration

At setup, `seed.json` was deliberately unconfigured. Phase B now supplies the bounded candidate below; this is not an identified reconstruction of the merchant configuration.
`_synthetic.seed.json` is tooling data only and must never be cited as target or lab evidence.

The initial setup format used integer cents for input prices. Phase B adds an explicit decimal scale, constrained settings and measured reference associations. The stub still does not interpret pricing settings.

Before role sessions, Antoine must establish the pinned customer context, supported configuration keys and seed from evidence. Any contract extension requires operator review before freezing; unsupported settings must be explicitly rejected by the later engine.
Fixture context must exactly match its configured seed context. A lab fixture must explicitly select its separate `target/` seed.

Fixture and schema paths are repository-relative; resolved seeds cannot escape `target/`, including through symlinks. Checkpoint and decision indices are zero-based.

## Phase-A alignment caveat

The phase-A `Product.unit_price: MinorUnits`, seed schema and runtime validator forced source prices to integer cents. This is not evidence that the merchant/lab has that precision. Phase B must resolve the representation explicitly before the checkpoint, without silently rounding source data or introducing bigint/decimal dependencies. Document bounds, input precision and calculation/rounding rules from evidence.

`target/lab/` is reserved for a separate evidence-backed lab seed: two percentage coupons, sequential discounts disabled, no additional combination mode. No actual lab values or business settings are populated in phase A.

## Phase-B capture domain fixed before new outcomes — 2026-09-18

This domain was fixed after reading the existing 2026-09-16 observations, not before them. New phase-B captures start from a fresh guest session, France (FR), Paris/75001 public location only, EUR with two observable minor-unit decimals. No identity, account, checkout or payment. Shipping/fees and their aggregates are outside the output projection.

Catalogue initially limited to the observed Café Découverte — 250g / Café en grains (non moulu), and Paquet de 50 spatules. Positive quantities selected for requests in the measurement domain: coffee 1–3; accessory 1–2. This declares attempted quantities, not a promise that the merchant accepts them or that every quantity has been measured. Zero quantity is not a `set_qty` action; use remove. Native product/variation IDs will be recorded from actual responses before association with fixtures. No third product or other variant without a necessary discriminating measurement.

Use the public DECOUVERTE10 coupon and a deliberately nonexistent code only to measure refusal. Lab adds LAB20 (20%) for the same coffee eligibility; sequential discounts are fixed disabled. No other combination mode. Observe resulting coupon code spelling rather than assuming input case is retained.

The existing displayed TTC prices and observed 5.5%/20% lines do not identify merchant tax-entry configuration. Record current raw prices/precision and distinguish observed values from explicit candidate assumptions. All selected baskets remain below the advertised €100 gift threshold at observed prices. If an extra gift or excluded mechanism appears, preserve the response and exclude it from fidelity evidence unless independence of retained calculations is demonstrated; never delete it to manufacture an admissible basket.

## Prepared candidate — 2026-09-18, before implementation

The pre-capture domain above is preserved. A new measured restriction refines its interpretation: coffee quantity 3 is an attempted action with an observed refusal, not an accepted quantity. The native coffee variation reports `sold_individually=true`, maximum 1, editable false; the accessory reports editable true and was measured at quantities 1 and 2. No gift or fee appeared in retained responses; no excluded item was removed to make a basket admissible. Removing the accessory was an explicit measured in-domain action.

Quantity semantics and evidence consequences:

- `Action.qty` is the requested quantity (an increment for `add`, a desired line quantity for `set_qty`); `Decision.accepted` records the action response. `LineProjection.qty` comes from the returned item's `quantity`, never from the request. A successful action is not, by itself, proof that the requested quantity is present; inspect the returned cart.
- In `fixtures/discovery/target-transitions.json`, action 3 requests coffee quantity 3 and is refused with captured `readonly_quantity`; no immediate snapshot exists. Action 4 requests 1 and checkpoint 3 returns 1. That later success cannot prove that the preceding refusal left the cart unchanged. Coffee pricing is observed only at 1, with no measured coffee-quantity-2 outcome and no calculation demonstrated at 2 or 3.
- Action 8 requests accessory quantity 2 and checkpoint 7 actually returns 2, with line subtotal/total 250 cents HT plus 50 cents tax. This is the observed successful quantity recalculation. The unknown-coupon refusal has its own unchanged-cart checkpoint and independently covers the mandatory measured refusal case.
- Seed `max_quantity` bounds accepted cart quantities in this candidate; it is not a prefilter that removes the recorded coffee request for 3 from the action domain. Preserve that request and its actual refusal code/message. `sold_individually` and the observed quantity metadata support the coffee constraint; they do not supply uncaptured action outcomes. Generic refusal non-mutation remains a phase-C contract test obligation.

This clarification changes no public type, seed, fixture or original response: the contract already separates `Action.qty`, decisions and `LineProjection.qty`, and the fixture preserves the attempted action and actual decision separately. It corrects the coverage interpretation rather than adding pricing support at unobserved coffee quantities. Neither the request domain nor the existing invalid/unsupported-input obligations are reduced.

| Field / candidate value | Evidence and status | Remaining alternative or limitation |
| --- | --- | --- |
| Coffee native variation 8268, parent 8264, 250g/grains | Product form and direct action response; observed | Only this variation is modelled; source permalink redirects to `/nos-cafes/cafe-exception/` |
| Accessory native ID 14708 | Product endpoint and action response; observed | Only quantities 1–2 are claimed in the capture domain |
| Source scaled price 9980000 / 1500000, precision 6 | Direct Store API raw price fields; observed | These are exposed prices, not proof of native price-entry basis |
| Candidate inclusive EUR prices 9.98 / 1.50 | Explicit modelling assumption; mirror agrees on three complete retained projections | An exclusive entered price with appropriate precision remains possible on merchant |
| FR taxes 5.5% coffee, 20% accessory, noncompound | Observed line amounts compatible with these rates; explicit native lab rates | Merchant class names/configuration remain unidentified |
| Coffee sold individually; accessory quantity change enabled | Direct quantity limits and actual successful/refused POST responses | No claim for other products, stock states or larger accessory quantities |
| `decouverte10`, percentage 10, coffee eligible / accessory ineligible | Actual merchant response and mixed basket | Product restriction is the chosen mirror model; category restriction remains equally compatible |
| Combinable `LAB20`, percentage 20, same coffee eligibility | Local native coupon and measured add/remove responses | Lab only; merchant multiple-coupon behaviour is not claimed |
| Sequential discounts false | Explicit native lab option and required interaction measurement | Enabled values are rejected; no second mode exists |
| Tax rounding per line, inclusive display, tax based on FR shipping destination | Recorded lab options; candidate assumptions for merchant | Only this fixed configuration is prepared, not a general settings engine |

`unit_price` is an exact nonnegative integer in units of `10^-price_precision` EUR. Prepared products require precision 6; synthetic tooling retains explicit precision 2. Maximum source integer is 10,000,000,000; prepared quantity bounds are at most 3, with coffee accepted only at 1 and accessory measured to 2. These bounds keep represented inputs and straightforward scaled percentage products within safe-integer range; they do not justify rounding intermediates to cents. No decimal/bigint dependency is introduced. Contract/schema/runtime validation agree on these limits. The algorithm and every rounding step remain the implementation role's responsibility, guided by the pinned native source and captured cases.

Global model settings are limited to `woo-percent-v1`, sequential discounts false and tax-at-subtotal false. Prepared context is FR, guest, EUR/2, inclusive source basis. Product settings carry native ID/name, selected rate, sold-individually and a clone measurement bound. Coupon eligibility is one existing catalogue reference and individual-use false. Unknown prepared settings are refused. Native counterparts are described in the schema; clone identifiers and bounds are explicitly labelled.

Lab IDs are coffee 10 and accessory 11, both simple products; the one observed target variation is intentionally flattened with an explicit mapping. `target/lab/mirror.json` has only the nominal coupon; `target/lab/two-percent-nonsequential.json` adds LAB20 and is the immutable association for that experiment. Lab versions actually run: WordPress 6.8.2, WooCommerce 10.1.2, PHP 8.2.29, MariaDB image 11.4.8. Target Woo version remains unknown. Equal mirror results establish compatibility in this context, not unique identification or clone fidelity.

See the preparation inventory, fixture provenance and kernel model for failed experiments, projection review and remaining checkpoint items. No implementation or independent verify role has run.
