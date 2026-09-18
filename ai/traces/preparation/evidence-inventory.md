# Evidence inventory — phase B, 2026-09-18

Starting revision: `a49874f279586907667bcd642a25c8534d900398`. Inventory precedes new phase-B outcomes; original observations were already known and are not retrospectively preregistered or held out. Original JSON and five PNGs are unchanged.

| Evidence | Established within this observation | Compatible but not identified | Missing / next discriminating measurement |
| --- | --- | --- | --- |
| `ai/traces/discovery/observations-monetaires-expurgees.json` | Supplied summary reports Café Découverte, 250g / Café en grains (non moulu), qty 1: 946 HT + 52 tax = 998 cents; coupon `decouverte10`: 95 HT + 5 tax discount; resulting line 851 + 47. Mixed accessory line: 125 + 25 unchanged by coupon. EUR/2 and raw price precision 6 reported. | Coffee 5.5% and accessory 20% explain these observed lines; inclusive source price 9.98 and exclusive source price with more precision can produce the same display. Coffee eligibility could be product or category restriction. | This is a summary, not complete raw responses. Native IDs, raw source prices, complete cart aggregate retained fields, timestamps with timezone and action responses absent. Capture current products and ordered responses. Do not reconstruct a direct-target fixture. |
| `atelier-panier-mixte.png` | Coffee 9,98€, accessory 1,50€, coupon -1,00€, total including shipping 18,35€. Public promotion: 10% on Nos Cafés, gift above 100€. | Two selected items appear, no gift visible in this low-value basket. | Does not identify internal coupon restrictions or rounding steps; capture article fields directly. |
| `atelier-coupon-applique.png`, `atelier-panier-75001.png` | Single coffee coupon displays 8,98€ before shipping; FR/75001 shipping scenario displays 15,73€. | Line-only amounts may be independent of excluded shipping under this context. | No action response; shipping-inclusive aggregate tax must not be used for article tax. |
| `atelier-rejeu-panier-mixte.png` and summary replay | Prior author reports fresh session with initially empty cart, no differences; screenshot agrees on displayed total. | Replay stability on that date. | No full replay response sequence retained; obtain a new independent discovery replay, do not manufacture prior decisions. |
| `atelier-cookie.png` | Coffee description, French labels and coffee categories visible. | Guest browsing compatible with screenshot. | Despite filename, this is not evidence of cookie/session settings or tax-entry basis. |

## Initial measurement plan and disposition

Preserve all original observations as supporting discovery. Zero are yet complete executable direct-target fixtures. Capture a compact sequence covering mixed eligibility, quantity/item/coupon recalculation, a measured invalid coupon refusal with unchanged article projection, and one fresh-session replay. Capture native action responses and all retained monetary fields. The required lab interaction is two percentage coupons, sequential discounts disabled, coffee eligible and accessory ineligible; include snapshots at both applications and LAB20 removal. Explore a single rounding discriminator rather than additional combination modes.

No source monetary field will be backfilled from arithmetic for direct-target provenance. Derived checks retain their formulas. A gift or unknown extension effect invalidates an in-domain claim until independence is established; do not remove an extra item to manufacture admissibility.

## Resumed measurements after tooling repair

Tooling repair checkpoint: `b33fce531e5de61fda298c2de273e1207408b1ba`; only two tooling scripts and their regression tests were committed. Preparation continued uncommitted. The four prior phase-B files were verified unchanged before that commit.

Direct sequence: `ai/traces/discovery/phase-b-target-sequence.json`, 12 actual responses, including 10 selected engine actions. Separate replay: `phase-b-target-replay.json`, initially empty with a different guest session and no prior cookies, 3 nominal actions. Every successful decision comes from an actual 2xx action response; error codes/messages come from actual 400 responses. A GET after the unknown-coupon refusal confirms an unchanged article projection. No checkpoint is fabricated for the earlier readonly-quantity refusal.

The merchant products search for `decouverte` returned HTTP 500 (also for the accented query); direct navigation to the public product form identified the variation. Accessory search succeeded. This is a discovery access limitation, not a pricing rule.

New finding: coffee is sold individually. The quantity-3 attempt returned `readonly_quantity`; quantity 1 was accepted. Accessory quantity 2 and removal succeeded. Coupon removal and reapplication succeeded. The single-mode lab experiment provides the selected rounding discriminator; no extra product or residual-allocation experiment was required.

