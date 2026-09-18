# Executed user brief

The following instruction is preserved verbatim from the user launch message.

```text
hello codex, nouvelle mission : 
Perform independent verification for phase C, cycle 1, from checkpoint
  fa4acec5729b003ceeb3bf4a7dd64b3735bf3134.
  This is verification, not implementation or final evaluation.

  Work from repo/ in a genuinely fresh session. Do not resume or fork
  operator, implementation, code-review or previous verification sessions.
  Do not import their summaries, reasoning or assertions.

  Confirm the exact HEAD, clean working tree and index, and active verify
  role. Stop on any mismatch before editing. Check status and identifiers,
  not implementation diffs or narrative commit history.

  Read AGENTS.override.md and ai/roles/verify.md. Follow their authorized
  reading order: common scope and constitution, public contract, declared
  domain and seeds, then authorized discovery evidence.

  Do not read:
  - docs/session-handoff.md or SETUP-NOTES.md;
  - the current woo/kernel-model.md;
  - operator/implementation/review summaries, conversations or traces;
  - previous verification-attempt traces;
  - engine implementation or existing implementation tests as sources
    for designing assertions.

  Do not follow links or run broad searches into prohibited material.

  Derive and record your own initial assertions from the frozen public
  contract, declared domain, seeds and authorized discovery evidence.
  Identify each assertion's basis: captured merchant/lab evidence or an
  explicit contract requirement. Do not invent uncaptured merchant outcomes.

  Check captured decisions, checkpoints and final projections, and relevant
  contract properties including refusal without mutation, recalculation,
  reset/seed isolation and snapshot independence.
  Cover V1 only, including the non-sequential two-coupon lab scenario.

  Model reading is OPTIONAL. Only after recording initial assertions,
  you may consult this exact original phase-B document for complementary
  coverage information:

  git show 818bcfa6d8f85680c1aa64695614c69c9e221465:woo/kernel-model.md

  It is not an independent oracle. Do not read the current model or
  reconstruct a substitute from it. Skipping this optional reference
  does not block verification.

  Executing the engine and existing suite through approved entrypoints
  is allowed. Runtime loading of source files does not authorize reading
  implementation source as a reasoning input.

  Write dedicated tests under tests/verify* and your own trace under
  ai/traces/verification-cycle-1/restart/.
  Do not read or overwrite previous verification traces.
  Preserve existing tests and all frozen inputs and controls.

  Run the new tests, relevant discovery scenarios through the approved CLI,
  and full pnpm check. Preserve failures and reproducible counterexamples.
  Do not weaken checks or alter expectations merely to pass.
  No finding or test-count quota: report no defect when that is the result.

  Report in French: evidence checked, independent assertions and results,
  confirmed discrepancies, coverage limits and required operator decisions.
  Write artifacts in English; preserve original evidence and labels.
  Distinguish observed defects from hypotheses and untested behaviour.

  If progress requires a protected change, missing authoritative evidence
  or an operator decision, stop the affected work and report the blocker,
  completed work and decision needed. Disclose scope deviations.

  If prohibited material is encountered, stop and notify Antoine without
  reproducing it. Do not retain an independence or unknown-sequences claim
  merely because files remain unchanged. Await an operator decision.

  No held-out access, new captures, Woo startup, resealing, staging, commit,
  push, role switching or delivery operation.
  Stop at the verification handoff.
```
