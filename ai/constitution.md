# Constitution

- Deterministic checks precede agent judgment. Prefer simple solutions.
- Keep business changes small: roughly 250 lines or five files per batch. This is guidance, not a limit on the initial scaffold.
- At most three discovery implementation → verification → correction cycles in total. Record the cycle number; stop and hand off blockers to Antoine.
- Record provenance for each useful rule: source revision and file:line, target observation, lab measurement, derivation or hypothesis. Unknown sources and inferred configuration remain explicitly unknown or inferred.
- Freeze fixtures, seeds, public contract and harness during role sessions. Propose necessary changes to Antoine with reasons; neither role reseals evidence.
- Reject unknown references and out-of-contract inputs explicitly without changing the cart. Never recognize expected carts by their amounts, use random output or derive expectations from the clone.
- Keep secrets out of files and traces. No agent push.
- Keep target, lab, derived and synthetic evidence distinct. Synthetic tooling checks never establish business fidelity.
- Keep held-out evidence inaccessible until the operator freezes code and evaluates it once. No engine, seed, contract, harness, test or executable configuration corrections after that evaluation.
- Follow [scope](../docs/scope.md). Historical notes cannot expand it.