### Direct amount audit, independent of adapter-generated expectations

All entries below were read directly from sanitized response fields. Integer strings map to the same integer cents; no totals are inferred. The three cases are covered by literal assertions in `tests/adapter.test.ts`.

| Capture / action | Coffee subtotal HT/tax → total HT/tax | Accessory subtotal HT/tax → total HT/tax | Coupon HT/tax | Cart items HT/tax; discounts HT/tax |
| --- | --- | --- | --- | --- |
| Target `add-coffee` | 946/52 → 946/52 | absent | absent | 946/52; 0/0 |
| Target `apply-decouverte10` | 946/52 → 851/47 | 125/25 → 125/25 | decouverte10 95/5 | 1071/77; 95/5 |
| Lab `apply-lab20` | 946/52 → 662/36 | 125/25 → 125/25 | decouverte10 95/5; lab20 190/10 | 1071/77; 284/16 |

Mapping: item `totals.line_*` to the identically named line fields; coupon `totals.total_discount*` to its coupon fields; cart `totals.total_items*` and `total_discount*` to retained totals. Item identities come from explicit native-ID/variation correspondence, not names guessed by the adapter. Coupon spelling is retained from responses. Currency must be EUR/2. `prices.raw_prices` establishes source precision but is not a projected output field. Shipping, fees, aggregate total tax, tax lines and grand total are excluded from comparison, while their original monetary fields remain in sanitized responses. No excluded mechanism affected retained item membership in these captures.

The two-coupon cart discount 284 differs from 95+190; discount tax 16 differs from 5+10. Both are directly observed. Summing displayed coupon components would be an incorrect projection. Removing LAB20 returns the nominal 95/5 discount and 851/47 coffee line. This establishes lab behaviour only.

Three complete projected checkpoints match between target sequence, fresh target replay and local mirror. This comparison uses the adapter whose three selected projections were checked against literal raw values above. Antoine subsequently examined P1 and confirmed its conformity, then accepted the operator audit for P2–P3 and the stated limits; see the review decision below.

### Informative failed lab attempts

`phase-b-lab-mirror.json`: the obsolete tax-class option did not create a native tax-rate class; the product fell back to the standard class. A cookie-free Cart-Token run also lost cart contents between calls and the nominal coupon was refused. These are setup/protocol failures, not evidence of merchant differences.

`phase-b-lab-mirror-corrected.json`: native `WC_Tax::create_tax_class` corrected the coffee rate, but a persisted GET still returned an empty cart after a successful add. A 250 ms wait did not fix it. The exact cause of this local Cart-Token behaviour remains unproven; it is not attributed to a timing race as a fact.

The retained successful protocol uses guest cookies plus the response Nonce, only in memory, and verifies a GET after every action. `phase-b-lab-mirror-cookie-session.json` and `phase-b-lab-interaction-measured.json` completed successfully. Earlier attempts are excluded from executable fixtures and retained because they explain the protocol adjustment. No Woo source was modified.

### Checkpoint disposition

Prepared: target and separate lab seeds; explicit source precision and constrained runtime/schema validation; four complete discovery fixtures; direct monetary audit; three equal mirror pairs; required non-sequential coupon experiment; initial source-backed rules and approach comparison. Engine remains a stub and business fidelity is unverified.

Action-only registration selected by Antoine is complete outside the repository; only hashes and registration date are published in fixtures/PROVENANCE.md. Projection review is accepted under the explicit operator decision below. Antoine authorized the single pre-implementation checkpoint commit; its input fingerprints are recorded below. Successful commit and tree verification establish that checkpoint. No reserved outcome has been accessed or collected, and no role has started. Do not label the whole phase complete merely because structural checks pass.

### Observed checks at this review point

`pnpm check:prep`: PASS, 44 targeted tests; 2 target, 2 lab, 0 derived, 1 synthetic fixture and 4 seeds. Typecheck, lint, architecture and fixture/seed integrity passed. Engine fidelity was not evaluated by this command.

Full `pnpm check`: FAIL as required, 71 tests passed and 4 discovery comparisons failed: `target-transitions`, `target-mixed-replay`, `lab-mirror-mixed`, `lab-two-percent-nonsequential`. These compare captured accepted actions and nonempty monetary projections with the untouched stub; no mismatch was skipped or reclassified as PASS. The existing synthetic official-evaluation tests use disposable inputs only; no reserved outcomes were read.

