# Current handoff — implementation checkpoint, cycle 1 of 3, 2026-09-18

The implementation session has handed back its work and its role is inactive. Antoine authorized the operator checkpoint and commit. The commit containing this handoff records four engine files, five test files, the updated rule model and two implementation traces, based on `6ef398146251812b048b601277b928b8ffe4cf5b`. Phase-B reference checkpoint `818bcfa6d8f85680c1aa64695614c69c9e221465` remains unchanged.

Operator checks: all 12 implementation paths are within role rights; the 29 preparation input fingerprint groups are unchanged. Full `pnpm check` was rerun successfully: typecheck, lint, architecture, fixture/seed integrity and 142/142 tests passed, including all four discovery comparisons. The normal pre-commit hook is required without a checkpoint exception. These command results do not replace independent verification. Operator review is limited to paths, fingerprints, command results and commit authorization; it does not assess implementation reasoning.

Gitleaks scanned the staged-file export with redacted output and found no secrets. Staged whitespace check: FAIL for one trailing space at `ai/traces/implementation-cycle-1/brief.md:46`. The received prompt archive is preserved byte-for-byte; no whitespace rule was changed and this check is not reported as PASS. This finding is separate from the passing full project gate.

Next: Antoine selects a genuinely fresh `verify` session in `repo/` from this committed checkpoint. Cycle 1 verification is pending. Do not resume or fork the operator or implementation conversation; do not transmit implementation/reviewer explanations, summaries, prompt archives or traces to verification. Follow the verification brief: derive assertions from the public contract and authorized evidence before consulting the rule model for coverage. Reserved recipes/outcomes must not be read or copied indirectly into role contexts. If accidental exposure occurs, stop, report it without reproducing protected content, and await an operator decision; unchanged files do not preserve an "unknown sequences" claim after exposure.

No verification role, final-delivery freeze, official evaluation or push has been initiated by this checkpoint. Earlier handoffs below are historical; their stub status, pending preparation and one-commit exceptions are superseded for the current checkpoint.

---

# Historical handoff — phase B review point, 2026-09-18

Operator only; no impl/verify role active. The isolated tooling repair is committed as `b33fce531e5de61fda298c2de273e1207408b1ba` (`fix: preserve setup state on validation failures`), following phase-A commit `a49874f`. Its four-file selection passed the full 67-test gate in an export without phase-B changes and through the normal pre-commit hook. Only one repair commit was created; no push.

Phase B then resumed. The uncommitted changes now contain two direct-target fixtures, two local lab fixtures, target/mirror/two-coupon seeds, explicit input-price precision and constrained settings, direct projection tests, provenance, initial rules and approach comparison. Original supplied evidence is unchanged. See [the preparation inventory](../ai/traces/preparation/evidence-inventory.md) and [target context](../target/context.md). The two failed lab attempts are retained with their methodological consequences.

Checkpoint checks rerun on 2026-09-18: `pnpm check:prep` PASS (44 tests; structural evidence counts 2 target, 2 lab, 1 synthetic; 4 seeds). Full `pnpm check` FAIL (71 passed, 4 discovery comparisons against the untouched stub failed). This is expected preparation status, not business fidelity. No failure is suppressed or relabelled PASS. The single phase-B commit containing this updated handoff is the authorized pre-implementation input checkpoint; its parent is `b33fce531e5de61fda298c2de273e1207408b1ba`. Input object fingerprints are recorded in the preparation inventory. The final-delivery freeze is a separate later operation.

The scope status and quantity distinction are now clarified. Antoine examined projection P1 and confirmed its conformity, then explicitly accepted Codex's audit for P2–P3 with the stated limits instead of personally repeating those comparisons; the inventory records this adjustment to the review procedure. He then authorized the checkpoint and commit. After the commit is verified, stop: Antoine must separately select a fresh implementation session (discovery cycles used: 0/3). His selected action-only recipes are registered outside the repository; only hashes and registration date are published in fixtures/PROVENANCE.md. Keep their contents out of all role contexts, prompt archives and repository traces. No reserved outcomes were accessed or captured. No final-delivery freeze or verdict exists. The lab containers were stopped after measurement; local persistent Docker volumes are preserved. No third-party container was modified.

## Authorized reference-checkpoint exception — 2026-09-18

Purpose: retain the reviewed phase-B model, references and documentation before any engine implementation. Antoine authorized this single local checkpoint commit after accepting the evidence review and its limits. Authorization applies to the documented pre-engine reference procedure in `docs/delivery.md`, not to an accepted implementation or final delivery.

The full check exits 1 solely for four `tests/fixtures.test.ts` discovery comparisons: `lab-mirror-mixed`, `lab-two-percent-nonsequential`, `target-mixed-replay` and `target-transitions`. Their expected nonempty lines, coupons, totals and accepted decisions differ from the unchanged stub's empty/zero projections and `NOT_IMPLEMENTED` refusals. The other 71 tests pass; typecheck, lint, architecture and fixture/seed integrity pass. Preparation validation passes all 44 selected tests. The affected unverified claim is clone business fidelity, not reference readiness. Any additional failure blocks this exception.

Keep the installed pre-commit hook enabled. For this one operator commit only, set `ORIGINATOR_CHECKPOINT_EXCEPTION=reference` and `ORIGINATOR_EXCEPTION_RECORD=docs/session-handoff.md`. The hook reruns full check and must report its failure and the reference exception. No permanent hook/configuration change, test skip, implementation repair, final-delivery freeze or role activation is authorized by this exception.

Earlier handoff follows unchanged as historical context. Its phase-A state has been superseded by the working state above.

---

# Current handoff — phase A, 2026-09-18

