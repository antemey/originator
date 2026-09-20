# Current operator handoff — final pre-freeze checkpoint, 2026-09-20

Operator-only document; this handoff is not an input for `impl` or `verify` sessions.

The accepted verification checkpoint is `937626b`. Independent verification is committed, the full project check passes with 180 tests, the repository was reported clean at handoff, and no role is active. No final freeze, held-out capture/evaluation or remote push has been performed.

The final pre-freeze sufficiency review concluded **SUFFICIENT WITH EXPLICIT LIMITATIONS**. The implemented V1 slice is considered substantively adequate for the assignment and sufficiently supported by merchant evidence, Woo laboratory evidence, contract properties and independent verification within its declared boundaries. These limits remain part of the final WRITEUP and are not blockers: merchant coffee pricing is directly observed only at quantity 1; quantity recalculation is directly observed on the accessory; multiple-coupon behaviour is lab-only with sequential discounts disabled; the merchant's exact eligibility mechanism and some price/rounding configuration details remain unproven; arbitrary sub-cent cases, allocation across multiple eligible lines, shipping, fees and gifts/BOGO remain outside demonstrated V1 coverage.

A bounded prospective quick-win scan was completed for `Next two days and scaling`. It identified removal/restoration of the last coupon-eligible item as the strongest adjacent extension, sale-price × `DECOUVERTE10` as another plausible small extension, and shipping-threshold interactions as a larger subsystem. No candidate requires reopening V1 before freeze.

Before final freeze, the operator must still:

1. confirm the actual current `HEAD`, working tree, index and inactive role state;
2. review all modified/new paths since `937626b` against authorized ownership and expected operator/documentation work;
3. confirm protected preparation inputs and required fingerprints remain unchanged unless an explicitly authorized amendment exists;
4. run the required project and integrity checks;
5. review the exact staged selection and commit only the authorized final pre-freeze changes after Antoine's approval;
6. verify the resulting commit, hook result and clean repository state.

Any material change to engine behaviour, tests, contract, seeds, discovery references, adapter, harness or executable controls requires explicit operator review before freeze. Do not silently reseal, redefine scope or reopen discovery, implementation or verification.

Only from the reviewed clean pre-freeze commit may Antoine authorize the first stage of `./deliver.sh prepare`. That stage records the frozen commit, executable/input fingerprints and preregistered recipe commitments, then **stops before any held-out capture, import or evaluation**.

After freeze: capture the preregistered merchant recipes and contemporary discovery control replay; sanitize and review the evidence; perform the single official evaluation; preserve the first verdict including divergences; do not tune the frozen engine from held-out results; finalize the WRITEUP and packaging; audit the exact delivery commit from a fresh clone and scan delivered files/history; Antoine alone performs the final remote push or export.

If a new issue requires business analysis, test-design judgment or implementation changes, stop the affected operator action and route it to an appropriately scoped session before freezing.

## Operator checkpoint audit — 2026-09-20

Observed HEAD: `937626b535211c981935b17d8f1f41c2bf54b5de` on `main`; index empty. At entry, only this handoff was modified and no untracked files were reported. `AGENTS.override.md` and `.codex/config.toml` are absent, so no role is selected. Repository-local hooks point to `scripts/git-hooks`, with executable pre-commit and pre-push entrypoints. No repository freeze, delivery state or official verdict exists. Repository held-out directory metadata contains no non-placeholder entry; no reserved outcomes or external reserved files were read.

All 85 files covered by `harness/freeze.ts` match the accepted verification checkpoint byte-for-byte, with no additions or deletions. All 29 published preparation object IDs match their original `818bcfa` checkpoint. Against current HEAD, 26 remain identical; the three changed entries (`ai/roles`, `AGENTS.md`, `ai/constitution.md`) are accounted for by the already accepted verifier-isolation/reference corrections in `7d302d6` and `fa4acec`. No new protected-input amendment or reseal is proposed. Published recipe commitments are unchanged; external recipe bytes were not revalidated in this audit.