Gitleaks directory scan of all discovery evidence with redacted output: no findings. Diff whitespace check: clean for current preparation changes. Original supplied discovery JSON/PNGs, engine implementation, dependencies/lockfile and committed tooling repair remain unchanged. Index is empty. No phase-B commit or frozen-input checkpoint has been created. The current uncommitted input set must be reviewed before recording that checkpoint; `b33fce5` is only the tooling repair, not a prepared-reference freeze.

## Operator coverage review before freezing — 2026-09-18

**Corpus verdict: sufficient within the explicit V1 limits below, separate from checkpoint authorization.** The minimum behavioural cases in current `03_PREPARE.md` §§3–4 are present, including the required single-mode lab interaction and a discriminating rounding observation. No mandatory missing capture was identified against those sections. The subsequent targeted documentation correction aligns the active scope and distinguishes requested from returned quantities. Antoine accepted the projection review under the explicit decision below; clone fidelity is unverified. The earlier structural PASS is neither this coverage judgement nor human approval.

Authority: current `01_SHARED_RULES.md`, “Scope, effort, and sources of truth” and “Engine and comparison contract” (SR below); `03_PREPARE.md` §§3–4 and “Finish”, with §§1–2 for the fixed domain/candidate model (B below). `docs/scope.md`, `target/context.md`, `woo/kernel-model.md`, the public contract and seed schema were cross-checked. Requirements were not inferred from the number or names of existing fixtures.

### Evidence coordinates and coverage

All indices below are **zero-based**. `aN / Cn` means `actions[N]` and `checkpoints[n]`; each checkpoint's `after_action` is stated where the two indices differ. Raw coordinates address the sanitized JSON, not an adapter-generated file.

| Alias | Discovery fixture | Associated seed | Sanitized response file |
| --- | --- | --- | --- |
| T | `fixtures/discovery/target-transitions.json` | `target/seed.json` | `ai/traces/discovery/phase-b-target-sequence.json` |
| R | `fixtures/discovery/target-mixed-replay.json` | `target/seed.json` | `ai/traces/discovery/phase-b-target-replay.json` |
| M | `fixtures/discovery/lab-mirror-mixed.json` | `target/lab/mirror.json` | `ai/traces/discovery/phase-b-lab-mirror-cookie-session.json` |
| L | `fixtures/discovery/lab-two-percent-nonsequential.json` | `target/lab/two-percent-nonsequential.json` | `ai/traces/discovery/phase-b-lab-interaction-measured.json` |

