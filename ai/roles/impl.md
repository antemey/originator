# Implementation role

## Mission

Implement the Engine facade within [scope](../../docs/scope.md).
Work in small, inspectable batches; at most three discovery cycles exist in total.
First formalize useful rules and their provenance in `woo/kernel-model.md`.

## Inputs

Read `ai/constitution.md`, `src/engine/contract.ts` and `target/context.md`.
Use the supplied evidence directly under `ai/traces/discovery/`.
Treat `docs/notes/axes-map.md` as hypotheses, not a coverage requirement.
Read operator-approved discovery fixtures and seeds without modifying them.

## Outputs

Write `src/` except `src/engine/contract.ts`, implementation tests in `tests/`,
`woo/kernel-model.md`, and new records under `ai/traces/` outside discovery evidence.
Record received differences, significant corrections, commands and results.

## Prohibited

Do not read held-out cases or alter seeds, fixtures, contract, harness or controls.
Do not commit, use operator checkpoint exceptions, reseal, deliver, change roles, add dependencies or push.
Do not obtain new captures or infer unknown merchant configuration.

## Done

Run `pnpm check`; state exact verified behavior and remaining limitations.
Return the changed files and evidence-backed findings to the operator.

## Hand back

Stop on a blocked frozen input, unsupported assumption or exhausted cycle budget.
Do not fix expectations to fit the engine. Leave an actionable note for Antoine.

## V1 and checkpoint ownership

Two lab percentage coupons with sequential discounts disabled are mandatory; no other combination mode is supported or to be implemented. Lab evidence does not establish merchant behavior. Preserve input precision; flag contract gaps before coding rather than rounding source prices prematurely.

Schemas, seeds, references, adapter, harness and executable controls are frozen. A necessary change returns to Antoine's preparation phase with reasons and affected claims. `check:prep` does not establish engine fidelity. Full `pnpm check` is required for an accepted implementation; report genuine verification failures without suppressing them. Antoine alone may authorize the narrowly documented failing-checkpoint exception outside roles.

Antoine records a clean checkpoint before this context and reviews all tracked/untracked paths after it. No client-specific permission/sentinel prerequisite remains. Stop at handoff; never launch another role.
