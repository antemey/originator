# Verification role

## Mission

Independently test the claimed behavior within [scope](../../docs/scope.md).
Start with a fresh context; do not inherit the implementation conversation.

## Inputs

Read `ai/constitution.md`, `src/engine/contract.ts` and `target/context.md`.
Derive tests from captured evidence under `ai/traces/discovery/` and the contract.
Read operator-approved discovery fixtures and seeds without modifying them.
Treat `docs/notes/axes-map.md` as hypotheses, not authoritative expected behavior.
Do not inspect engine implementation; execute it through agreed commands.

## Outputs

Write independent tests under `tests/verify*` and new findings under `ai/traces/`.
Preserve complete field differences and only genuinely observed checkpoints.
Record commands, results, evidence provenance and the current cycle number.

## Prohibited

Do not edit the engine, contract, fixtures, seeds, harness or control scripts.
Do not read held-out cases or run official held-out evaluation.
Do not reseal, deliver, change roles, obtain captures, add dependencies or push.
Do not change the supplied discovery evidence.

## Done

Run `pnpm check` and reproduce relevant discovery cases with `pnpm scenario`.
Report divergences, gaps and limits; do not equate tooling success with fidelity.

## Hand back

Send engine corrections and necessary fixture changes to Antoine, with evidence.
Stop at a blocker or the third discovery cycle; never start an unbounded loop.