| Requirement + source section | Fixture / action / checkpoint | Evidence basis | Established behaviour and unresolved points | Gap disposition |
| --- | --- | --- | --- | --- |
| Article prices, mixed taxes, nominal eligibility — SR contract; B §3 | T a0–a2 / C0–C2; raw `records[1..3]` | Merchant POST responses; EUR/2 line, coupon and cart fields | Coffee 946/52 before discount, 851/47 after; accessory 125/25 unchanged; nominal coupon 95/5. Mixed-basket exclusion of accessory is observed. Native category-vs-product restriction and entered-price basis remain unidentified. | Required nominal case covered. Those internal explanations remain explicit assumptions, not identified merchant facts. |
| Measured refusal with unchanged cart — B §3 | T a5 / C4 (`after_action=5`); refusal `records[6]`, follow-up GET `records[7]`; compare T a4 / C3 | Merchant HTTP 400, exact error code/message, then captured cart | Unknown coupon returns `woocommerce_rest_cart_coupon_error`; C4 equals C3 on every retained field. Message entities and nonbreaking spaces are preserved. This is not evidence of all coupon refusal mechanisms. | Required refusal/no-mutation case covered. Accessory-only eligibility refusal, expiry, usage limits and other unmeasured rejection mechanisms are not target observations. No such extra mandatory case is imposed by B §3. |
| Quantity acceptance/refusal — SR actions; B §§1,3 | T a3: raw `records[4]`, **no checkpoint**; T a4 / C3 (`after_action=4`); T a8 / C7 (`after_action=8`), raw `records[10]` | Merchant quantity metadata and actual POST responses | Coffee quantity 3 is refused with `readonly_quantity`; setting it to 1 succeeds and returns 1. Coffee pricing at 2 or 3 is not demonstrated. Accessory 1→2 is requested and actually returned, changing its line to 250/50, cart items to 1196/102; coupon stays 95/5. No immediate cart was captured after a3; a4 cannot retrospectively prove its unchanged state. | Successful quantity recalculation covered by accessory C7. The missing a3 snapshot is an explicit reference limit, not a fabricated checkpoint; generic refusal non-mutation remains a phase-C contract obligation. Requested-vs-returned quantities and the unchanged request domain are now explicit in `target/context.md`; no contract or fixture edit is required. |
| Item removal/recalculation — SR actions; B §3 | T a9 / C8 (`after_action=9`), raw `records[11]` | Merchant remove POST and resulting cart | Accessory disappears; retained items become 946/52, coffee stays 851/47 and coupon 95/5. | Required item-change case covered. Other histories and identities are not thereby observed; no exhaustive permutation claim. |
| Coupon removal and reapplication — SR actions; B §3 | T a6 / C5 (`after_action=6`), a7 / C6 (`after_action=7`); raw `records[8..9]` | Merchant POST responses and full retained projections | Removal clears coupons/discounts and restores coffee 946/52; reapplication restores 851/47 and 95/5. | Required coupon-change case covered; no claim for removing an absent coupon or duplicate application. |
| Fresh-session replay — B §3 | R a0–a2 / C0–C2; raw `records[0]` initially empty, action responses `records[2..4]`; compare T C0–C2 | Merchant replay plus operator trace of a distinct guest session | All three retained projections agree. Session credentials are intentionally absent from evidence; distinct-session provenance rests on the recorded operator procedure. | Required replay covered. It repeats nominal behaviour; it is not a new eligibility or rounding case, nor proof of clone reset isolation. |
| Versioned local mirror — B §4 | M a0–a2 / C0–C2; raw action `records[3,5,7]`, persisted GET `records[4,6,8]`; lab mirror settings trace | Lab observations and recorded setup options/native-ID mapping | Three projections equal T and R. Coffee target variation 8268 maps to lab simple product 10; accessory 14708 to 11. Inclusive source prices and product restriction are candidate lab settings. | Required mirror pairs covered. Agreement establishes compatibility only, not unique merchant settings or extra behavioural diversity. Failed lab attempts remain excluded from executable references. |
| Required two percentage coupons, sequential disabled — SR scope; B §4 | L a0–a4 / C0–C4; coupon steps a2/a3/a4, raw `records[7,9,11]`, persisted GET `records[8,10,12]` | Actual lab POSTs/GETs; dedicated seed; `ai/traces/preparation/lab-interaction-settings.json` records `woocommerce_calc_discounts_sequentially=no` | Both coupons affect the coffee while accessory stays 125/25. After LAB20: coffee 662/36; coupon components 95/5 and 190/10; aggregate discount 284/16. Removing LAB20 returns exactly C2. | Mandatory sequence and all three coupon checkpoints covered. The seed contains combinable coupons; setup code applies individual-use false and coffee eligibility. Settings trace reports the applied configuration, not a full native readback dump. No merchant stacking claim; no other combination mode. |
| Discriminating rounding case — SR money; B §3; kernel R5 | L a3 / C3, raw `records[9]`; compare L C2 and C4 | Lab amounts; derived comparison of explicitly named hypotheses below; native source pointers are separately recorded in the kernel model | Aggregate 284/16 rules out summing separately rounded coupon outputs 285/15. It does not identify every native intermediate, price-entry basis or tax-rounding setting. | Required discriminator covered. Multi-eligible-line residual allocation is not claimed in V1/kernel R5 and needs no additional experiment here. |
| Reset, copies, invalid/unsupported input, determinism, both CLI modes — SR contract; B §3 | Public `reset`/`dispatch`/`snapshot` contract, not a merchant checkpoint | Contract requirements; existing tooling tests are a different evidence class | Reference captures cannot establish clone state isolation, copying, safe-integer bounds, malformed-input refusal or truthful CLI failures. | Phase-C contract tests, not missing merchant measurements. No implementation was inspected or run in this review. |

The corpus has one merchant transition sequence, a repetition of its nominal prefix in a fresh session, the same nominal prefix in a lab mirror, and the required lab coupon-interaction extension. These are distinct evidence roles, not four independent behavioural explorations. Limits on observed histories do not remove in-domain action combinations from V1 or waive the implementation contract; they limit what can currently be claimed as measured merchant fidelity. The synthetic fixture and tooling checks contribute no merchant/lab fidelity coverage. Future reserved evaluation is separate; registration is already recorded publicly by hashes/date, and neither recipe contents nor potential outcomes were accessed or used in this review.