`corepack pnpm@10.11.0 check` passed: typecheck, lint (44 files), architecture (19 modules / 45 dependencies), fixture/seed manifest integrity and 180 tests across 14 files, including 38 dedicated verifier tests. The separate readiness entrypoint `node --import tsx harness/check-preparation.ts` passed with 2 target, 2 lab, 1 synthetic fixture and 4 seeds, with no blockers; readiness does not evaluate engine fidelity. Delivery/evaluation tests used temporary synthetic data only. `git diff --check` passed.

The proposed commit selection is exactly `docs/session-handoff.md` and `docs/notes/cost-register.md`: current handoff, audit results and the required effort record. No engine, test, reference or executable change is included. No technical blocker was found within this audit. Staging, commit, actual commit-hook result and resulting clean-state verification remain pending Antoine's approval/action. The sufficiency conclusion and its explicit limitations remain closed and unchanged.

## Immediate next action

Present the exact two-file selection above to Antoine. Do not stage or commit before his approval. After the approved operator commit, verify its contents, actual hook result and clean state; stop before freeze. If resuming in another session, read only this current handoff section and recheck the actual Git state before acting.

Do not run the final freeze until Antoine explicitly authorizes it.

---

# Historical operator handoff — cycle 1 verification checkpoint, 2026-09-18

Operator-only document; this handoff is not an input for verification sessions.

Independent verification handed back from checkpoint `fa4acec5729b003ceeb3bf4a7dd64b3735bf3134`, with one new verifier test file and fourteen artifacts under `ai/traces/verification-cycle-1/restart/`. The verifier reported no confirmed defect in the tested scope and no blocking correction request. Its detailed findings remain attributed to the verifier; the operator did not analyze test design or technical reasoning.

Operator checks confirmed authorized new paths, unchanged frozen inputs and a rerun of full `pnpm check` with 180/180 tests passing, including the 38 dedicated verifier tests. Four discovery CLI scenarios returned no differences; the target-transitions reset demo returned identical runs. The local role is inactive. The cost register records the verifier's approximately 15-minute estimate explicitly as an estimate, not measured active effort or a new budget. The initial failed command/test attempt remains preserved alongside the final results.

Antoine authorized the single verification checkpoint commit containing this handoff. The normal pre-commit hook must pass without an exception. Engine, existing tests, seeds, contract, discovery evidence, model, adapter, harness and controls remain unchanged; only verifier additions and operator status/effort records are selected.

The staged whitespace check is FAIL: `ai/traces/verification-cycle-1/restart/full-check-final.log:76` and `ai/traces/verification-cycle-1/restart/independent-tests.log:10` contain a new blank line at EOF; `ai/traces/verification-cycle-1/restart/mission.md:6` contains trailing whitespace. These original logs and mission bytes are preserved under the archival policy. No whitespace rules or permanent exemptions are changed; this result is separate from the required full-check hook result.

**Stop after committing and verifying this checkpoint. Antoine has an outstanding point to address before freezing.** Do not prepare or perform the final freeze, access reserved recipes/outcomes, capture evidence, start another role, create another commit or push as a continuation of this authorization. No final evaluation has been performed.

---

# Historical operator handoff — optional version-pinned verifier reference, 2026-09-18

Operator-only document: verification sessions must not read this handoff. Their launch prompt supplies the checkpoint, cycle and current-session trace location.

At checkpoint `7d302d60fed20b9c8d20bebf15a45815691b1758`, the restarted verifier reported that it recorded initial assertions before reading the authorized current model, then stopped on exposure to retrospective implementation/review material. It reported no tests added or executed, no held-out access and no functional verdict. The operator confirmed that the sole new path was `ai/traces/verification-cycle-1/initial-assertions.md`, with no tracked changes or staged selection. That trace is retained unchanged as an interrupted-attempt artifact, not a completed verification result or an input to the next verifier.

Antoine approved the narrowly scoped correction and a fresh restart: the source is now defined by its version as well as its path. The original model at phase-B checkpoint `818bcfa6d8f85680c1aa64695614c69c9e221465` is an optional complementary coverage reference after initial assertions, never a required reading or an independent oracle. The current model is prohibited. No retrospective synthesis, new isolation mechanism or reassessment of preparation, implementation or reserved recipes is authorized by this correction.

