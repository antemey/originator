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
