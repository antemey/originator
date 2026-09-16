# Codex — setup only

Work in `~/Documents/00_Projects/xx_ORIGINATOR/` and prepare `./repo`.
This is the first setup session; assume no previous conversation context.
Read this prompt, `inputs/BRIEF-SETUP-AGENT-4.md`, then `inputs/assignment.rtf`.
Execute the V4 setup only, within a maximum of 90 minutes, without trying to consume the full budget.

This prompt supplies the agreed scope and the language, document-packaging and Codex-only execution adjustments to V4. These adjustments take precedence for those subjects only; keep the remaining V4 requirements. Do not search for or reconcile earlier briefs.

## Language

Communicate with Antoine in French. Author the shared repository in English from the first commit: documentation, agent instructions and prompts, comments, new identifiers, test descriptions, CLI diagnostics, trace explanations and commit messages.

Preserve supplied evidence byte-for-byte: JSON, screenshots, merchant product names, coupon codes and captured messages retain their original language. Do not translate an observed message used in an exact comparison. English explanations may accompany original evidence, not replace it.

For the newly created fixture schema, use the English provenance values `target`, `lab`, `derived`, `synthetic` in place of V4's `cible`, `labo`, `dérivé`, `fictif`. Apply this consistently to the schema, types, synthetic example, tests and documentation. Do not change the supplied observation JSON.

## Agreed scope

Record the following in `docs/scope.md` and link it from `AGENTS.md` and both role briefs:

- Target: L'Atelier des Cafés; a small catalogue based on the observed references and the public coupon `DECOUVERTE10`.
- TypeScript engine, in-memory state, seeded reset, cart and coupon actions, CLI. Compare item amounts, discounts, taxes and supported decisions; exclude shipping and fees. Reject out-of-scope inputs without silently approximating them.
- WooCommerce is the only local reference, separate from the clone runtime and from `pnpm check`. Later, a separate lab seed will exercise two combinable percentage coupons; this is lab evidence, not an observed merchant capability. Medusa and Saleor are excluded.
- One repository on `main`, two sequential Codex sessions for the tool-agnostic `impl` and `verify` roles, no worktrees, no CI, no agent push.
- At most three discovery implementation/verification cycles. Held-out cases remain inaccessible to both roles; the operator evaluates them after freezing the code, without subsequent engine corrections. During setup, use only synthetic cases to test the tooling.

## Codex-only execution

Use Codex for setup and both subsequent roles. Keep the constitution and role briefs tool-agnostic; put Codex-specific launch, permissions and hook configuration in the execution layer. Do not create `CLAUDE.md`, `CLAUDE.local.md`, `.claude/` or a second agent orchestration.

`AGENTS.md` contains the common instructions. `use-role.sh impl|verify` prepares the selected role and its local Codex configuration, then tells Antoine how to open a fresh session; it must not launch the role. Follow V4's updated sections 7–9 for the generated files. Never resume or fork the implementation conversation as the verification session.

Preserve V4's write boundaries, frozen artifacts, pre-commit checks, push prohibition and held-out isolation. Validate mechanisms against the installed Codex version; do not translate Claude permission strings mechanically or claim that instructions alone enforce access restrictions. Test held-out denial through the actual file-reading tools, where available, and shell commands in both roles. If a protection cannot be demonstrated, record NOT RUN or FAIL as appropriate and keep real held-out evidence outside the agents' accessible environment.

## Exact inputs and repository destinations

The input pack is complete for this setup:

- `PROMPT-SETUP.md`: this instruction. Save an unchanged copy as `repo/ai/prompts/setup.md`.
- `BRIEF-SETUP-AGENT-4.md` and `assignment.rtf`: read as setup specifications; keep the supplied originals outside the repository.
- `carte-des-axes.md`: create a faithful English translation in `repo/docs/notes/axes-map.md`, labelled as a translation of the supplied v0.1 research note. Preserve axis IDs, references, formulas, hypotheses and empty verdicts. Do not validate, correct or expand its technical claims during setup. Reference it as a hypothesis map for the next phase, not an authoritative contract or a coverage requirement.
- `observations-monetaires-expurgees.json`: copy unchanged to `repo/ai/traces/discovery/observations-monetaires-expurgees.json`.
- `captures/`: copy its five PNG files unchanged to `repo/ai/traces/discovery/captures/`.

Use `docs/scope.md` instead of V4's `docs/parti-pris.md`, and `docs/notes/axes-map.md` instead of `docs/notes/carte-des-axes.md`. Omit `docs/decouverte.md` entirely; do not replace it with another discovery summary or a missing-report placeholder. Point the relevant role instructions directly to the supplied evidence under `ai/traces/discovery/`. Update V4's document-presence acceptance check to these destinations. There is no `historique/` folder to copy or inspect.

Use the constitution rules already stated in V4; no separate constitution source document is part of this pack. Do not read the observations to infer business rules during setup or turn them into runnable fixtures. Keep `target/seed.json` unconfigured and `woo/kernel-model.md` at the header/template stage.

## Execution and handoff

Inspect the existing project and Git state without overwriting work. Make no global configuration changes, merchant requests, new captures, container launches or business-logic implementation. Do not run the real delivery procedure or launch the implementation role.

Demonstrate V4's acceptance checks and record commands, observed results and PASS/FAIL/NOT RUN in `SETUP-NOTES.md`. Never report a planned or unavailable check as passed. Validate the committed scaffold from a fresh local clone as specified in V4.

Return the repository path, scaffold commit SHA, `SETUP-NOTES.md`, check results and actual tooling blockers. Stop before implementation.
