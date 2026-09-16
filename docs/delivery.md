# Operator delivery procedure — not run during setup

Only Antoine runs `./deliver.sh prepare` and `./deliver.sh finalize`. Close both roles first and run `./use-role.sh none`. No command pushes, rewrites history, deletes capture sources or reruns an existing official verdict.

## Prepare

Before freezing, complete discovery, the engine, the evidence-backed target/lab seeds and tests. Document 2–4 candidate approaches before implementing the engine. Use at most three discovery cycles. Finish code changes, run `pnpm check`, commit them, and leave the tracked tree clean.

Install Gitleaks separately if missing; the script never installs it globally. Verify Node/Corepack/pnpm are available. Held-out cases must have been prepared outside the roles' accessible environment. Put only reviewed, sanitized fixture JSONs into `../held-out/` at the final operator stage. Select sanitized lab probes individually from `research/probes/`.

Create ignored `.delivery/plan.json` with this structure, replacing every placeholder with actual reviewed data. Each reviewed hash binds the attestation to exact bytes; no expectation is automatically rewritten.

```json
{
  "freeze_commit": "FULL_FROZEN_COMMIT_SHA",
  "redaction_reviewed": true,
  "sensitive_keys_reviewed": true,
  "heldout": [
    {
      "source": "../held-out/observed-case.json",
      "sha256": "REVIEWED_FILE_SHA256",
      "session_recipe": "Actual session setup and ordered actions",
      "action_channel": "Actual action channel",
      "read_endpoint": "Actual captured read endpoint",
      "independent_replay": "Actual replay performed, or explicitly not performed"
    }
  ],
  "probes": []
}
```

Run `./deliver.sh prepare`. It checks the clean freeze, real discovery, selected import hashes and Gitleaks; stages only listed JSONs for a pre-Git secret scan; prints sensitive-key alerts without values; copies reviewed evidence; appends provenance; runs the official held-out evaluation once; preserves exit 2 divergences; seals fixtures/seeds; and records its state under `.delivery/`.

Sensitive-key mentions such as Cookie, Authorization, Cart-Token and nonce are review alerts, not proof of a secret. The operator's inspection and actual scanner are both required. No keyword search substitutes for Gitleaks.

The runner records date, frozen commit, code/configuration fingerprints, fixture hashes, differences and completeness. An existing verdict is never overwritten. A recorded technical error invalidates completion and requires operator investigation, not a favorable rerun.

## Finalize

Complete the 2–3-page write-up with real verification results, known divergences, gaps and AI usage. Only reports, evidence and packaging may change after the official evaluation. Engine, seeds, contract, harness, tests, scripts and executable configuration must match their freeze fingerprints exactly.

Run `./deliver.sh finalize` in an operator terminal. It checks frozen fingerprints, evidence integrity, non-placeholder report sections and real reference provenance, then runs `pnpm check`. Review the displayed diff and new files. Enter `COMMIT` to authorize the local packaging commit; only explicitly listed permitted paths are staged, with selected sanitized probes force-added individually.

The script clones the actual delivery commit into a new directory beside `repo`, verifies its HEAD, installs from the lockfile and runs `pnpm check`. It then runs Gitleaks against the full cloned history and an export of the tracked delivery files, excluding dependencies and local secrets. Missing tools, scan findings or failed checks stop delivery. It prints the audited SHA, held-out outcome and files grouped by deliverable, and retains a local audit receipt.

If installation or scanning fails after evaluation, fix the external prerequisite and rerun `finalize`; do not repeat held-out evaluation. Report-only corrections can be recommitted through `finalize`. Evaluated held-out bytes and the original verdict are immutable. If frozen code changes, the script stops with protocol invalidation. Any history rewrite is a separate operator decision and requires auditing the actual resulting delivery commit again.

After a successful audit only, Antoine performs the single manual push or exports that exact commit. Exclude the parent held-out directory, raw probes, `node_modules`, local role files, `.delivery`, `.env` secrets and SQL dumps.
