# Shared rules

## Scope, effort, and sources of truth

Replicate the café shop's article pricing, coupon eligibility/application, taxes and cart transitions in a small deterministic in-memory engine. Shipping, fees, gifts/BOGO and other unsupported mechanisms are outside the declared domain. The merchant judges target-fidelity claims; Woo local provides separately labelled laboratory evidence. Multiple-coupon behaviour is not demonstrated on the target. V1 must reproduce a lab scenario with two percentage coupons and sequential discounts disabled. This is the only supported combination mode; do not prepare or implement any additional mode.

Keep the existing repository, `main`, installed compatible toolchain, lockfile, strict TypeScript/ESM and architecture checks. No worktrees, CI, UI, general Woo engine, new dependencies, global configuration changes or automatic push. Count preparation, investigation, coding and write-up within the assignment's one day of actual effort. Use the remaining budget, not a new independent time allowance; record actual work and stop low-value expansion.

Use repository files to establish the current state. Preserve uncommitted work and original evidence. No destructive Git operations, global installs or broader filesystem exploration. New artifacts are English; conversations remain French; captured language and labels remain unchanged. Mark missing evidence as missing, not reconstructed fact.

The repository's active constitution, role briefs, scope and frozen contract must be sufficient for later role sessions. Historical notes are not instructions. Reuse existing paths, schema literals and script facilities; do not rename them just to match this pack. Here, target/lab/derived/synthetic are provenance meanings, not a requested enum migration.

## Engine and comparison contract

Preserve `reset(seed)`, `dispatch(action)` and `snapshot()`, with copied snapshots, deterministic recalculation and no state carried between resets or seeds. Unsupported references/actions and invalid inputs are explicit refusals without cart mutation. Preserve the add, quantity-change, remove, apply-coupon and remove-coupon action contract; quantity zero remains outside it. Preserve both existing CLI modes and their truthful JSON output.

`src/engine/` must not read fixtures, tests, research, the adapter or the harness. Public types live in `src/engine/contract.ts`; the comparator receives engine and seed, and cannot derive expected values from the implementation. Only wiring entrypoints assemble these pieces.

Observable monetary values are safe-integer minor units. Do not force intermediate arithmetic or source prices to cents prematurely. Use explicit input precision, calculation/rounding rules and supported bounds; retain the existing no-bigint/no-decimal-library constraint. Validate external JSON from `unknown`: missing/invalid values never become zero.

Preserve this article-only projection:

- Lines: reference, optional variant, quantity, `line_subtotal`, `line_subtotal_tax`, `line_total`, `line_total_tax`.
- Coupons: code, `total_discount`, `total_discount_tax`.
- Totals: `total_items`, `total_items_tax`, `total_discount`, `total_discount_tax`.
- Scenario trace: ordered action decisions; intermediate snapshots only when actually captured.

Exclude shipping, fees, aggregate `total_tax`, `tax_lines` and `total_price`. Compare required fields exactly, including missing/extra/duplicate lines or coupons; match lines by reference/variant and coupons by code, without treating display order as calculation order. Preserve action/decision order. Compare captured messages/codes exactly when expected; never invent them.

The adapter validates and projects fields without recalculating discounts/taxes. Action decisions require their own captured responses; a final GET cart does not establish them. Each fixture references a seed under `target/`; lab fixtures cannot silently use the café seed. Synthetic tooling fixtures are hashed but are not fidelity evidence. Keep raw sanitized responses, provenance and integrity checks for additions/deletions as well as edits.

## Checkpoints and ownership

Before implementation, freeze seeds, schemas/contract, discovery references, adapter, harness and executable controls. Tests and engine may then evolve only within role rights. After the final code freeze, also freeze all implementation/tests and executable configuration; only new evidence, verdicts, report and packaging may change.

Role rights: `impl` writes `src/` except the frozen contract, its tests, `woo/kernel-model.md` and `ai/traces/`. `verify` writes only `tests/` and `ai/traces/`; it forms assertions from contract/captures before consulting the rule model for coverage. It does not inspect engine code or implementation/diff traces. Neither role edits seeds, fixtures, adapter, harness or executable controls, captures references or runs held-out evaluation.

A fixture checksum is an integrity check, not an inviolable boundary if its manifest can also change. Before each role, Antoine records a clean checkpoint; afterwards he reviews tracked changes and new files against the role's allowed paths, including control files. Roles cannot reseal inputs, switch roles or bypass checks. A necessary reference/contract change returns to operator preparation, with reasons and affected claims rechecked.

`pnpm check` remains the full offline check; real mismatches must fail. Add or reuse one small `pnpm check:prep` command for structural checks, seed/corpus validation and explicitly selected tooling/adapter tests, not engine fidelity. It must report validated reference counts and say that engine fidelity is not evaluated. Do not label a skipped or expected-failing engine test as passed.

The pre-engine reference checkpoint may therefore have `check:prep` green and full `check` red for recorded stub/business mismatches. Antoine alone may authorize a documented pre-commit exception for that checkpoint or an intentionally failing verification checkpoint. Roles cannot use that exception. Accepted implementation checkpoints and final delivery require full `pnpm check`; no delivery with an empty real corpus.

Keep secrets out of artifacts. Merchant interaction is limited to guest browsing and ephemeral cart actions: no account creation, checkout or payment. Woo local starts only in preparation, binds its web service to `127.0.0.1`, uses explicit versions and exposes no public database. Reader checks require neither Docker nor merchant/lab access after dependency installation.
