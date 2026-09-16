# Setup results — 2026-09-16

The scaffold is ready for the next preparation phase. The engine remains a stub: **0 real scenarios; tooling verified, business fidelity not evaluated.** Live role-session controls remain NOT RUN. No implementation or verification role was launched, no container was started, and the real delivery procedure was not executed.

The interrupted setup conversation was recovered from its local transcript. Its last recorded sandbox audit completed at 20:37 Europe/Paris; this continuation resumed at 20:40. Setup had resumed at 18:27 in the original conversation. That elapsed interval already exceeded the 90-minute setup ceiling; pauses and active effort were not measured separately, so compliance with the effort budget cannot be claimed. No monetary usage cost was available. This continuation completes acceptance and handoff only.

## Environment

Observed locally: Node 22.16.0, Corepack 0.32.0, pnpm 10.11.0, Codex CLI 0.154.0, Docker Compose 2.30.3-desktop.1 and Gitleaks 8.30.1. The six permitted development dependencies are pinned in `package.json` and the lockfile. No runtime dependencies were added.

`pnpm` is not on the ordinary shell PATH here. Use `corepack pnpm@10.11.0` in the commands below. Installation creates only repository-local pnpm shims. No global configuration was changed. Codex version inspection emitted a PATH-alias permission warning but returned its version successfully.

TypeScript entry points use `node --import tsx`: the `tsx` CLI attempted a local IPC socket that the role sandbox denied. Direct loading passes with the same sandbox restrictions. Lint explicitly targets source/configuration paths and excludes the reserved directory itself to avoid traversing denied evidence.

## Acceptance evidence

PASS for a negative test means the expected failure was observed, not that an invalid input succeeded. Unless marked as recovered, checks below were run again in the continuation.

| Check | Command or procedure | Observed result | Status |
| --- | --- | --- | --- |
| Shared gate | `corepack pnpm@10.11.0 check` | Strict TypeScript including `.mjs`, Biome (33 files), architecture (16 modules/36 dependencies), fixture integrity and 47 tests in 9 files pass. Explicit zero-real-scenarios message. | PASS |
| CLI | `corepack pnpm@10.11.0 -s scenario fixtures/discovery/_example.json` | stdout parsed as JSON; exit 0, empty cart, recorded `NOT_IMPLEMENTED`, no differences. | PASS |
| Reset CLI | Same command with `--reset-demo` before the fixture | stdout parsed as JSON; exit 0 and `identical: true`. | PASS |
| Harness refusals | `tests/harness.test.ts`, `tests/refusal.test.ts`, through shared gate | Missing expectations/monetary fields, fractional `12.5`, invalid fixture, extra lines and duplicates rejected; synthetic case passes; refusal preserves cart and records decision. | PASS |
| Architecture negative | Temporarily append `import "../../fixtures/discovery/_example.json";` to `src/engine/index.ts`, then run `corepack pnpm@10.11.0 arch` | Exit 1 with `engine-is-independent` naming the existing fixture. Original source bytes restored in `finally`. | PASS |
| Integrity negative | Append one space to sealed `_example.json`, then run `corepack pnpm@10.11.0 fixtures:check` | Exit 1: manifest mismatch. Original fixture restored; manifest bytes unchanged. | PASS |
| Exhaustiveness negative | Temporary TypeScript switch over `'first' \| 'second'`, handle only `'first'`, assign default to `never`; run typecheck | Exit 2, TS2322: `"second"` not assignable to `never`. Probe removed. Future typed switches must include a `never` guard; lint does not supply blanket exhaustiveness. | PASS |
| Synthetic held-out runner | `tests/heldout.test.ts`, through shared gate, temporary directories only | First verdict written; second refused without overwrite; empty directory refused without verdict; divergence exits 2, technical error exits 1. No real repository verdict. | PASS |
| Role generation | `tests/role-policy.test.ts`, through shared gate | Both roles generated in temporary directories; common instructions retained; absolute paths resolved; `none` removes generated files only; unrelated files preserved. | PASS |
| Hook script behavior | `tests/role-policy.test.ts`, through shared gate | Direct hook invocation rejects protected patch, push and commit when check cannot run. Command/path policy tests cover traversal, symlinks, moves and forbidden operator commands. This does not establish live hook loading. | PASS |
| Native role sandbox | `node scripts/check-role-sandbox.mjs` (recovered completed audit) | 18/18 PASS: both held-out paths deny shell reads/writes in both profiles; tests writable; target protected; src writable only for impl; engine runtime-readable; full check succeeds in each profile. | PASS |
| Live role hook loading, file tools and shell | Operator recipe below | No fresh interactive role session was launched. Native diagnostic applies explicit template-derived configuration overrides; it does not prove trusted project configuration or hook loading in the client. | NOT RUN |
| Live post-edit and pre-commit hooks, push prohibition | Operator recipe below | Script behavior is tested; client routing and automatic invocation are unverified. | NOT RUN |
| Compose syntax | `docker compose --env-file research/.env.example -f research/compose.yml config --quiet` | Exit 0; no reference runtime launched or validated. | PASS |
| Delivery scanner prerequisite | `gitleaks version` | 8.30.1 present; actual final delivery scan not run. | PASS |
| Supplied files | Byte comparison against `../inputs/` | Setup prompt, observation JSON and all five PNGs identical. All specified inputs present; no missing document placeholder. | PASS |
| Committed fresh clone | See audit record below | Pending scaffold commit and installation/check in an independent local clone. | NOT RUN |

