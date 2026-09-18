# Phase C independent verification — cycle 1 restart

## Result

No confirmed engine discrepancy was observed in this verification. All four discovery scenarios match their captured decisions, observed checkpoints and final article projections. The added contract probes pass. This is bounded discovery verification, not final evaluation or a claim of general merchant fidelity.

Launch and final HEAD: `fa4acec5729b003ceeb3bf4a7dd64b3735bf3134`. Launch working tree/index were clean and the generated role marker was `verify`. Final status contained only new files in this `restart/` directory and `tests/verify-phase-c-cycle1-restart.test.ts`; no tracked file or index change. No staging, commit, push or role transition occurred.

## Evidence and independent checks

`initial-assertions.md` records the independently derived assertions and their bases before engine execution. The optional historical model was not consulted. Engine source, existing implementation test source, previous verification traces and prohibited operator/review material were not read. Runtime loading through the engine facade, CLI and existing suite was used as authorized. No claim about hidden or unknown sequences is made.

The independently written `audit-evidence.py` checks the four source SHA-256 values against fixture provenance and projects source monetary strings without recalculation or importing the adapter. Its 53 comparisons cover 21 action decisions, 20 captured checkpoints, eight persisted lab GET projections and four final projections. All have empty differences in `evidence-audit.json`. Source raw price integers and precision also agree with the selected seeds. This audit preserves source labels and full field differences if a comparison fails.

Sources, all under `ai/traces/discovery/`:

| Fixture | Sanitized source | Evidence class |
| --- | --- | --- |
| target-transitions | phase-b-target-sequence.json | Merchant capture |
| target-mixed-replay | phase-b-target-replay.json | Merchant capture |
| lab-mirror-mixed | phase-b-lab-mirror-cookie-session.json | Local lab capture |
| lab-two-percent-nonsequential | phase-b-lab-interaction-measured.json | Local lab capture |

The new test file contains 38 passing tests: four captured replays with reset/replay determinism, 32 malformed/unsupported action probes in both empty and populated states, one cross-seed/instance isolation test and one deep snapshot-copy test. Captured replays check every expected decision field and all required monetary fields, keeping identity multiplicity and ignoring only display order. Refused actions also check non-mutation. Reset tests begin from a populated cart; LAB20 availability does not leak into the merchant seed. Snapshots retain their contents across subsequent dispatch/reset, and modifications to returned objects/arrays do not mutate the engine.

The non-sequential lab interaction reproduces coffee line total/tax 662/36, coupon discounts 95/5 and 190/10, and cart discount/tax 284/16. Removing LAB20 returns to the captured one-coupon state. Differences between separately rounded coupon figures and cart totals were retained as observed, not treated as defects.

## Commands and results

All commands ran from the repository root. The shell did not have `pnpm` on PATH (initial `pnpm scenario --help` exited 127); subsequent commands used the already installed shim with the process-local prefix `PATH="$PWD/node_modules/.bin:$PATH"`. No installation or persistent configuration change was made.

| Command | Result / artifact |
| --- | --- |
| `git rev-parse HEAD`; `git status --porcelain=v1 --untracked-files=all` | Exact required checkpoint; empty status at launch; final HEAD unchanged and only authorized new paths |
| `pnpm scenario --help` with local PATH | Exit 1: CLI treats `--help` as a file; no source or data change |
| `pnpm scenario` | Exit 1 with usage: `pnpm scenario [--reset-demo] <fixture.json>` |
| `node --import tsx --input-type=module -e 'import("./src/engine/index.ts").then(m => console.log(Object.keys(m)))'` | Runtime export identifier `createEngine`; no implementation source inspection |
| `pnpm exec biome check --write tests/verify-phase-c-cycle1-restart.test.ts` | Formatting applied only to the new test |
| `pnpm exec vitest run tests/verify-phase-c-cycle1-restart.test.ts` | Exit 0; 38 passed; `independent-tests.log` |
| First `pnpm check` | Exit 2, new test's literal zero lacked the branded money type; preserved in `full-check.log` |
| Final `pnpm check` | Exit 0; typecheck, lint, architecture, fixture integrity and 180 tests across 14 files passed; `full-check-final.log` |
| `python3 ai/traces/verification-cycle-1/restart/audit-evidence.py` | Exit 0; four fixtures, 53 comparisons, no differences; `evidence-audit.json` |
| `pnpm scenario fixtures/discovery/target-transitions.json` | Exit 0, no differences; corresponding `scenario-*.log` |
| `pnpm scenario fixtures/discovery/target-mixed-replay.json` | Exit 0, no differences |
| `pnpm scenario fixtures/discovery/lab-mirror-mixed.json` | Exit 0, no differences |
| `pnpm scenario fixtures/discovery/lab-two-percent-nonsequential.json` | Exit 0, no differences |
| `pnpm scenario --reset-demo fixtures/discovery/target-transitions.json` | Exit 0, identical runs, no differences |

The zero-type correction was confined to the new test's explicitly known safe value and changed no expected amount or assertion. The full gate subsequently executed the corrected tests. The CLI JSON logs were parsed to verify empty differences and identical reset-demo runs; see `cli-summary.json`.

The full suite prints messages from its existing synthetic held-out tooling tests. Only the authorized full suite was run: no reserved corpus was opened and no `pnpm heldout` or official evaluation was invoked. Existing test source was not inspected.

## Limits and handoff

- Merchant coffee pricing is observed at quantity 1 only. The request for quantity 3 has a captured refusal; its immediate non-mutation passes as a contract property, not as a captured merchant checkpoint. Coffee quantity 2 pricing is not established.
- Multiple coupons remain lab-only. No second combination mode or uncaptured merchant coupon outcome was asserted.
- Candidate inclusive-price basis, tax settings and eligibility mechanism are compatible assumptions, not uniquely identified merchant settings. Six-decimal source precision was preserved; these prices alone do not demonstrate rounding behavior for arbitrary sub-cent input prices.
- Contract probes are finite, not exhaustive over all JavaScript objects, seeds or sequences. Seed isolation concerns reset/coupon availability and separate engine instances; caller mutation of a seed object after reset was not separately tested.
- No shipping/fees, other products/variants, live captures, Woo startup, held-out evaluation or final delivery was performed. No frozen input/control or existing test was changed. No scope deviation requiring an exception was identified.

No engine correction, fixture change or blocking operator decision is requested. Antoine should review every new path and choose the next checkpoint outside this role. Stop here; no next role or phase was launched.

Effort for operator cost-register transfer: approximately 15 minutes of this verification session, including reading, independent assertion/test construction, evidence audit and checks. This is a session estimate, not a new budget or a statement of remaining total effort. `docs/notes/cost-register.md` was not read or edited because verify writes are limited to tests and traces.
