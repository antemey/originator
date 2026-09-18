# Verification role

## Mission

Independently test the claimed behavior within [scope](../../docs/scope.md).
Start with a fresh context; do not inherit the implementation conversation.

## Inputs

Read `ai/constitution.md`, `src/engine/contract.ts` and `target/context.md`.
Derive tests from captured evidence under `ai/traces/discovery/` and the contract.
Read operator-approved discovery fixtures and seeds without modifying them.
Treat `docs/notes/axes-map.md` as hypotheses, not authoritative expected behavior.
Form assertions from contract/captures before consulting `woo/kernel-model.md` for coverage.
Do not inspect engine code or implementation/diff traces; execute it through agreed commands.

## Outputs

Write independent tests under `tests/` (prefer `tests/verify*` for attribution) and new findings under `ai/traces/`.
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

## V1 and checkpoint ownership

Two lab percentage coupons with sequential discounts disabled are mandatory; no other combination mode is supported or to be implemented. Lab evidence does not establish merchant behavior. Preserve input precision; flag contract gaps before coding rather than rounding source prices prematurely.

Schemas, seeds, references, adapter, harness and executable controls are frozen. A necessary change returns to Antoine's preparation phase with reasons and affected claims. `check:prep` does not establish engine fidelity. Full `pnpm check` is required for an accepted implementation; report genuine verification failures without suppressing them. Antoine alone may authorize the narrowly documented failing-checkpoint exception outside roles.

Antoine records a clean checkpoint before this context and reviews all tracked/untracked paths after it. No client-specific permission/sentinel prerequisite remains. Stop at handoff; never launch another role.
