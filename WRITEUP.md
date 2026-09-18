# Target, slice and reasoning

The target is L'Atelier des Cafés, restricted to article prices, percentage-coupon eligibility, retained tax amounts and guest cart transitions. Discovery covers Café Découverte (250g, grains) and Paquet de 50 spatules, France/Paris 75001, EUR, below the advertised gift threshold. Shipping, fees, gifts, checkout and accounts are excluded. No extra item was removed to manufacture an admissible capture.

This is the pre-implementation evidence checkpoint. The engine is still a stub. Reference observations and structural validation do not establish clone fidelity.

# Candidate approaches and trade-offs

| Approach | Speed and fidelity | Robustness and verification | AI contribution / limitation |
| --- | --- | --- | --- |
| Black-box rules fitted to displayed totals | Fast for the supplied nominal basket; weak at identifying rounding and hidden configuration | Easy to overfit; incomplete old observations cannot become direct fixtures | AI can propose competing explanations, but must not fill missing monetary fields |
| Execute a full Woo runtime as the clone | Strong coverage for a pinned vanilla runtime; slow and outside the required small in-memory engine | Requires WordPress/database/environment; does not establish merchant plugin equivalence | AI could automate setup, but this would replace the assigned architecture |
| Limited Woo-derived model, source-guided algorithms, target-constrained values — chosen | More preparation than curve fitting; keeps only the observed slice | Native source, target/lab separation and frozen fixtures make differences reviewable | AI inventories evidence, runs bounded experiments and drafts the model; source and capture checks constrain its inferences |

The chosen seed records exact scaled input prices, selected FR rates, two catalogue identities, observed sold-individually behaviour and nominal eligibility. Inclusive entered prices and product-based coupon restriction are explicit candidate assumptions, not uniquely identified merchant settings. V1 lab adds LAB20 with sequential discounts disabled; no other combination mode is prepared.

# How AI was used

Codex aligned tooling, then repaired two failure-ordering defects with synthetic regressions. The repair is isolated in local commit `b33fce5`. Preparation uses direct public guest Store API responses and a pinned local WooCommerce 10.1.2 lab. Source review and retained failed experiments informed corrections to lab setup and capture transport. No engine output generated an expected value. Actual instructions, evidence and significant method changes are retained without archiving routine commit approvals or full conversations.

# Verification story

## Confident and verified

At the reference level, a separate initially empty target session reproduces three nominal projections exactly. A vanilla local mirror matches the same three article projections. Actual action responses establish coupon application/removal, accessory quantity/removal and measured refusals. Direct amount checks in the adapter tests cover pure coffee, a mixed coupon basket and the required two-coupon lab basket. These are checks of references and projection, not successful engine comparisons.

## Divergent and known

The stub cannot reproduce the four complete discovery scenarios. Full checking must report those mismatches until implementation; they must not be skipped. The local two-coupon result exposes different rounding surfaces: displayed coupon HT discounts are 95 and 190 cents, while cart discount HT is 284 cents; corresponding tax components are 5 and 10 versus aggregate 16. The adapter preserves each field independently.

Two failed lab attempts are retained: an unregistered tax class and a cookie-free Cart-Token session that lost cart contents. Native class registration and a guest cookie/Nonce protocol with persisted-GET checks produced the accepted measurements. The precise Cart-Token failure cause remains unknown; Woo source was not changed.

## Suspect and untested

Target Woo version, internal price-entry basis and product-versus-category coupon restriction remain unidentified. Multiple-coupon behaviour is established only in the lab. Residual distribution across several eligible lines, other tax settings, other products, authenticated contexts and gifts are not claimed. Unseen action-only recipes selected by Antoine are registered externally; only hashes and registration date are published. Antoine examined P1 and confirmed conformity, then accepted Codex's deterministic audit for P2–P3 with the stated limits; this is not a claim that he personally rechecked all three pairs. No impl/verify role or official held-out evaluation has run.

# Next two days and scaling

The evidence review is accepted and Antoine has authorized the pre-implementation checkpoint. The next step, separately selected by Antoine, is a fresh implementation role; a later fresh verification role can challenge this bounded model, with at most three discovery cycles. Broader settings and catalogues would require new discriminating evidence and an explicit scope decision, rather than an expanding generic Woo engine.

# Assumptions made

The compatible mirror uses inclusive prices, per-line tax rounding, one noncompound rate per product and product-based coffee eligibility. Native IDs are mapped to clone identities; the single observed variation is flattened locally. Prices keep six decimal places as exact source integers, while outputs are safe-integer cents. Supported input bounds and fixed settings are documented in `target/context.md` and enforced before freezing. All current success claims concern captured references or tooling; business fidelity is unverified.