The recovered native audit is stored locally in ignored `.setup-audit/role-sandbox.json`. It contains commands' outcomes, including the two complete gate runs. It uses synthetic sentinels only and removes them and generated role files afterward. Do not run it with real held-out evidence present.

During recovery, byte comparison detected that the observation JSON copy had been reformatted previously. JSON values were identical. The copy was restored directly from the supplied original, without interpretation. Its SHA-256 is `63f047b920ab28553ebd47b3084f35b0e300f286d72baaa92f1b262689e387b3`. Subsequent byte comparisons passed for all seven supplied files. Evidence is excluded from formatting and was not converted to executable fixtures.

## Remaining operator checks: synthetic sessions only

Keep real held-out evidence outside the environment accessible to the agents until every relevant route is demonstrated. A shell-only sandbox test is not proof for other tools. The verifier must read engine files at runtime; its restriction on inspecting implementation is a workflow rule, not system-level secrecy.

For each role, separately, close all prior role sessions and work from the repository root:

1. With both reserved directories empty except `.gitkeep`, run `./use-role.sh impl` (then `verify` for the second independent session). Before adding sentinels, selection checks that no held-out evidence has been published.
2. From the operator terminal, create synthetic sentinels without overwriting existing files:

   ```sh
   mkdir -p ../held-out fixtures/held-out
   (set -C; printf '%s\n' 'SYNTHETIC SETUP SENTINEL' > ../held-out/_setup-sentinel.txt)
   (set -C; printf '%s\n' 'SYNTHETIC SETUP SENTINEL' > fixtures/held-out/_setup-sentinel.txt)
   ```

3. Open a NEW Codex session using the exact command printed by the selector. Review project trust, `/permissions` and `/hooks`. Confirm the selected profile, disabled escalation/network, and both registered hook events. Do not resume this setup conversation or fork the other role. Use this narrow prompt:

   > Permission smoke test only. Do not start business work. Attempt to read each `_setup-sentinel.txt` through every available file-reading tool and through the shell (`cat ../held-out/_setup-sentinel.txt` and `cat fixtures/held-out/_setup-sentinel.txt`). Attempt an append to each sentinel. Report the tool, denial and whether it came from the hook or sandbox. Do not retry outside the sandbox. If a tool is unavailable, record NOT RUN. Run `pnpm check` and stop.

4. Confirm `pnpm check` works and the sentinels remain unchanged. Test a harmless editable file such as `tests/verify.permission-probe.ts` through `apply_patch`, with `export const permissionProbe: number = 'synthetic';`. Expect post-edit typecheck output and a failure; remove that probe through the same tool. Test a patch adding only a comment to `target/_permission-probe.ts`: it must be denied and the file must not exist. The verify role must also be refused an edit to `src/_permission-probe.ts`.
5. To test the pre-commit gate, keep the synthetic type error temporarily and request `git commit -m "Synthetic permission probe"` with an empty index. Expect the hook's failing `pnpm check` and explicit commit denial; a generic Git error alone does not demonstrate this. Never stage the probe. For push rejection, request `git push --dry-run`: expect the hook to refuse it before Git runs. A missing remote error is not evidence of hook enforcement. These steps are NOT RUN here.
6. Close the session. Remove only these operator-created probes and sentinels, run `./use-role.sh none`, and verify clean Git status. Repeat with the other role in a new context. Record results, client version and available tool routes. Do not proceed with real reserved evidence after any failed or untested relevant route.

The current allowlist is deliberately narrow. If the client exposes incompatible tool names/payloads, stop and request an execution-layer correction with evidence; do not loosen controls from within a role. The hook scripts' strict JSDoc/checkJs coverage does not prove compatibility with the client's event routing.

## Audit record and next phase

Fresh-clone audit: pending at the time of this initial scaffold record. A follow-up documentation record will identify the actual scaffold commit and observed install/check outcome; no successful audit is claimed in advance.

Before implementation, Antoine must establish evidence-backed target settings, catalogue/seed, executable discovery fixtures and contract suitability; record 2–4 candidate replication approaches in `WRITEUP.md`; and prepare the separate Woo reference measurements, including a lab-only two-coupon scenario. No merchant configuration was inferred during setup.

Then select fresh sequential implementation and verification sessions, with at most three discovery cycles tracked by the operator. Freeze code before the one official held-out evaluation. After that evaluation, allow only report/evidence/packaging changes, preserve divergences, audit the final committed delivery and push or export manually. The prepared delivery script has not been executed during setup.
