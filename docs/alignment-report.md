# Phase-A alignment report — 2026-09-18

## Outcome and baseline

Phase A only. The existing repository remains on `main` at `0cfe62a`; no commit or push was performed. Initial status was modified `AGENTS.md` and untracked `docs/session-handoff.md`. The existing handoff is preserved in full as a labelled historical section; its AGENTS reference is retained and updated. All other changes below belong to this alignment.

Read the supplied `00_START.md`, `01_SHARED_RULES.md`, `02_ALIGN.md` in order, then active repository instructions. Preparation/delivery pack briefs and historical setup briefs were not loaded for this phase. Exact copies of the three actionable documents and the launch prompt are in `ai/prompts/setup-adjustment/`. The external pack remains outside the repository; no runtime/reader command depends on it. Authored artifacts are English; original labels/evidence remain unchanged.

## Changes by purpose

| Purpose | Changed or new paths |
| --- | --- |
| Active instructions and handoff | `AGENTS.md`, `ai/constitution.md`, `ai/roles/impl.md`, `ai/roles/verify.md`, `docs/scope.md`, `docs/session-handoff.md`, `SETUP-NOTES.md`, `README.md` |
| Actual prompt archive | `ai/prompts/setup-adjustment/{00_START,01_SHARED_RULES,02_ALIGN,launch}.md` |
| Minimal roles and local Git checks | `scripts/use-role.mjs`, `.codex/hooks.json`, `scripts/git-hook.mjs`, `scripts/git-hooks/{pre-commit,pre-push}`, `scripts/install-git-hooks.mjs`, `tests/role-policy.test.ts`, `tests/workflow-hooks.test.ts` |
| Preparation readiness | `package.json`, `harness/check-preparation.ts`, `tests/preparation.test.ts`, `target/lab/.gitkeep`, `target/context.md`, `woo/kernel-model.md` |
| Freeze before capture and resumable delivery | `scripts/delivery.ts`, `harness/freeze.ts`, `harness/run-heldout.ts`, `tests/delivery.test.ts`, `docs/delivery.md` |
| Alignment/effort record | `docs/alignment-report.md`, `docs/notes/cost-register.md` |

The local Git setting `core.hooksPath=scripts/git-hooks` was installed successfully. No global/client security setting, dependency or lockfile changed. The installer refuses competing hooks instead of overwriting them. Pre-commit runs full check; a role cannot commit. Only Antoine can use a documented reference/verification checkpoint exception. Accepted implementation and final delivery require full check. Pre-push blocks workflow publication; the final audited publication remains a manual operator action.

The role selector refuses role activation after final freeze, preserves common plus selected instructions, removes only recognized generated files, and no longer generates fine-grained client permission configuration. `.codex/hooks.json` is empty. The old `scripts/role-hook.mjs`, `scripts/role-policy.mjs`, `scripts/check-role-sandbox.mjs` and `ai/roles/config.*.toml` remain dormant legacy tooling. Their unit tests are historical regression checks, not claims of live protection. No duplicate client hook runs alongside the Git checks.

`check:prep` runs type/lint/architecture/integrity plus explicitly selected tooling/adapter tests and structural readiness validation. It excludes engine-dependent harness replay tests and real fidelity comparisons. It validates every selected discovery fixture and every seed, requires explicit seed selection, complete expected decisions/projections, reference metadata, a configured café catalogue and at least one direct-target case. Lab references must name separate `target/lab/` seeds. It reports provenance counts and that engine fidelity is not evaluated. Full `check` retains business comparisons; final delivery reuses the stronger direct-target/nonempty readiness gate.

Delivery retains `prepare/finalize`. The first prepare records commit, timestamp, code/configuration/discovery fingerprints and pre-registered recipe hashes, then stops before captured outcomes are needed. Subsequent prepare waits for or binds a reviewed import plan without moving the freeze, requires every registered recipe exactly once, checks captured actions/context/seed against it, and preserves the immutable first verdict. Published recipes and the original freeze accompany delivery evidence. Source timestamps and hashes support review; they are not independent proof of capture time. Tests use temporary synthetic directories only.

