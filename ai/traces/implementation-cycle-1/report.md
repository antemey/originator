# Implementation cycle 1 — operator handoff

Date: 2026-09-18. Role: implementation. Cycle: 1 of 3; no verification role launched.

## Starting checkpoint and information boundary

`git rev-parse HEAD` returned `6ef398146251812b048b601277b928b8ffe4cf5b`. `git status --short` was empty; both `git diff --quiet` and `git diff --cached --quiet` succeeded before edits. No commit, staging, push, role selection, new capture or Woo launch occurred.

Read the active override, scope, constitution, public contract, target context, prepared seeds, discovery fixtures and direct discovery evidence. The original kernel model was read and extended before engine edits. The current user's fresh-session restriction took precedence over historical references to session handoffs, setup notes and prompt archives: those potential operator summaries were not imported. No reserved recipe/outcome or protected case contents were accessed. Existing full-check tooling emitted its own synthetic evaluation test diagnostics; these are not real evaluation outcomes and were not used as business evidence.

Read public native WooCommerce 10.1.2 source to resolve rounding and transitions. This did not query a merchant or running lab. Several web fetches returned cache misses; one shell fetch failed DNS in the sandbox and was retried through explicit network escalation. Public source files downloaded for inspection were temporary, outside the repository. Neither runtime nor checks depend on them.

## Implementation and evidence

The facade validates/copies seeds, validates actions, calculates candidate state before replacement, and returns deep snapshots. The engine imports no fixture, adapter, harness or evidence code. Product names, identities, rates, eligibility and prices come from the seed; no expected cart or sequence is embedded.

Monetary arithmetic retains source precision with checked integer units of 10^-8 EUR. Taxes retain six fractional decimal places of cents; rendering, per-line tax rounding and percentage reconciliation have explicit distinct tie modes. The model and provenance are in `woo/kernel-model.md`.

Verified against all four frozen real discovery fixtures: target transitions, independent target replay, lab mirror, lab two-percentage non-sequential interaction. Every expected decision, code/message, final cart and captured checkpoint matches. The test for generic refusal non-mutation is stronger than the coffee refusal evidence: that refusal had no immediate captured snapshot, so its non-mutation remains a clone contract property rather than a new merchant observation.

Meaningful implementation tests cover populated refusal cases, nonempty reset, full replay equality, caller seed mutations, cross-seed coupon isolation, independent engine instances, deep snapshot mutation and snapshot persistence across later actions. Additional derived tests distinguish one-micro-EUR source differences, exact half-cent ties, eligibility, additive versus absolute quantity changes, insertion order and renamed catalogue/coupon inputs. They are contract/source probes, not newly measured fidelity evidence.

## Observed failures and corrections

1. Bare `pnpm check` failed with exit 127 (`pnpm: command not found`). All subsequent pnpm commands used `PATH="$PWD/node_modules/.bin:$PATH"` to expose the already installed binary only for that process. No global/client configuration or dependency change.
2. Baseline full gate: typecheck, lint, architecture and input integrity passed; 4 discovery tests failed and 71 passed. All four real fixtures received empty carts and `NOT_IMPLEMENTED` decisions from the stub. This was a real red gate, not treated as success or suppressed.
3. After implementation, discovery and focused tests passed, followed by a full gate with 115 passed. Continued source review identified coupon getter rounding absent from the discovery discriminator. The added derived half-tie test failed with actual coupon `total_discount=3`, `total_discount_tax=1`, expected `2`, `0` (30 gross cents, 20% inclusive tax, 10% coupon). The source chain is `CartCouponSchema::get_item_response` → `WC_Cart::get_coupon_discount_amount` / `get_coupon_discount_tax_amount` → `wc_cart_round_discount` → discount mode 2. Corrected coupon rendering to half down, preserving aggregate half-up rendering (3/1). The original fixtures/expectations were unchanged. The regression remains in `tests/engine-pricing.test.ts`.
4. A patch command rejected combined delete/add operations on the same test path before applying changes. Reissued as ordinary file replacements. This was an editing-tool error, not a business test failure.

## Final observed checks

- `PATH="$PWD/node_modules/.bin:$PATH" pnpm check`: exit 0; typecheck, lint (43 files), architecture (19 modules / 45 dependencies), frozen fixture/seed integrity and all 117 tests in 13 files passed. Final test start 17:41:31 Europe/Paris, duration 7.36 s.
- `node --import tsx src/cli.ts fixtures/discovery/target-transitions.json`: exit 0, zero differences, 10 decisions.
- `node --import tsx src/cli.ts --reset-demo fixtures/discovery/lab-two-percent-nonsequential.json`: exit 0, `identical=true`, zero differences in both runs. Both CLI modes were repeated after the rounding correction.
- `git diff --check`: passed; final tracked/untracked path review recorded below. No staged changes.

## Supported domain and limits

