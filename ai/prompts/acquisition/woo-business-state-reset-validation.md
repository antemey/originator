# Executed operator acquisition-method validation — 2026-09-20

The instruction below is preserved verbatim because it authorizes a significant validation-method change: isolating Woo business state while retaining normal browser access state. Result: [validation record](../../traces/acquisition/woo-business-state-reset-validation.md).

```text
The access-layer prerequisite is confirmed on the original port-9223 session.

Validate the Woo business-state reset procedure now. Do not execute any
held-out recipe.

1. Inspect only merchant cookies/storage needed to distinguish:
   - Cloudflare/access-layer state;
   - Woo/cart business-session state.

Do not record secret values. Names/types and non-reversible fingerprints are
sufficient.

2. If Woo/cart state can be isolated confidently, clear only that state.
Preserve Cloudflare/access state and unrelated browser state.

If the two cannot be distinguished safely, stop before deleting anything.

3. Reload the normal storefront and perform one empty-cart preflight from the
page context.

Require:
- HTTP 200;
- valid cart JSON;
- zero lines;
- zero coupons;
- guest context.

If a Woo/cart identity is observable, compare only fingerprints before/after.
A changed identity is supporting evidence, not a mandatory success condition.

4. If the clean business state is confirmed, replay target-mixed-replay
exactly and compare decisions, checkpoints and final projection with its
original discovery reference.

Success requires:
- no business-state carry-over after reset;
- normal Cloudflare access preserved;
- target-mixed-replay reproduces the reference with zero material differences.

Stop after this validation.

No held-out recipe execution, no new fallback strategy, no frozen-input
change, no import/evaluation, no transfer of Cloudflare cookies/tokens.

Return in French with:
- Woo state identified/cleared;
- access state preserved;
- empty-cart result;
- session/cart identity evidence if observable;
- control comparison result;
- VALIDATED or NOT VALIDATED.

Deux points importants :

Le fait que l’identité Woo soit actuellement la même est utile : ça montre qu’on part bien de la session métier du contrôle précédent, donc le reset pourra être observé plutôt que supposé.
On ne demande pas absolument une nouvelle identité Woo : le vrai critère est l’absence de carry-over métier + reproduction du contrôle. Une identité différente, si observable, renforce simplement la preuve.

Si cette étape passe, on aura enfin une procédure propre pour les trois held-out : même accès Cloudflare validé, état Woo réinitialisé et contrôlé avant chaque recette.
```