## Observed validation

- Full `corepack pnpm@10.11.0 check`: PASS, 59 tests in 11 files; type/lint/architecture/integrity pass. Empty setup still explicitly reports zero real scenarios and no evaluated business fidelity.
- Test count: original 47 retained, plus 4 preparation cases, 4 Git workflow cases and 4 additional delivery cases = 59. The original role-generation test was updated for the simplified selector. Synthetic verdict tests still verify refusal to overwrite the first verdict.
- `corepack pnpm@10.11.0 check:prep`: expected exit 1 for missing real inputs. The 32 selected tooling tests pass; counts are 0 target, 0 lab, 0 derived, 1 synthetic, 2 validated seeds. Blockers are the unconfigured café catalogue and absence of a complete direct-target fixture. No missing input was converted into a successful reference result.
- Hook installation: PASS locally. Temporary synthetic tests exercise full-check invocation/failure, narrowly documented exceptions, role refusal, pre-push refusal without network, installation idempotence and preservation of other hook setups. Installed hooks were also invoked directly with `git hook run pre-commit` (full gate) and `git hook run pre-push` (expected exit 1); no actual commit/push was attempted.
- Freeze tests: temporary recipes exist before outcomes; a second freeze cannot overwrite the first; earlier captures, changed recipes/actions and missing/duplicate/unregistered selections fail. Frozen fingerprints detect added discovery files and changed executable hooks. Actual end-to-end delivery/Gitleaks/fresh-clone audit was not run in phase A.
- Diff whitespace and active Markdown link checks: PASS.
- Pack archives: byte-identical copies of all three read pack files. Pre-existing handoff text retained in full. Engine/public contract, seed JSON/schema, fixture corpus/manifest, original discovery evidence, adapter, lockfile and `WRITEUP.md` are unchanged.

## Superseded controls and remaining questions

1. The live per-role sandbox/hook/sentinel audit is no longer a prerequisite to business preparation. Its historical native 18/18 PASS remains historical; unperformed client checks remain NOT RUN. Workflow rights, clean checkpoints and tracked/untracked path review remain required.
2. **Source-price precision is a real contract incompatibility to resolve in phase B before freezing.** `Product.unit_price: MinorUnits`, the seed schema and validator currently force integer cents. Shared rules prohibit premature rounding of source prices. No business representation or values were invented in phase A; preparation must document precision/bounds/rounding and adjust the contract explicitly where required.
3. **The remaining effort budget is unknown.** Setup active effort was not measured separately from elapsed time. Do not assume a new independent day or invent a remaining balance. This phase records its instrumented working interval in the cost register; no monetary usage receipt is available.
4. The prior delivery path needed result hashes before recording the freeze. That sequencing conflict is corrected by the mandatory initial pause. The existing fixture shape without outcomes is reused for recipe registration, avoiding a second scenario schema; this format choice is documented in the delivery guide.
5. Structural readiness does not establish factual provenance or business completeness. Phase B still needs evidence review, actual raw action responses, supported settings and rounding rules, and the required two-percentage-coupon lab scenario with sequential discounts disabled. No other combination mode is to be prepared or implemented. Merchant multiple-coupon behavior remains unproven.

No ambiguity blocks completion of phase A. The source-precision issue must be explicitly settled before the evidence checkpoint; missing real inputs are expected now. Phase-A review/commit remains Antoine's decision.

## Stop and next ownership

Stop here. No parent reserved evidence was read, no actual reserved fixtures/verdicts or seeds were created, no phase-B evidence inventory was started, and no Woo/merchant capture, role, engine implementation, commit or push was launched. Only temporary synthetic tests exercised reserved-style paths and verdicts. Discovery cycles remain 0/3.

Next action, after an explicit phase-B mission: Antoine assisted by Codex inventories existing evidence and records established facts, missing facts and required measurements. Read that phase's actual brief then, archive what is actually used, and stop at its pre-implementation evidence checkpoint. Do not automatically launch implementation.