Original operator decision excerpt, preserved verbatim: “Je valide la reprise proposée, avec un allègement : le modèle du checkpoint B devient une référence complémentaire facultative, pas une lecture obligatoire. Nouvelle session verify, aucune lecture du modèle courant, et pas de nouveau chantier d’isolation.”

The stop followed the instructions correctly. The incident reflects a contradiction in the authorized reading rules, not verifier misconduct or a demonstrated engine defect. Recording assertions before exposure preserves their reported order of creation but does not establish independence of subsequent analysis in that same context. Do not reuse the exposed session. Cycle 1 verification remains pending.

This approved operator amendment changes only `ai/constitution.md` and `ai/roles/verify.md` among frozen instructions; the effective fingerprint amendment is recorded below. The incident record and preserved trace accompany the correction. Engine, tests, current and historical model bytes, contract, seeds, fixtures, adapter, harness, scripts and executable configuration remain unchanged. After the commit is verified, Antoine regenerates `verify` and opens a genuinely new session from that commit. Use `ai/traces/verification-cycle-1/restart/` for its new trace; do not read or overwrite the previous attempt's assertions. No role is automatically activated.

Effective instruction amendment (Git blob/tree IDs):

| Instruction path | Prior checkpoint | Amended checkpoint |
| --- | --- | --- |
| `ai/constitution.md` | `62405d0038c90ed0dd4860e76a49291c532cbed4` | `7a27b863fa84f39fd9831f2dec0304697f5c3663` |
| `ai/roles/verify.md` | `074bb213c50235ac1e91426d40710a2dc32e986a` | `9b5c8de7e7513aa69b1ca626b3b635ad764476e2` |
| `ai/roles` | `2882222adc772ebb2739c8cfa8fc0591e007dedc` | `bae9e03b4be2bd6c38dc37a81e72666d9638922e` |

The optional phase-B model is blob `524f0803c84b1d275a1647710cb6a82ee7da0218`. The preserved interrupted-attempt trace has SHA-256 `cda51ca3871d432d6047b2f366bf274c2c73b8995c185d1ef7f55faea3631c83`. These fingerprints were checked without reading either artifact as a reasoning input. Prior fingerprint tables remain historical; this amendment supersedes only the paths listed above.

---

# Historical operator handoff — verifier reading-order correction, 2026-09-18

Operator-only document: verification sessions must not read this handoff. Their launch prompt supplies the checkpoint and cycle; `AGENTS.md` and `ai/roles/verify.md` supply their authorized reading order.

The first cycle-1 verification session stopped during startup because the common instructions required this operator handoff while its launch prompt prohibited operator/implementation summaries. The session reported no edits, tests, held-out access or functional verdict. The operator confirmed HEAD `2c2eaa5bd2e032849c4b93844693e6712221e038` and a clean working tree/index. This records an exposure to prohibited status material, not proof of exposure to reserved recipes or implementation reasoning. Do not reuse that session or claim it completed independent verification.

Antoine explicitly approved correcting the reading route, recording the incident here, committing the instruction change and restarting verification in a genuinely new session. The correction reserves this handoff and historical setup notes for the operator; the verifier starts with common scope/rules, the public contract, declared domain/seeds and discovery evidence, then forms assertions before consulting the rule model. It must not receive inherited summaries or implementation/review material. No new verifier handoff or copied operator summary is needed.

This is an authorized operator amendment to frozen instructions: `AGENTS.md` and `ai/roles/verify.md` change, with their new input fingerprints recorded below. Preserve the original phase-B fingerprint table as historical evidence. Engine, tests, public contract, seeds, references, harness, adapter and executable controls remain byte-identical to the implementation checkpoint. Cycle 1 verification is still pending; this interrupted startup is not an additional implementation/correction cycle. No role is automatically launched by the correction. After this commit is verified and the role regenerated by Antoine, use its full SHA in the fresh verifier launch prompt.

Effective instruction fingerprint amendment (Git blob/tree IDs; compare with the commit containing this record):