Phase A aligns the existing setup only. Stop at the alignment report; phase B requires an explicit new mission. Continue in `repo/` on `main`, French conversation and English authored artifacts.

The new shared rules are reflected in `AGENTS.md`, `ai/constitution.md`, role briefs and scope. Exact phase-A instructions are archived in `ai/prompts/setup-adjustment/`; do not reconstruct requirements from historical briefs. No external pack is needed by reader/runtime commands. The initial setup and targeted adjustment remain historical delivery annexes. Archive future executed missions and significant decisions with their results, including informative failures; checkpoints alone add no prompt obligation. See the [archival policy](../ai/constitution.md#archival-policy).

The per-role client hook/sandbox/sentinel prerequisite is superseded. Earlier native 18/18 results remain historical; live client checks remain NOT RUN. The selector generates only common plus role instructions, retaining two fresh sequential contexts. Local Git hooks and operator path review replace active fine-grained client controls as workflow checks.

Next authorized phase: inventory existing evidence, identify established/missing facts, resolve source-price precision in the contract before freezing, then prepare seeds/fixtures and the required two-percentage-coupon lab scenario with sequential discounts disabled. No other coupon-combination mode. `pnpm check:prep` intentionally fails until a valid café seed and complete direct-target fixture exist; it does not execute engine fidelity checks. Full `pnpm check` still runs business comparisons.

Before each role Antoine records a clean checkpoint; afterwards he reviews tracked changes and new files against role rights. Document candidate approaches before engine implementation. Frozen delivery records fingerprints and pre-registered recipes before capture, pauses, then resumes import/evaluation without moving the freeze. See [delivery](delivery.md).

Known preparation questions: `Product.unit_price` currently uses integer minor units and cannot represent finer source precision; resolve explicitly from evidence before the checkpoint. Previous active setup effort was not measured, so the remaining one-day budget is unknown; do not reset it. Engine/seed remain untouched, discovery cycles remain 0/3, no reference runtime/capture/role/evaluation launched.

The two pre-existing working changes were this handoff and the reference to it in `AGENTS.md`; both are retained and updated. The prior handoff is preserved below as historical evidence, not current instructions. Its client-validation prerequisite and suggested restart are superseded.

---

# Session handoff — 2026-09-16

## Where we stopped

Setup is complete. The next session is operator preparation, before business implementation. Work from `xx_ORIGINATOR/repo/` on `main`; communicate with Antoine in French and author repository content in English.

The goal is a deterministic, in-memory TypeScript reproduction of a narrow cart/coupon/tax slice for L'Atelier des Cafés, excluding shipping and fees. WooCommerce is the separate local reference. See [scope](scope.md) and [constitution](../ai/constitution.md) for the agreed boundaries.

- Scaffold commit: `ae51f17`; setup audit record: `0cfe62a`. Both were checked from independent fresh clones; the final audit passed frozen-lockfile installation and `pnpm check` with 47 tests. These results apply to the setup, not future changes.
- Engine is a stub, merchant seed is unconfigured, no real executable scenarios exist, and `WRITEUP.md` contains headings only. Business fidelity has not been evaluated.
- Supplied observation JSON and five captures are preserved byte-for-byte under `ai/traces/discovery/`. The JSON copy was restored after detecting earlier formatting changes. Do not format or silently edit evidence.
- No role is active at handoff; no business role, reference container, official held-out evaluation, delivery procedure or push has been launched. Discovery cycles used: 0 of 3.

## Open points and next steps

1. Complete the operator's synthetic live-session checks in [SETUP-NOTES.md](../SETUP-NOTES.md). Native sandbox checks passed 18/18, but actual client hook loading, automatic invocation and all file-tool routes remain **NOT RUN**. Keep real held-out evidence outside the agents' accessible environment until protection is demonstrated.
2. Review existing discovery evidence to establish supported settings, catalogue, seed, executable fixtures and contract suitability. Record unknowns explicitly; do not infer missing merchant configuration. The [axes map](notes/axes-map.md) contains hypotheses, not requirements.
3. Document 2–4 candidate approaches in `WRITEUP.md` before coding the engine. Prepare the separate Woo lab measurements, including two combinable percentage coupons; this is lab evidence, not demonstrated merchant behavior.
4. Antoine then selects fresh, sequential `impl` and `verify` sessions. Never resume/fork one role as the other. Freeze contract, seeds, fixtures and harness during roles; use at most three discovery cycles. Official held-out evaluation follows the final code freeze, once, with no subsequent code correction.

## Practical restart

Read `AGENTS.md`, this note and `SETUP-NOTES.md`, then inspect current Git status before editing. The shared check is `corepack pnpm@10.11.0 check` (`pnpm` is absent from the ordinary shell PATH here). Node is pinned to 22.16.0. The `.mjs` hooks run directly in Node and are covered by strict TypeScript through JSDoc/checkJs.

`../setup-audit-ae51f17/` and `../setup-audit-final/` are retained audit clones, not working repositories or delivery files. Continue in `repo/`. The original setup prompt is archived in `ai/prompts/setup.md`; it explains past work and is not a request to repeat setup. The elapsed setup interval exceeded 90 minutes; active effort was not measured separately. Keep the next phase focused on evidence and the narrow business slice.

Suggested opening prompt for a new preparation session at the repository root:

> Read AGENTS.md, docs/session-handoff.md and SETUP-NOTES.md. Inspect the current Git state and resume from the completed setup. Respond in French; write repository content in English. Start by summarizing the remaining operator checks and the immediate preparation work needed before implementation. Do not repeat setup, launch a role, access held-out evidence or start business implementation. Propose the next bounded step for Antoine to agree on.