Supported: prepared FR guest EUR/2 inclusive-price model, the seed's bounded products/variant and quantities, 5.5%/20% noncompound rates, combinable 10%/20% percentage coupons with sequential discounts disabled, and add/set_qty/remove/apply_coupon/remove_coupon. Unknown settings or malformed resets throw before replacing state. Invalid/unsupported actions refuse without mutation. Unconfigured seeds remain empty; legacy synthetic seeds intentionally retain `NOT_IMPLEMENTED`, since their empty settings are not tax/pricing evidence.

Source-derived behaviors include initial sold-individually add normalization to one, duplicate/ineligible coupon refusal, and removing coupons after loss of their final eligible line. Native `CartSchema` validates errors before composing its response; `CartController::validate_cart_coupon` removes invalid coupons and recalculates. These extensions have implementation tests, not additional merchant observations. Only captured refusal templates are localized; no uncaptured message wording is claimed. The synthetic arithmetic probes do not broaden the measured merchant catalogue or price domain.

Coffee pricing fidelity is observed only at quantity one; accessory pricing at one and two. `max_quantity` is the clone measurement bound, not an inferred stock limit. Merchant native tax-entry basis, restriction mechanism and Woo version remain unknown. Multiple coupons are demonstrated only in the lab. No other combination mode, shipping/fees/gifts, checkout, arbitrary plugins, native-ID tie ordering across unprepared coupon configurations or broader merchant configuration is claimed.

No frozen-input change is required for these prepared inputs. No unresolved implementation blocker remains. Independent verification and acceptance belong to Antoine's next authorized phase; this session stops here.

## Changed paths

- `src/engine/index.ts`
- `src/engine/money.ts`
- `src/engine/pricing.ts` (new)
- `src/engine/seed.ts` (new)
- `tests/refusal.test.ts`
- `tests/reset.test.ts`
- `tests/engine-support.ts` (new)
- `tests/engine-pricing.test.ts` (new)
- `tests/engine-seed.test.ts` (new)
- `woo/kernel-model.md`
- `ai/traces/implementation-cycle-1/brief.md` (new)
- `ai/traces/implementation-cycle-1/report.md` (new)

## Effort entry for Antoine to transfer to the cost register

Instrumented partial interval: 15:33:25–15:42:25 UTC (9 min elapsed), including source-access approval waits, implementation, checks and handoff drafting. Final test completion followed the intermediate 15:41:29 reading. Initial instruction reading preceded the first clock reading; final path review followed the last one. This is not a measurement of total active effort or billing. Monetary cost and remaining assignment effort are unavailable; the original one-day budget is not reset.

`docs/notes/cost-register.md` was read but not modified because documentation outside the listed role outputs is not writable by the implementation role. Antoine can transfer this entry during the operator review.

## Operator review follow-up — 2026-09-18

The operator's supplied review and requested coverage additions are archived in `brief.md`. This is a continuation of implementation cycle 1, not a new role or discovery cycle. HEAD remains the original checkpoint; pre-existing cycle-1 changes were preserved.

Only `tests/engine-pricing.test.ts`, `tests/engine-seed.test.ts`, and this cycle's brief/report changed during this follow-up. No engine or frozen input/control was changed.

Added four derived pricing cases: the two requested six-decimal prices with a 10% coupon; a two-variant eligibility case with an actual one-cent remainder, asserted against literal expected amounts in both insertion orders and after removing one variant; and the maximum source price at quantity three with a 20% coupon plus refusal of an extra unit without mutation. For 1.054999/1.055000 EUR, coupon bases are 105/106 cents, reconciled gross discounts 10/11 cents, and displayed discounted net line amounts 91/90 cents. For the two-variant probe, 108/103 gross cents allocate discounts 11/10, with the extra cent assigned by unit price rather than insertion order. These are derived probes, not additional merchant or lab evidence.

Added 21 seed compatibility cases: all four discovery seed associations, legacy synthetic and empty unconfigured inputs, and 16 valid/invalid boundary probes for source amounts, quantity limits and native IDs. Existing invalid-seed tests now also exercise the frozen harness validator. One deliberate difference is explicitly retained: the harness checks coupon code identity literally, while the engine rejects case-only aliases that collide after normalization. None of the prepared seeds has this ambiguity; no frozen change is requested. This suite checks the listed domain and does not assert universal equivalence between the two validators.

Observed validation:

- Focused pricing/seed tests: 51 passed, exit 0, including all new probes; no failing attempt or engine correction in this follow-up.
- Full `PATH="$PWD/node_modules/.bin:$PATH" pnpm check`: exit 0; 142 tests in 13 files passed, including all four real discovery scenarios, typecheck, lint, architecture and fixture/seed integrity. Test start 17:55:36 Europe/Paris; duration 7.54 s.
- `git diff --check` passed; index remains unchanged. No commit, push or role launch.

Partial effort interval for the operator cost register: 15:55:01–15:55:44 UTC (43 s), covering test additions and checks; initial reading and final documentation lie outside that interval. No measured monetary cost is available. Existing scope limits and the original assignment budget remain unchanged. No blocker identified; stop at operator handoff.
