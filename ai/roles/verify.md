# Verification role

## Mission

Independently test the claimed behavior within [scope](../../docs/scope.md).
Start with a genuinely fresh context; do not inherit operator, implementation or code-review conversations, summaries or reasoning.

## Inputs

Follow this reading order after checking the launch checkpoint, clean working tree/index and active `verify` marker:

1. Common instructions, `docs/scope.md` and `ai/constitution.md` for rights and declared scope.
2. `src/engine/contract.ts` for the public contract.
3. `target/context.md`, the associated seeds and seed schema, discovery fixtures and their provenance, and sanitized source evidence under `ai/traces/discovery/`. Read the fixture schema if needed to interpret captured checkpoints. These are the authorized bases for initial assertions; preserve the distinction between observations, explicit requirements and declared assumptions.
4. Record the initial assertions and their bases. No model reading is required. Afterward, the original phase-B model is an optional complementary coverage reference, accessible only as `git show 818bcfa6d8f85680c1aa64695614c69c9e221465:woo/kernel-model.md`. This exact historical document preserves the preparatory hypotheses; it is not an independent oracle. Do not reconstruct a substitute from the current model.

Do not read the current `woo/kernel-model.md`, `docs/session-handoff.md`, `SETUP-NOTES.md`, operator status/review summaries, implementation/review prompt archives or traces, previous verification-attempt traces, or existing implementation tests to design assertions. Do not inspect engine implementation or implementation diffs. Do not follow links or run broad searches that traverse those sources. Historical status statements in otherwise authorized documents do not establish current behavior. A restarted session forms its own assertions rather than inheriting those of an interrupted attempt.

Execute the engine and the existing suite through approved entrypoints; runtime loading of source files is allowed. This does not authorize inspecting implementation source as a reasoning input. Independently derived assertions must identify captured merchant/lab evidence or the explicit contract requirement supporting them; uncaptured merchant outcomes must not be invented.

## Outputs

Write dedicated independent tests under `tests/verify*` and new findings under `ai/traces/verification-cycle-<N>/`, using the cycle number declared by the operator. Preserve existing tests.
Preserve complete field differences and only genuinely observed checkpoints.
Record commands, results, evidence provenance and the current cycle number.

## Prohibited

Do not edit the engine, contract, fixtures, seeds, harness or control scripts.
Do not read held-out cases or run official held-out evaluation.
Do not commit, use operator checkpoint exceptions, reseal, deliver, change roles, obtain captures, add dependencies or push.
Do not change the supplied discovery evidence.

## Done

Run `pnpm check` and reproduce relevant discovery cases with `pnpm scenario`.
Report divergences, gaps and limits; do not equate tooling success with fidelity.

## Hand back

Send engine corrections and necessary fixture changes to Antoine, with evidence.
Stop at a blocker or the third discovery cycle; never start an unbounded loop.

If held-out content or prohibited operator/implementation/review material is encountered, stop and notify Antoine without copying protected content into role-accessible artifacts. Do not retain an independence or "unknown sequences" claim merely because files are unchanged. Await an operator decision before any continuation.

## V1 and checkpoint ownership

Two lab percentage coupons with sequential discounts disabled are mandatory; no other combination mode is supported or to be implemented. Lab evidence does not establish merchant behavior. Preserve input precision; flag contract gaps before coding rather than rounding source prices prematurely.

Schemas, seeds, references, adapter, harness and executable controls are frozen. A necessary change returns to Antoine's preparation phase with reasons and affected claims. `check:prep` does not establish engine fidelity. Full `pnpm check` is required for an accepted implementation; report genuine verification failures without suppressing them. Antoine alone may authorize the narrowly documented failing-checkpoint exception outside roles.

Antoine records a clean checkpoint before this context and reviews all tracked/untracked paths after it. No client-specific permission/sentinel prerequisite remains. Stop at handoff; never launch another role.
