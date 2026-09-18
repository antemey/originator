# Phase A — align the existing setup

**Owner:** operator session assisted by Codex; no active implementation/verification role.
**Output:** a small reviewed diff and a runnable preparation path. No actual seed values, real-fixture conversion, merchant capture, container startup or engine calculation in this phase.

## 1. Inspect, preserve, reuse

Inspect only the project, Git status and active instructions. The last report mentioned commit `0cfe62a`, 47 tooling tests, and uncommitted changes in `AGENTS.md` and `docs/session-handoff.md`; verify, do not assume or restore that state. Preserve existing changes and show which new changes are yours. Reuse working scripts rather than replacing them wholesale.

## 2. Update active instructions

Synchronize `AGENTS.md`, constitution, role briefs, scope/handoff and setup notes with the shared rules. Remove active requirements to finish per-role Codex sandbox, hook or sentinel validation before business preparation. Preserve earlier test results and identify superseded requirements; never convert an unperformed check to PASS. Fix broken document references using actual repository paths, without adding a parallel documentation tree.

Keep two fresh sequential contexts and a minimal `use-role.sh`. Generated role instructions must contain the common instructions plus the selected role. Clean up only files recognized as generated; never alter global/client security settings. Retain useful working controls, but disable contradictory or needlessly blocking generated fine-grained configurations. Do not develop new Codex-specific infrastructure.

Use local Git `pre-commit` for full `pnpm check` and `pre-push` to block agent/workflow pushes; avoid duplicate hooks. Document the operator-only checkpoint exception from the shared rules and final manual publication. These are workflow checks, not a security boundary. No real push is needed to test them.

## 3. Close the preparation/checkpoint gap

Implement or reuse the minimal preparation check described in the shared rules. It must require a valid café seed and at least one complete direct-target discovery fixture when phase B ends, and validate every selected fixture/seed without executing the empty engine as a passing reference test. Keep full business comparison enabled in `pnpm check`.

Prepare its checks with temporary synthetic inputs. No current real data is populated during alignment; a preparation check reporting missing real inputs is expected, not a setup failure. Preserve truthful empty-setup reporting and the stronger nonempty final-delivery gate.

Ensure `target/lab/`, a compact rule-record template and the next-phase ownership are represented. Do not fill business entries now.

## 4. Adapt only the necessary delivery sequencing

Keep `deliver.sh prepare/finalize`, the immutable first verdict and existing safety checks. The frozen commit/fingerprints must be recorded before held-out results are captured. Allow the operator to pause for capture and resume import/evaluation without moving that freeze or overwriting a verdict. Test sequencing with synthetic temporary files only; no real held-out files or verdicts.

Document the post-role path review and the pre-registered recipe check. Reuse existing hashing/validation; do not build a permissions framework, generic audit system or new orchestrator.

## Stop / report

Run applicable setup/tooling checks, including full `pnpm check` while no real cases exist. Report changed files, observed results, remaining blockers and superseded controls. Explain test-count changes rather than preserving 47 artificially. Leave any commit for Antoine's review/authorization. Next action is the evidence inventory in phase B; do not start it automatically.
