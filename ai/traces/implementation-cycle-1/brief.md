# Executed implementation brief — cycle 1 of 3

Received in this fresh implementation session on 2026-09-18. Preserved verbatim below; no operator conversation or previous session summary was imported.

```text
Work from repo/ as the implementation role, discovery cycle 1 of 3.
  Respond in French; author repository artifacts in English.

  Read AGENTS.override.md and its referenced active instructions.
  Confirm HEAD is 6ef398146251812b048b601277b928b8ffe4cf5b
  and the working tree and index are clean before starting.

  Implement the engine under the frozen public contract, prepared seeds,
  discovery evidence and declared V1 scope. Preserve source precision,
  captured decisions, recalculation after mutations and the required
  two-percentage-coupon lab behaviour with sequential discounts disabled.
  No fixture-specific shortcuts or hardcoded expected carts.

  Add meaningful tests for refusal without mutation, nonempty reset,
  reset/replay equality, seed isolation and copied snapshots.
  Run full pnpm check and retain actual failures and material corrections.

  Change only paths permitted by the implementation role.
  Do not modify frozen inputs or controls, obtain new captures, launch Woo,
  activate another role, commit or push.

  This must be a genuinely fresh session. Do not import the operator
  conversation, its summaries, or reserved recipe contents through any
  prompt, trace or other indirect source. Do not read held-out recipes
  or outcomes.

  If accidental exposure occurs, stop and notify Antoine. Describe the
  exposure without copying protected content into role-accessible files.
  Do not continue claiming that the affected sequences were unknown;
  the operator must decide how to proceed.

  At handoff, report changed paths, observed checks, supported behaviour,
  remaining limits and blockers. Stop; do not launch verification.
```

## Operator review follow-up — 2026-09-18

Received instruction/comment, preserved verbatim:

```text
Quelques commentaires: 
Les quatre scénarios de découverte passent au rejeu, sans différence. Je n’ai pas identifié de défaut bloquant sur ces cas. Je termine par les branches moins couvertes : répartition des centimes entre lignes éligibles, bornes numériques et validation des seeds.
Revue depuis 6ef3981, nouveaux fichiers non suivis inclus : aucun défaut bloquant identifié sur le périmètre préparé.

  Trois points à renforcer :

  - Tests d’arrondi incomplets — tests/engine-pricing.test.ts:92 teste la précision fine sans coupon. Il manque un cas
    combinant prix à six décimales et remise, notamment autour d’un seuil : 1,054999 € / 1,055000 €, quantité 1, coupon 10
    %.

  - Répartition des centimes peu éprouvée — src/engine/pricing.ts:54 répartit un reliquat entre lignes, mais les scénarios
    actuels n’ont qu’une ligne éligible. Un test dérivé avec deux variantes éligibles et ordre d’insertion inversé
    sécuriserait cette logique, sans élargir les revendications de fidélité marchande.

  - Risque de divergence des validations — src/engine/seed.ts:38 reprend indépendamment de nombreuses contraintes du
    harness. Cette séparation respecte l’architecture, mais des tests de compatibilité sur les seeds et leurs limites
    aideraient à prévenir une dérive lors des évolutions.

  Vérifications effectuées : les quatre scénarios de découverte rejoués sans différence ; TypeScript et git diff --check
  passent. Quelques sondes en mémoire confirment aussi le refus sans mutation d’un ajout dépassant la quantité maximale. Le
  gate complet pnpm check n’a pas été relancé.
```