### What the rounding observation does and does not distinguish

- **H1 — round each coupon's HT/tax to observable cents, then sum those rounded components for cart discounts:** the observed coupon outputs imply HT `95+190=285`, tax `5+10=15`. Raw cart fields are **284/16**, so this hypothesis is contradicted for L a3.
- **H2 — preserve finer intermediate HT/tax amounts when aggregating, then round cart and per-coupon outputs separately:** compatible with **284/16** alongside **95/5** and **190/10**. The kernel's pinned-source rule explains a candidate mechanism; compatibility does not prove every implementation detail.
- **Derived illustration, not captured intermediate evidence:** with candidate gross discounts of 100 and 200 cents at the configured lab rate 5.5%, summing `round(100/1.055)` and `round(200/1.055)` gives 285 HT, whereas `round((100+200)/1.055)` gives 284; corresponding separately/finally rounded taxes give 15/16. These calculations explain the competing hypotheses only. No fixture expectation was reconstructed from them.

The single-eligible-line basket does **not** distinguish tax rounding per line from rounding at subtotal for multiple lines sharing a rate. It also does not distinguish product from category eligibility, or inclusive entered prices from a compatible exclusive-price model on the merchant. These remain the already-declared fixed candidate assumptions. There is no claim of residual allocation across multiple eligible lines, arbitrary source prices, or additional discount-combination modes. Observing precision 6 with values 9.980000 and 1.500000 does not test a price whose significant digits extend beyond cents; handling scale and numeric bounds belongs to phase-C contract checks for the declared model, not a claim of broad measured price coverage.

### Projection pairs and Antoine's review decision

Reuse the three literal-value rows in the earlier **Direct amount audit**; the exact pairs are:

| Pair | Raw response JSON location | Fixture JSON location | Direct audit focus |
| --- | --- | --- | --- |
| P1 — coffee before coupon | `ai/traces/discovery/phase-b-target-sequence.json` → `records[1].body` (`add-coffee`, HTTP 201) | `fixtures/discovery/target-transitions.json` → `checkpoints[0].expected`, `after_action=0` | Coffee 946/52 before and after; cart 946/52, discounts 0/0; no accessory/coupon. |
| P2 — mixed-rate nominal coupon | Same raw file → `records[3].body` (`apply-decouverte10`, HTTP 200) | Same fixture → `checkpoints[2].expected`, `after_action=2` | Coffee 946/52→851/47; accessory 125/25 unchanged; coupon 95/5; cart 1071/77 and 95/5. |
| P3 — two-coupon rounding discriminator | `ai/traces/discovery/phase-b-lab-interaction-measured.json` → `records[9].body` (`apply-lab20`, HTTP 200) | `fixtures/discovery/lab-two-percent-nonsequential.json` → `checkpoints[3].expected`, `after_action=3` | Coffee 946/52→662/36; accessory 125/25 unchanged; both coupon components **and** separate cart discount 284/16. |

**Operator decision — 2026-09-18:** Antoine examined P1 and confirmed its conformity. He then explicitly accepted Codex's deterministic raw/projection audit for P2–P3 and the stated limits, in place of personally repeating those two comparisons. This adjusts the independent review procedure in preparation brief §3; it does not claim that Antoine personally checked P2 or P3 amount by amount. P1 covers the undiscounted coffee; P2 covers mixed-rate eligibility and article totals; P3 retains both coupon components and the separately observed cart discounts despite their different rounding. Projection review is accepted on this basis. The accepted limits include coffee pricing observed only at quantity 1, candidate rather than uniquely identified merchant settings, and two-coupon behaviour established only in the lab. Clone correctness and the checkpoint selection are separate approvals.

For each pair, the field mapping is literal:

