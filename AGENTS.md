# Repository instructions

Read [scope](docs/scope.md) and the [constitution](ai/constitution.md).
For the next explicitly authorized phase, read the [session handoff](docs/session-handoff.md); check its dated state against current Git status.
The actionable phase-A pack and launch are archived verbatim in [ai/prompts/setup-adjustment/](ai/prompts/setup-adjustment/).
Its shared rules supersede historical setup requirements. The old [setup request](ai/prompts/setup.md) is historical, not an execution brief.
Archive executed missions and significant decisions, not individual commits; follow the [archival policy](ai/constitution.md#archival-policy). A checkpoint alone requires no new prompt.
No runtime or reader command depends on the external coordination pack.
Author repository content in English; preserve supplied evidence verbatim.

This repository currently contains setup tooling and an unimplemented engine.
Do not claim business fidelity from a green stub test suite.
Use `pnpm check` as the full offline, non-mutating gate; business mismatches must fail.
`pnpm check:prep` validates structure and reference readiness, never engine fidelity.
No watch mode, CI, new dependencies or global/client configuration changes.
The assignment has one day of actual effort including setup; record work in [cost register](docs/notes/cost-register.md).
The core is `src/engine/`; public types are in `src/engine/contract.ts`.
The reusable harness is `harness/`; the separate Woo adapter is `woo/`.
Research notes are hypotheses, not an expanded specification.

Only the operator selects a role with `./use-role.sh impl|verify|none`.
Start a new Codex session at the repository root for each role; never resume or fork the other role's conversation.
The generated `AGENTS.override.md` includes these common instructions and the active brief.
No parallel roles, worktrees, agent pushes or automatic role launches.

During role sessions, contract/schemas, seeds, discovery references, adapter, harness, scripts and executable configuration are frozen.
Before each role Antoine records a clean checkpoint; afterwards he reviews tracked changes AND new files against that role's allowed paths, including controls.
Only Antoine commits, outside roles. Local Git hooks run full check before commit and block workflow pushes; see [delivery](docs/delivery.md).
Only Antoine can authorize a documented exception for the pre-engine reference checkpoint or an intentionally failing verification checkpoint. Roles cannot use exceptions; accepted implementation and final delivery require full check.
No per-role sandbox, hook-loading or sentinel validation is required before preparation. The minimal selector generates common plus role instructions only; workflow controls are not a security boundary.
Request any required change from Antoine with evidence and its effect on verification.
Never read or write `../held-out/` or `fixtures/held-out/` as a role.
Never run `pnpm heldout`, `pnpm fixtures:seal`, `deliver.sh` or `use-role.sh` as a role.
Discovery evidence is under `ai/traces/discovery/`; never silently edit it.
At most three discovery implementation/verification cycles in total, tracked by the operator.
Run checks before proposing a commit. The operator commits from outside the role session.
V1 lab coverage requires two percentage coupons with sequential discounts disabled; no other combination mode is in scope. This is not demonstrated merchant behavior.
Stop at the current phase checkpoint; never chain phases or launch roles automatically.
Read [SETUP-NOTES.md](SETUP-NOTES.md) for historical results and the phase-A alignment record. Unperformed live-client checks remain NOT RUN and are superseded, not prerequisites.
