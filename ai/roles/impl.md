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
Do not reseal, deliver, change roles, add dependencies or push.
Do not obtain new captures or infer unknown merchant configuration.

## Done

Run `pnpm check`; state exact verified behavior and remaining limitations.
Return the changed files and evidence-backed findings to the operator.

## Hand back

Stop on a blocked frozen input, unsupported assumption or exhausted cycle budget.
Do not fix expectations to fit the engine. Leave an actionable note for Antoine.
