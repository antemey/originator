# Agreed scope

Target: L'Atelier des Cafés. The later implementation will use a small catalogue based on observed references and the public coupon `DECOUVERTE10`.

Build a TypeScript engine with in-memory state, seeded reset, cart and coupon actions, and a CLI. Compare item amounts, discounts, taxes and supported decisions exactly. Exclude shipping and fees. Reject out-of-scope inputs without silently approximating them.

WooCommerce is the only local reference. It remains separate from the clone runtime and from `pnpm check`. A later, separate lab seed will exercise two combinable percentage coupons. This is lab evidence, not an observed merchant capability. Medusa and Saleor are excluded.

Use one repository on `main`, two fresh sequential Codex sessions for the tool-agnostic `impl` and `verify` roles, no worktrees, no CI and no agent push. Antoine selects the role and makes the final push or zip.

Allow at most three discovery implementation/verification cycles. Held-out cases remain inaccessible to both roles. Antoine evaluates them after freezing the code; no subsequent engine corrections are allowed. Use only synthetic cases during setup.

The setup contains no business calculation, real executable fixture or invented merchant configuration. `target/seed.json` is unconfigured. Captured evidence is copied unchanged to `ai/traces/discovery/` and has not been interpreted during setup.

[The axes map](notes/axes-map.md) is a faithful English translation and hypothesis map for the next phase, not an authoritative contract or coverage requirement. Its technical claims have not been validated or corrected during setup. Gift/BOGO behavior is not an acquired feature or a prerequisite.

Before implementation, the operator must establish the evidence-backed seed, executable discovery fixtures, supported settings and contract suitability, and document candidate strategies in `WRITEUP.md`. Both roles must escalate unsupported configuration instead of inferring it.