| Instruction path | Prior checkpoint | Amended checkpoint |
| --- | --- | --- |
| `AGENTS.md` | `ca785c14adcfc599e1f81683a9f6b7707d71303b` | `2b7a7ec18f43f041601d6c8889f24370e63234e1` |
| `ai/roles/verify.md` | `79be3588393512a8c8ca2a932c8ffa9617975ab8` | `074bb213c50235ac1e91426d40710a2dc32e986a` |
| `ai/roles` | `5563559af3eae954a79cf9762ad5fd76f036e8db` | `2882222adc772ebb2739c8cfa8fc0591e007dedc` |

All other 27 groups in the phase-B fingerprint table remain unchanged. The verifier receives the new checkpoint SHA and corrected instructions, not this incident narrative. A disposable synthetic repository confirmed that role generation includes the corrected reading restrictions; no real role was activated for that check.

---

# Historical handoff — implementation checkpoint, cycle 1 of 3, 2026-09-18

The implementation session has handed back its work and its role is inactive. Antoine authorized the operator checkpoint and commit. The commit containing this handoff records four engine files, five test files, the updated rule model and two implementation traces, based on `6ef398146251812b048b601277b928b8ffe4cf5b`. Phase-B reference checkpoint `818bcfa6d8f85680c1aa64695614c69c9e221465` remains unchanged.

Operator checks: all 12 implementation paths are within role rights; the 29 preparation input fingerprint groups are unchanged. Full `pnpm check` was rerun successfully: typecheck, lint, architecture, fixture/seed integrity and 142/142 tests passed, including all four discovery comparisons. The normal pre-commit hook is required without a checkpoint exception. These command results do not replace independent verification. Operator review is limited to paths, fingerprints, command results and commit authorization; it does not assess implementation reasoning.

Gitleaks scanned the staged-file export with redacted output and found no secrets. Staged whitespace check: FAIL for one trailing space at `ai/traces/implementation-cycle-1/brief.md:46`. The received prompt archive is preserved byte-for-byte; no whitespace rule was changed and this check is not reported as PASS. This finding is separate from the passing full project gate.

Next: Antoine selects a genuinely fresh `verify` session in `repo/` from this committed checkpoint. Cycle 1 verification is pending. Do not resume or fork the operator or implementation conversation; do not transmit implementation/reviewer explanations, summaries, prompt archives or traces to verification. Follow the verification brief: derive assertions from the public contract and authorized evidence before consulting the rule model for coverage. Reserved recipes/outcomes must not be read or copied indirectly into role contexts. If accidental exposure occurs, stop, report it without reproducing protected content, and await an operator decision; unchanged files do not preserve an "unknown sequences" claim after exposure.

No verification role, final-delivery freeze, official evaluation or push has been initiated by this checkpoint. Earlier handoffs below are historical; their stub status, pending preparation and one-commit exceptions are superseded for the current checkpoint.

---

# Historical handoff — phase B review point, 2026-09-18

Operator only; no impl/verify role active. The isolated tooling repair is committed as `b33fce531e5de61fda298c2de273e1207408b1ba` (`fix: preserve setup state on validation failures`), following phase-A commit `a49874f`. Its four-file selection passed the full 67-test gate in an export without phase-B changes and through the normal pre-commit hook. Only one repair commit was created; no push.

Phase B then resumed. The uncommitted changes now contain two direct-target fixtures, two local lab fixtures, target/mirror/two-coupon seeds, explicit input-price precision and constrained settings, direct projection tests, provenance, initial rules and approach comparison. Original supplied evidence is unchanged. See [the preparation inventory](../ai/traces/preparation/evidence-inventory.md) and [target context](../target/context.md). The two failed lab attempts are retained with their methodological consequences.

Checkpoint checks rerun on 2026-09-18: `pnpm check:prep` PASS (44 tests; structural evidence counts 2 target, 2 lab, 1 synthetic; 4 seeds). Full `pnpm check` FAIL (71 passed, 4 discovery comparisons against the untouched stub failed). This is expected preparation status, not business fidelity. No failure is suppressed or relabelled PASS. The single phase-B commit containing this updated handoff is the authorized pre-implementation input checkpoint; its parent is `b33fce531e5de61fda298c2de273e1207408b1ba`. Input object fingerprints are recorded in the preparation inventory. The final-delivery freeze is a separate later operation.

