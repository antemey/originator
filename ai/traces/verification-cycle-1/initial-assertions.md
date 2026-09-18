# Phase C — cycle 1 initial assertions

Recorded on 2026-09-18 before reading `woo/kernel-model.md`, running the engine, or consulting existing tests. Launch HEAD: `7d302d60fed20b9c8d20bebf15a45815691b1758`; `git status --porcelain=v1` empty; working tree and index quiet checks both returned 0. `AGENTS.override.md` has the active `verify` marker. This session received no prior role summaries.

Reading order: role instructions; `docs/scope.md` and `ai/constitution.md`; `src/engine/contract.ts`; `target/context.md`, seed schema and three prepared seeds; four real discovery fixtures, fixture schema, and the four associated sanitized discovery sources below. Historical status language in authorized documents is not used as current behavior evidence. No linked preparation/operator archives were followed.

## Evidence assertions

E1–E4: independently project each source response, map native IDs using its associated seed, and compare every required line, coupon and total field to the frozen fixture. Check actual action response status and captured refusal code/message against ordered decisions. Compare engine execution to those projections at captured checkpoints and final state, matching identities without requiring display order. Missing, extra and duplicate identities must fail. No reconstructed intermediate merchant cart after the coffee refusal.

| ID | Fixture | Sanitized source under `ai/traces/discovery/` | SHA256 |
| --- | --- | --- | --- |
| E1 | target-transitions | phase-b-target-sequence.json | f047838e8c7588fb03c0207387535fc6c26805ea31fe47a6b39e0e189adcceee |
| E2 | target-mixed-replay | phase-b-target-replay.json | c11407872d1e71b0eb7a72bc903b9fdeaba35f3e3f4232097551a5a45bc8323c |
| E3 | lab-mirror-mixed | phase-b-lab-mirror-cookie-session.json | 0cafd21ef6006ac98bc4943342400bc6974ad9ee0a81a48c562458259878f2ab |
| E4 | lab-two-percent-nonsequential | phase-b-lab-interaction-measured.json | 7049a2919f757c6735d726a97a3cea64d2591e84fee71f4678ea9e88bbecc8a5 |

E1 observations: coffee quantity 1, undiscounted 946/52 cents HT/tax, discounted 851/47; accessory quantity 1 at 125/25 and quantity 2 at 250/50. Uppercase coupon input produces `decouverte10`, discount 95/5, with accessory unaffected. `coffee-quantity-3` is a captured refusal, followed by a successful quantity-1 request; no immediate coffee-refusal snapshot exists. Unknown coupon refusal has a separate unchanged-cart GET. Coupon removal/reapplication and accessory removal have complete snapshots. E2 independently repeats the mixed basket in a fresh guest session.

E3 is lab compatibility evidence, not independent identification of merchant settings. E4 checks both coupons at action 3: coffee total 662/36; individual discounts 95/5 and 190/10; cart discount 284/16. Do not impose equality between sums of rounded coupon amounts and rounded cart totals. Removing LAB20 restores the captured single-coupon state. Only sequential discounts disabled is in scope.

## Contract assertions

C1: invalid quantities (zero, negative, fractional, nonfinite, unsafe and wrong runtime types), missing required fields, unsupported actions/references/variants and unknown coupons receive explicit refusal with a nonempty code and no cart mutation. Basis: scope and constitution engine contract; Action/Result types. Run on empty and populated carts. Runtime-invalid values are robustness checks, not merchant measurements. The immediate no-mutation check after the captured coffee refusal is a contract assertion only.

C2: recalculation follows accepted add/set_qty/remove/apply_coupon/remove_coupon transitions; repeated snapshot calls are deterministic and do not mutate state. Basis: constitution deterministic recalculation and action semantics in target context; monetary expectations only from E1–E4. Accessory incremental add semantics can be checked against the captured quantity-2 state as a contract-derived relation, without claiming that sequence was captured.

C3: reset discards previous items/coupons; alternating target, mirror and two-coupon seeds produces their own captured results. LAB20 must not leak into the target seed. Repeating a captured sequence after reset reproduces decisions and projections. Basis: scope/constitution reset and seed isolation requirement, frozen seeds, E1–E4.

C4: snapshots are independent deep copies: changing returned lines, coupons, totals or arrays cannot alter engine state; previously returned snapshots cannot change after dispatch/reset. Basis: public Engine snapshot contract as specified by scope/constitution. Engine operations must preserve supplied seed data. Isolation tests do not establish merchant outcomes for new sequences.

C5: every monetary projection value is a safe integer, with exact source input precision preserved. Basis: scope/constitution and contract/seed schema. Prepared source prices remain 9980000 and 1500000 at precision 6. No speculative price variants or invented rounding oracle.

## Planned verification and limits

Use dedicated `tests/verify*`, approved engine runtime entrypoints, dedicated test execution, full `pnpm check`, and explicit `pnpm scenario` calls for all four real discovery fixtures. Do not inspect engine implementation or existing implementation tests. Only tests and this cycle's trace directory may be written. Effort will be recorded here for Antoine to transfer to the protected cost register.

No merchant pricing claim at coffee quantity 2/3, other products/variants/countries, different source prices, larger accessory quantities, additional coupon modes, or unmeasured merchant combinations. No new captures, Woo startup, held-out access or final evaluation. A missing authoritative oracle limits the affected claim; it is not replaced by the model or engine output.