- `body.items[i].id`/captured variation map through the existing target/lab identities to `lines[i].ref` and optional `variant`; `quantity` maps to `qty`. Within these traces, aliased keys `item-1` and `item-2` identify coffee and accessory. Target coffee's captured variation labels are preserved in raw evidence; the lab's simple-product mapping to the same clone variant is explicit, not an observed local variation.
- `body.items[i].totals.line_subtotal`, `line_subtotal_tax`, `line_total`, `line_total_tax` map one-for-one to their line fields. Each `body.coupons[j].code` and `totals.total_discount`/`total_discount_tax` map to the corresponding coupon. Match identities, not incidental array order.
- `body.totals.total_items`, `total_items_tax`, `total_discount`, `total_discount_tax` map one-for-one to retained totals. In P2, `total_items` is the raw **1071**, not a reconstructed sum of discounted line totals. P3 aggregate discounts must not be reconstructed from displayed coupon components.
- Monetary strings in these fields are **integer EUR cents**, with explicit `currency_code=EUR` and `currency_minor_unit=2`. `items[i].prices.raw_prices.price` uses precision **6**, a separate input-price representation; never reinterpret it as cents or replace projected amounts with it. Currency symbols/separators are presentation metadata.
- Shipping, fee amounts, `total_tax`, `tax_lines` and `total_price` are outside the projection. Accepted raw baskets contain only the two declared identities (or the explicitly removed subset) and empty `fees`; no gift is present. This supports the selected low-value domain, not a general proof that merchant extensions are inactive. Location fields were redacted from request/response address objects; FR/Paris/75001 is retained as operator context metadata, not independently recoverable from those removed fields. `prices_include_tax=true` in fixture context is a candidate seed assumption, not a merchant API observation.

Operator-side static review in this pass independently compared retained raw fields to **all 20 stored checkpoints and four final projections**, using direct field conversion/native-ID mapping without importing the adapter or engine. Ordered request payloads and all 21 action decisions were cross-checked; captured refusal codes/messages agree verbatim, and successful decisions correspond to actual 2xx responses. Source SHA-256 associations and fixture/seed contexts match. Lab persisted GET projections, the three nominal replay/mirror pairs, the unknown-coupon unchanged state and LAB20 restoration agree. No discrepancy was found. This does not turn the missing T a3 checkpoint into evidence; Antoine's acceptance is recorded separately above. Existing adapter tests were inspected as supporting assertions; neither tests nor the clone were executed here.

### Freeze disposition and remaining decisions

| Item | Classification | Required disposition / smallest next step |
| --- | --- | --- |
| Mandatory discovery cases from B §§3–4 | Evidence needed before freeze — present | No additional capture is required by the reviewed minimum. No mandatory case has been silently reclassified as a limitation. |
| Stale active declaration | Declaration correction completed in the authorized follow-up | `docs/scope.md` now records the configured candidate, separate lab seeds, two target/two lab fixtures and the subsequent checkpoint authorization; clone fidelity remains unverified. The stale unconfigured/zero-scenario status was removed without reducing V1 commitments. No measurement was needed. |
| Attempted quantity versus accepted quantity | Coverage and domain clarification completed in the authorized follow-up | `target/context.md` now explicitly separates requested `Action.qty`, action decisions and returned `LineProjection.qty`. Coffee requests 1–3 remain in the measurement domain; seed `max_quantity=1`/sold-individually constrain accepted state, not request membership. Coffee pricing is established only at 1; accessory C7 establishes successful recalculation at 2. There is no immediate state proof after the coffee-3 refusal. Public types and stored fixtures already preserve the distinction, so no contract, seed, fixture or original-response change is necessary. No unmeasured outcome is inferred. |
| Fixed candidate settings and reference limits | Explicit limitations compatible with V1 | Keep internal merchant configuration unidentified; keep non-sequential stacking lab-only, source prices/catalogue fixed to this slice, and per-line tax rounding a declared assumption where the observation cannot distinguish alternatives. Missing immediate T a3 state and unmeasured eligibility/error histories remain unclaimed, not substituted by replays or reserved evaluation. If a broader target-fidelity claim is required, it needs a separate evidence decision. |
| Clone safety and contract properties | Phase-C contract tests | Verify copying/reset isolation, deterministic transitions, invalid/unsupported input non-mutation, numeric boundaries and both CLI outputs under the frozen contract. Green tooling alone is not their business verification. |
| Monetary review | Accepted under the explicit operator decision above | Antoine personally examined P1 and confirmed conformity; P2–P3 are accepted on Codex's audit, with the stated limits. Do not represent this as three personally rechecked pairs. |
| Checkpoint approval | Subsequently authorized explicitly by Antoine | After accepting the review, Antoine requested the checkpoint and commit. Prepare one local phase-B commit with the documented reference-checkpoint exception in `docs/session-handoff.md`; verify its tree and stop before role activation. This authorization is separate from his monetary review decision. |