The scope status and quantity distinction are now clarified. Antoine examined projection P1 and confirmed its conformity, then explicitly accepted Codex's audit for P2–P3 with the stated limits instead of personally repeating those comparisons; the inventory records this adjustment to the review procedure. He then authorized the checkpoint and commit. After the commit is verified, stop: Antoine must separately select a fresh implementation session (discovery cycles used: 0/3). His selected action-only recipes are registered outside the repository; only hashes and registration date are published in fixtures/PROVENANCE.md. Keep their contents out of all role contexts, prompt archives and repository traces. No reserved outcomes were accessed or captured. No final-delivery freeze or verdict exists. The lab containers were stopped after measurement; local persistent Docker volumes are preserved. No third-party container was modified.

## Authorized reference-checkpoint exception — 2026-09-18

Purpose: retain the reviewed phase-B model, references and documentation before any engine implementation. Antoine authorized this single local checkpoint commit after accepting the evidence review and its limits. Authorization applies to the documented pre-engine reference procedure in `docs/delivery.md`, not to an accepted implementation or final delivery.

The full check exits 1 solely for four `tests/fixtures.test.ts` discovery comparisons: `lab-mirror-mixed`, `lab-two-percent-nonsequential`, `target-mixed-replay` and `target-transitions`. Their expected nonempty lines, coupons, totals and accepted decisions differ from the unchanged stub's empty/zero projections and `NOT_IMPLEMENTED` refusals. The other 71 tests pass; typecheck, lint, architecture and fixture/seed integrity pass. Preparation validation passes all 44 selected tests. The affected unverified claim is clone business fidelity, not reference readiness. Any additional failure blocks this exception.

Keep the installed pre-commit hook enabled. For this one operator commit only, set `ORIGINATOR_CHECKPOINT_EXCEPTION=reference` and `ORIGINATOR_EXCEPTION_RECORD=docs/session-handoff.md`. The hook reruns full check and must report its failure and the reference exception. No permanent hook/configuration change, test skip, implementation repair, final-delivery freeze or role activation is authorized by this exception.

Earlier handoff follows unchanged as historical context. Its phase-A state has been superseded by the working state above.

---

# Current handoff — phase A, 2026-09-18

Phase A aligns the existing setup only. Stop at the alignment report; phase B requires an explicit new mission. Continue in `repo/` on `main`, French conversation and English authored artifacts.

