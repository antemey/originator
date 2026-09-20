# Operator delivery procedure

Current status (2026-09-20): preparation, the pre-capture freeze and the one-time official held-out evaluation are complete; [VERDICTS.md](../VERDICTS.md) records three PASS outcomes with no differences. Final packaging and the fresh-clone delivery audit remain pending. The prepare instructions below document the completed procedure; do not rerun the official evaluation. [WRITEUP.md](../WRITEUP.md) is the canonical report checked by the validator, and [WRITEUP.pdf](WRITEUP.pdf) is its preferred human-readable rendering. Regenerate the PDF after canonical-text corrections and check both formats for substantive agreement before finalization.

Only Antoine runs `./deliver.sh prepare` and `./deliver.sh finalize`. Close both roles first and run `./use-role.sh none`. No command pushes, rewrites history, deletes capture sources or reruns an existing official verdict.

## Checkpoints, role review and Git hooks

Install once from the repository root: `corepack pnpm@10.11.0 hooks:install`. The installer sets repository-local `core.hooksPath` to `scripts/git-hooks`; it refuses another configured hook path or existing pre-commit/pre-push hooks. It does not change global/client settings. Reinstall explicitly in another working clone if needed. Reader `pnpm check` requires neither hook installation, Docker nor reference access after dependencies are installed.

The local pre-commit hook runs full `pnpm check`; roles cannot commit. The pre-push hook blocks workflow pushes without contacting a remote. These are workflow checks, not an inviolable boundary.

Before each role, Antoine records a clean committed checkpoint and cycle number. After closing that fresh context, review `git status --short --untracked-files=all`, the complete tracked diff from that checkpoint, and contents of new files. Check allowed paths against `ai/roles/impl.md` or `ai/roles/verify.md`, including controls and original discovery evidence. Do not expose implementation/diff traces to verification. A needed frozen-input change returns to operator preparation and rechecks affected claims.

Only Antoine, outside roles, may authorize a failing pre-engine reference checkpoint (green `check:prep`, documented red full `check`) or an intentionally failing verification checkpoint. First write an English record under `docs/` with checkpoint purpose, authorization, exact failure and affected claims. Then, from the operator terminal, use `ORIGINATOR_CHECKPOINT_EXCEPTION=reference` (or `verification`) and `ORIGINATOR_EXCEPTION_RECORD=docs/<record>.md` for that commit only. The hook still runs full check and reports the failure; it does not turn it into PASS. Roles cannot use this exception. Accepted implementation and final delivery always require full `pnpm check`. No phase-A commit is authorized by this documentation.

