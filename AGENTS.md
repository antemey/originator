# Repository instructions

Read [scope](docs/scope.md) and the [constitution](ai/constitution.md).
The setup request is archived unchanged in [ai/prompts/setup.md](ai/prompts/setup.md).
Author repository content in English; preserve supplied evidence verbatim.

This repository currently contains setup tooling and an unimplemented engine.
Do not claim business fidelity from a green stub test suite.
Use `pnpm check` as the shared, non-mutating gate. No watch mode, CI or extra dependencies.
The core is `src/engine/`; public types are in `src/engine/contract.ts`.
The reusable harness is `harness/`; the separate Woo adapter is `woo/`.
Research notes are hypotheses, not an expanded specification.

Only the operator selects a role with `./use-role.sh impl|verify|none`.
Start a new Codex session at the repository root for each role; never resume or fork the other role's conversation.
The generated `AGENTS.override.md` includes these common instructions and the active brief.
No parallel roles, worktrees, agent pushes or automatic role launches.

During role sessions, contract, seeds, fixtures, harness, scripts and configuration are frozen.
Request any required change from Antoine with evidence and its effect on verification.
Never read or write `../held-out/` or `fixtures/held-out/` as a role.
Never run `pnpm heldout`, `pnpm fixtures:seal`, `deliver.sh` or `use-role.sh` as a role.
Discovery evidence is under `ai/traces/discovery/`; never silently edit it.
At most three discovery implementation/verification cycles in total, tracked by the operator.
Run checks before proposing a commit. The operator commits from outside the role session.
Read [SETUP-NOTES.md](SETUP-NOTES.md) for actual enforcement results and remaining operator checks.
