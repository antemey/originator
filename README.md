# Woo clone — setup scaffold

This repository prepares a deterministic, resettable replication of a narrow cart/coupon slice for L'Atelier des Cafés. **The engine is a stub. No business fidelity has been evaluated.** The three deliverables are the write-up (`WRITEUP.md`), executable evidence (engine, CLI and tests), and the agent artifacts actually used (`AGENTS.md`, `ai/`, role scripts and controls).

## Install & check

Prerequisites: Node **22.16.0** (`.node-version`), Corepack **0.32.0** or a compatible installation, and pnpm **10.11.0** (`packageManager`). Dependency versions are pinned in `package.json` and `pnpm-lock.yaml`. No runtime dependency, bundler, database or framework is required.

```sh
pnpm install --frozen-lockfile
pnpm check
```

If `pnpm` is absent from your PATH, use `corepack pnpm@10.11.0` in place of `pnpm` for both commands. Installation creates pnpm shims only in this repository's ignored `node_modules/.bin`, so nested checks work without changing global configuration. Package download may need network access; `pnpm check` needs neither network nor Docker after installation. The unused esbuild install script remains disabled by pnpm; the installed platform binary is exercised by the tests.

`pnpm check` runs strict TypeScript (including checked JavaScript workflow scripts), lint, architecture rules, fixture/seed integrity and tests. It executes non-synthetic discovery cases when present. At setup it explicitly reports:

> 0 real scenarios: tooling verified, business fidelity not evaluated.

## Scenario & reset

```sh
pnpm -s scenario fixtures/discovery/_example.json
pnpm -s scenario --reset-demo fixtures/discovery/_example.json
```

The CLI itself emits JSON on stdout and diagnostics on stderr. `-s` suppresses pnpm's script banner when piping stdout to a JSON parser. The first mode validates the fixture and its selected seed, executes the engine and reports decisions, projection, captured checkpoints and exact differences. Exit 1 means divergence or invalid input. An explicitly passed synthetic file is runnable; it never counts as business evidence.

Reset demo executes twice with a reset before each run and reports `identical`. This checks repeatability, not correctness; fidelity differences remain visible in each run. The stub returns `NOT_IMPLEMENTED` for recognized actions and `OUT_OF_SCOPE` for unsupported inputs/unknown product references. Refusals do not change the cart and remain in the decision trace. Monetary values are safe integer minor units, never silently rounded or defaulted to zero.

The verification schema requires an expected projection; the CLI also accepts a structurally valid exploratory fixture without an expectation. Decision indices and checkpoint indices are zero-based. A configured seed must match fixture context; seeds resolve only under `target/`.

## Layout

- `src/engine/`: shared public contract, branded money and empty engine facade; `src/cli.ts`: wiring.
- `harness/`: input validation, exact comparison, checksums and the operator's single official held-out runner.
- `target/`, `fixtures/`: unconfigured merchant seed, synthetic tooling data, provenance and checksum manifest.
- `woo/`: a field-only Store API adapter and a rules/provenance template.
- `ai/`, `scripts/`, `.codex/hooks.json`: portable role briefs, setup prompt, supplied evidence and local Git workflow controls.

Read [scope](docs/scope.md) and [setup results](SETUP-NOTES.md) before continuing.

## Working traces

`research/` (local Woo lab) and `docs/notes/` (axes map, cost register) are working traces included as delivered; fidelity claims are bounded in `WRITEUP.md`. Target, lab and derived evidence remain distinct. Synthetic data is tooling only.

The supplied JSON and five PNGs are preserved under `ai/traces/discovery/`. The [axes map](docs/notes/axes-map.md) is a faithful English translation of the supplied v0.1 note, with empty verdicts and unvalidated hypotheses. It does not expand scope. The original assignment and setup brief remain outside the repository.

Antoine selects `./use-role.sh impl` or `./use-role.sh verify`, then opens a fresh Codex session using the printed command. Never resume/fork the other role's conversation or run the roles concurrently. `./use-role.sh none` removes only generated local role files. Both role briefs are portable; no fine-grained client configuration is generated. The `.mjs` bootstrap/hook files run directly in Node and are checked under the same strict TypeScript settings through JSDoc and `checkJs`.

The earlier live-client sandbox/hook/sentinel prerequisite is superseded. Unperformed checks remain NOT RUN. Install local Git workflow hooks with `pnpm hooks:install`: full `pnpm check` before commits and blocked workflow pushes. No global/client configuration changes. Antoine records a clean checkpoint before each role and reviews tracked changes plus new files afterwards. These are workflow controls, not system isolation; keep reserved evidence outside role access. The operator commits outside role sessions. See [checkpoint exceptions and publication](docs/delivery.md).

`pnpm check:prep` runs structural checks and explicitly selected tooling/adapter tests, then validates every discovery fixture and seed, explicit seed selection, required provenance and at least one complete direct-target fixture with a configured café seed. It reports validated counts and never evaluates engine fidelity. It currently exits nonzero because real inputs are missing. A pre-engine reference checkpoint may have green `check:prep` and red full `check`; only Antoine may authorize a documented checkpoint exception. Accepted implementation and delivery still require full `check`.

## Verification limits

No merchant request, new capture, reference container or business implementation occurred during setup. The target seed is empty, the rules document is a template and the write-up contains only headings. The later lab seed must independently exercise two percentage coupons with sequential discounts disabled (the only supported combination mode); that will not establish merchant support for coupon stacking.

Neither role may read held-out evidence, run `pnpm heldout` or reseal fixtures. During a role session, integrity checks enumerate discovery and seeds only and refuse a manifest containing published held-out paths; they do not attempt to read the denied held-out directory. Outside roles, integrity checks include published held-out files without replaying their official evaluation. Roles cannot be activated after the final freeze or held-out publication.

`pnpm check` being green never overrides a published divergence. After final evaluation, consult `VERDICTS.md` and reproduce any case independently with `pnpm -s scenario <fixture>`; this replay does not alter the original verdict. Official held-out exit codes are 0 (complete/no difference), 2 (complete/recorded divergences), and 1 (technical, invalid or incomplete evaluation). An empty directory never creates a verdict.

The operator-only [delivery procedure](docs/delivery.md) separates `prepare` and `finalize`, records the freeze before held-out capture and pauses, resumes reviewed imports, commits packaging before a fresh clone audit, and scans history plus delivered files. It has not been run on this setup. Gitleaks is a local prerequisite, not an npm dependency. No agent pushes.

The initial setup (`ai/prompts/setup.md`) and targeted setup adjustment (`ai/prompts/setup-adjustment/`) are versioned historical annexes included in delivery; historical prompts are not active requirements. Subsequent archives retain executed missions and significant decisions, including useful failures, under the [archival policy](ai/constitution.md#archival-policy). A brief may cover several checkpoints without duplication. No reader/runtime command depends on `../work-briefs/`. See the [setup adjustment report](docs/setup-adjustment-report.md) before the next explicitly authorized phase.