Prompt archives follow the [mission/decision policy](../ai/constitution.md#archival-policy). Include the initial setup and targeted setup adjustment as historical annexes, then executed briefs and consequential interventions with their results. Commits/checkpoints do not require a new prompt or duplication of an existing one.

## Prepare — freeze, pause, capture, resume

Before freezing, finish discovery, the engine, evidence-backed target/lab seeds and tests. Document 2–4 approaches before implementation; at most three discovery cycles. V1 lab uses two percentage coupons with sequential discounts disabled and no other combination mode. Run full `pnpm check`, review and commit outside roles, and leave the tracked tree clean. `check:prep` and final delivery require a configured café seed and at least one complete direct-target fixture; synthetic or lab-only corpora cannot satisfy that requirement.

Antoine pre-registers recipes under `../held-out/recipes/` outside the roles' access, before capturing their outcomes. A recipe reuses the existing fixture shape with `id`, non-synthetic `provenance`, `source` (registration metadata), `context`, explicit `seed_file` and ordered `actions`, but without `expected` or `checkpoints`. The filename equals its id. Seeds already belong to the frozen repository. No captured outcome belongs in these recipes.

Create ignored `.delivery/recipes.json` listing selected recipe files and their reviewed hashes:

```json
[
  {
    "source": "../held-out/recipes/case-id.json",
    "sha256": "REVIEWED_RECIPE_SHA256"
  }
]
```

Run `./deliver.sh prepare` for the first time. It checks the clean tree, full offline gate and real discovery, validates registered recipes, records the current commit, timestamp, code/configuration/discovery fingerprints and recipe hashes in `.delivery/freeze.json`, writes state and **stops before importing or evaluating outcomes**. The first call never consumes an existing import plan. No result hashes are needed to establish the freeze.

Only after that recorded freeze, Antoine captures the registered cases and preserves sanitized raw responses and their provenance. Captured fixture ids, provenance, contexts, seed paths and ordered actions must match their recipes; recorded capture timestamps cannot precede the freeze. Timestamps/hashes provide an auditable workflow, not independent proof of when a human captured data. Outcomes remain outside role access.

Install Gitleaks separately if missing; scripts do not install it globally. Review/redact every import, including sensitive-key values. Create `.delivery/plan.json`:

```json
{
  "freeze_commit": "FULL_RECORDED_FROZEN_COMMIT_SHA",
  "redaction_reviewed": true,
  "sensitive_keys_reviewed": true,
  "heldout": [
    {
      "source": "../held-out/case-id.json",
      "sha256": "REVIEWED_CAPTURED_FIXTURE_SHA256",
      "recipe_file": "../held-out/recipes/case-id.json",
      "session_recipe": "Actual session setup and ordered actions",
      "action_channel": "Actual action channel",
      "read_endpoint": "Actual captured read endpoint",
      "independent_replay": "Actual replay performed, or explicitly not performed"
    }
  ],
  "probes": []
}
```

Run `./deliver.sh prepare` again. Without a plan it reports that it is waiting and preserves the freeze. With a plan, it requires the same freeze and exactly one import for every registered recipe, binds the reviewed plan hash, verifies recipe/capture consistency and reviewed bytes, scans selected imports, imports evidence and records provenance. It archives the original freeze and recipes under `ai/traces/` for delivery, then runs the official evaluation once and seals the expanded evidence manifest. An import error does not move the freeze. A bound plan cannot be silently replaced.

Sensitive-key mentions such as Cookie, Authorization, Cart-Token and nonce are alerts, not proof of a secret; exact reviewed bytes plus actual Gitleaks scanning are required. Only explicitly selected sanitized JSONs are imported. No expectation is generated or corrected from the engine.

The first verdict is immutable. The runner records frozen commit, fingerprints, fixture hashes, differences and completeness. Exit 2 divergences remain reportable; a recorded technical error requires investigation, never a favorable rerun. Official evaluation without the pre-capture freeze is refused. Only synthetic temporary inputs exercise this sequencing during phase A; no actual reserved evidence is accessed.

## Finalize

Complete the 2–3-page write-up with real verification results, known divergences, gaps and AI usage. Only new evidence, verdicts, reports and packaging may change after the final code freeze, including during the capture pause. Engine, seeds, contract, harness, tests, scripts and executable configuration must match their freeze fingerprints exactly.

Run `./deliver.sh finalize` in an operator terminal. It checks frozen fingerprints, evidence integrity, non-placeholder report sections and real reference provenance, then runs `pnpm check`. Review the displayed diff and new files. Enter `COMMIT` to authorize the local packaging commit; only explicitly listed permitted paths are staged, with selected sanitized probes force-added individually.

The script clones the actual delivery commit into a new directory beside `repo`, verifies its HEAD, installs from the lockfile and runs `pnpm check`. It then runs Gitleaks against the full cloned history and an export of the tracked delivery files, excluding dependencies and local secrets. Missing tools, scan findings or failed checks stop delivery. It prints the audited SHA, held-out outcome and files grouped by deliverable, and retains a local audit receipt.

If installation or scanning fails after evaluation, fix the external prerequisite and rerun `finalize`; do not repeat held-out evaluation. Report-only corrections can be recommitted through `finalize`. Evaluated held-out bytes and the original verdict are immutable. If frozen code changes, the script stops with protocol invalidation. Any history rewrite is a separate operator decision and requires auditing the actual resulting delivery commit again.

After a successful audit only, Antoine performs the single manual push or exports that exact commit. The pre-push hook intentionally blocks workflow publication; for his manual push of the audited SHA only, Antoine may use `git -c core.hooksPath=/dev/null push <remote> <audited-sha>:<branch>` from his own terminal. This one-command override does not modify installed hook settings and is never an agent action. Exclude the parent held-out directory, raw probes, `node_modules`, local role files, `.delivery`, `.env` secrets and SQL dumps.