Antoine also confirmed the coffee-quantity clarification as clear and verified after reviewing the explanation of the request from 1 to 3, its captured refusal and the missing immediate cart snapshot. This closes the human clarification of that quantity case.

No new measurement was executed or recommended merely to reach a fixture count or coverage percentage. Prior review results above remain historical observations. The reference corpus is sufficient on the explicit V1 basis; Antoine subsequently authorized the pre-implementation checkpoint. Checkpoint checks were rerun: preparation PASS (44 tests); full check FAIL (71 passed, the same four stub discovery comparisons failed). The successful checkpoint commit pins preparation inputs for later roles; clone fidelity remains **unverified**. This is not the final-delivery freeze.

### Pre-implementation input fingerprints

The phase-B commit containing this table pins the following Git blob/tree object IDs. Directory trees include every tracked descendant, path and file mode. Reproduce any value with `git rev-parse <phase-B-commit>:<path>`. Fixture/seed byte-level SHA-256 hashes remain in `fixtures/MANIFEST.sha256`; recipe contents remain external. These are preparation input fingerprints, not a final-delivery freeze or a claim of OS-enforced protection. Public contract, seeds/schema, references, adapter, harness and executable controls remain frozen during roles under the existing role rules. Engine and implementation tests may evolve only within those rules. The complete commit additionally records the starting tests and rule model.

| Input path | Git object ID |
| --- | --- |
| `src/engine/contract.ts` | `170c2e26b2ef5d8820462ac75a6da9139c2b7b5f` |
| `target` | `f245dde0318559fbdf15e63c464a99acedfd620b` |
| `fixtures/discovery` | `43f6e802cd10b5cdc3c2814e7e491bbc295c9423` |
| `fixtures/MANIFEST.sha256` | `55f47a4f0da31c946b13cabd77baccbda74432fe` |
| `fixtures/PROVENANCE.md` | `c1b7851e4542d236bb307d5ff7961dac6fa63280` |
| `ai/traces/discovery` | `f44372abca9b12efc8138fe1462146fa8c0450a3` |
| `ai/traces/preparation/lab-mirror-settings.json` | `bffe845b75ebf41842129af5df1ef228c73217a2` |
| `ai/traces/preparation/lab-interaction-settings.json` | `e0816a904ee50946ec0751d6afd9dd70be08eefa` |
| `woo/project-store-api.ts` | `b761f55c38b0b8b9f48d269dc9a87c9fdba5680b` |
| `harness` | `08bddfb61c9167130be8e08190f56a10c3906162` |
| `research` | `f585ae7247c97651be25726dadd6d874a18ef959` |
| `scripts` | `5a4044324cece7dadef74cf948870a9f66e181f7` |
| `ai/roles` | `5563559af3eae954a79cf9762ad5fd76f036e8db` |
| `AGENTS.md` | `ca785c14adcfc599e1f81683a9f6b7707d71303b` |
| `ai/constitution.md` | `62405d0038c90ed0dd4860e76a49291c532cbed4` |
| `docs/scope.md` | `2fec6574ef1a24edccc00459eda0fc13432cb971` |
| `docs/delivery.md` | `aac7453e371dc93d46e8353cbc5f1508f2ca35e4` |
| `.codex/hooks.json` | `deffac973448cdf6f444085b535b8f69f7e84ad6` |
| `package.json` | `baef54b5fd7d193813c0bcb50eee7ac6f4913e61` |
| `pnpm-lock.yaml` | `824af2395d0cf2976a0829612a7b790099f08d3d` |
| `tsconfig.json` | `e28bcd36ebef7ca4ba9063884a0ef9e8abdaf677` |
| `biome.json` | `8b80e4d06bce8f7d341aad5390a720353307296b` |
| `.dependency-cruiser.cjs` | `d7e78d49494f7b382c04e215de0ed5e77d6e0b46` |
| `vitest.config.ts` | `30fc02337fc8ab5c78d6f9173c5cecc1f7a4a2d8` |
| `.node-version` | `5b540673a82888c11694866137e18f3865890bde` |
| `.npmrc` | `145d3fa25b8c8cdd495ab40849109408792fee0d` |
| `.gitignore` | `66b16507ef412fb55127f94e40b96c78d0365f4f` |
| `use-role.sh` | `13b61747b5f061171e8e1732108ed77d28afd16d` |
| `deliver.sh` | `4679c05436a317c70f7357e2fdee422b4873e27b` |