The new shared rules are reflected in `AGENTS.md`, `ai/constitution.md`, role briefs and scope. Exact phase-A instructions are archived in `ai/prompts/setup-adjustment/`; do not reconstruct requirements from historical briefs. No external pack is needed by reader/runtime commands. The initial setup and targeted adjustment remain historical delivery annexes. Archive future executed missions and significant decisions with their results, including informative failures; checkpoints alone add no prompt obligation. See the [archival policy](../ai/constitution.md#archival-policy).

The per-role client hook/sandbox/sentinel prerequisite is superseded. Earlier native 18/18 results remain historical; live client checks remain NOT RUN. The selector generates only common plus role instructions, retaining two fresh sequential contexts. Local Git hooks and operator path review replace active fine-grained client controls as workflow checks.

Next authorized phase: inventory existing evidence, identify established/missing facts, resolve source-price precision in the contract before freezing, then prepare seeds/fixtures and the required two-percentage-coupon lab scenario with sequential discounts disabled. No other coupon-combination mode. `pnpm check:prep` intentionally fails until a valid café seed and complete direct-target fixture exist; it does not execute engine fidelity checks. Full `pnpm check` still runs business comparisons.

Before each role Antoine records a clean checkpoint; afterwards he reviews tracked changes and new files against role rights. Document candidate approaches before engine implementation. Frozen delivery records fingerprints and pre-registered recipes before capture, pauses, then resumes import/evaluation without moving the freeze. See [delivery](delivery.md).

Known preparation questions: `Product.unit_price` currently uses integer minor units and cannot represent finer source precision; resolve explicitly from evidence before the checkpoint. Previous active setup effort was not measured, so the remaining one-day budget is unknown; do not reset it. Engine/seed remain untouched, discovery cycles remain 0/3, no reference runtime/capture/role/evaluation launched.

The two pre-existing working changes were this handoff and the reference to it in `AGENTS.md`; both are retained and updated. The prior handoff is preserved below as historical evidence, not current instructions. Its client-validation prerequisite and suggested restart are superseded.

---

# Session handoff — 2026-09-16

## Where we stopped

Setup is complete. The next session is operator preparation, before business implementation. Work from `xx_ORIGINATOR/repo/` on `main`; communicate with Antoine in French and author repository content in English.

The goal is a deterministic, in-memory TypeScript reproduction of a narrow cart/coupon/tax slice for L'Atelier des Cafés, excluding shipping and fees. WooCommerce is the separate local reference. See [scope](scope.md) and [constitution](../ai/constitution.md) for the agreed boundaries.

- Scaffold commit: `ae51f17`; setup audit record: `0cfe62a`. Both were checked from independent fresh clones; the final audit passed frozen-lockfile installation and `pnpm check` with 47 tests. These results apply to the setup, not future changes.
- Engine is a stub, merchant seed is unconfigured, no real executable scenarios exist, and `WRITEUP.md` contains headings only. Business fidelity has not been evaluated.
- Supplied observation JSON and five captures are preserved byte-for-byte under `ai/traces/discovery/`. The JSON copy was restored after detecting earlier formatting changes. Do not format or silently edit evidence.
- No role is active at handoff; no business role, reference container, official held-out evaluation, delivery procedure or push has been launched. Discovery cycles used: 0 of 3.

## Open points and next steps

1. Complete the operator's synthetic live-session checks in [SETUP-NOTES.md](../SETUP-NOTES.md). Native sandbox checks passed 18/18, but actual client hook loading, automatic invocation and all file-tool routes remain **NOT RUN**. Keep real held-out evidence outside the agents' accessible environment until protection is demonstrated.
2. Review existing discovery evidence to establish supported settings, catalogue, seed, executable fixtures and contract suitability. Record unknowns explicitly; do not infer missing merchant configuration. The [axes map](notes/axes-map.md) contains hypotheses, not requirements.
3. Document 2–4 candidate approaches in `WRITEUP.md` before coding the engine. Prepare the separate Woo lab measurements, including two combinable percentage coupons; this is lab evidence, not demonstrated merchant behavior.
4. Antoine then selects fresh, sequential `impl` and `verify` sessions. Never resume/fork one role as the other. Freeze contract, seeds, fixtures and harness during roles; use at most three discovery cycles. Official held-out evaluation follows the final code freeze, once, with no subsequent code correction.

## Practical restart

Read `AGENTS.md`, this note and `SETUP-NOTES.md`, then inspect current Git status before editing. The shared check is `corepack pnpm@10.11.0 check` (`pnpm` is absent from the ordinary shell PATH here). Node is pinned to 22.16.0. The `.mjs` hooks run directly in Node and are covered by strict TypeScript through JSDoc/checkJs.

`../setup-audit-ae51f17/` and `../setup-audit-final/` are retained audit clones, not working repositories or delivery files. Continue in `repo/`. The original setup prompt is archived in `ai/prompts/setup.md`; it explains past work and is not a request to repeat setup. The elapsed setup interval exceeded 90 minutes; active effort was not measured separately. Keep the next phase focused on evidence and the narrow business slice.

Suggested opening prompt for a new preparation session at the repository root:

> Read AGENTS.md, docs/session-handoff.md and SETUP-NOTES.md. Inspect the current Git state and resume from the completed setup. Respond in French; write repository content in English. Start by summarizing the remaining operator checks and the immediate preparation work needed before implementation. Do not repeat setup, launch a role, access held-out evidence or start business implementation. Propose the next bounded step for Antoine to agree on.
