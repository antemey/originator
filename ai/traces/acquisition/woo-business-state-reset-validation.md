# Selective Woo business-state reset — VALIDATED within the observed control

Operator mission: [executed instruction](../../prompts/acquisition/woo-business-state-reset-validation.md). Frozen commit: `73ed2aae95def394edf861b0fdce4e10000b8f0b`. This is acquisition-method validation, not an official held-out verdict.

The original headed Chrome session on port 9223 remained accessible. A prerequisite GET returned HTTP 200 and a valid cart, with the same Woo customer fingerprint as the previous successful control. No new profile, browser configuration or transferred access credential was used.

The actual reset/control interval was `2026-09-20T11:43:24.519Z`–`2026-09-20T11:43:44.185Z`. Only these business-state elements were removed:

- The merchant's native `wp_woocommerce_session_*` guest-session cookie.
- `woocommerce_cart_hash` and `woocommerce_items_in_cart`.
- The exact merchant-configured `wc_cart_hash_*` key, including its `-fr` suffix, in local and session storage; and the configured `wc_fragments_*` key in session storage.

Exact cache names came from `wc_cart_fragments_params`, correcting the initial inspection's overly narrow classification of the localized key. Cloudflare/access cookies and all unrelated cookies/storage were checked unchanged immediately after removal. Secret values were kept in memory only; evidence retains names/types and SHA-256 fingerprints.

After normal storefront reload, the single empty-cart preflight returned HTTP 200, valid EUR/2 cart JSON, zero lines, zero items and zero coupons. No WordPress authentication cookie or identifying address data was present. The Woo customer fingerprint changed from `167eff73ebd06093223137dc55b550d40fd16290b35c589aba8402f9b1550475` to `385ecdbc9edd9d91519868b52b218f265d735c424b1a38e1c2dc0eb5a447723b`. Identity change is supporting evidence, not the sole success criterion.

After original FR/Paris 75001 guest context setup, all three `target-mixed-replay` actions were executed in order. Decisions, three captured checkpoints and the final retained projection had **zero differences** from the unchanged discovery reference. Actual follow-up cart GETs agreed with each action response. No clone execution or held-out outcome comparison was performed.

Exact local evidence is under `.delivery/woo-session-reset-validation-20260920/`: before-state inspection; reset selection; immediate preservation check; eight sanitized source responses with decoded-source hashes; observed control fixture; comparison; validation report; checked SHA-256 manifest; and redacted scanner findings/review. These are local operator artifacts, not an import plan. Gitleaks reported 16 generic-api-key alerts on generated `cart_token_sha256` digest metadata (eight records and their bundle copies), reviewed as digest-only false positives. The capture-time check against known in-memory authentication values found no direct occurrences. Scanner rules and captured evidence were not altered to suppress findings.

All 85 frozen fingerprints and previous failed attempts remain intact. No held-out recipe, import, evaluation, commit or push occurred. The result validates this observed procedure and known control only; it does not guarantee future access or every isolation property. Each later recipe still needs its own observed empty guest-cart preflight. The current cart contains the completed control and must be reset before separately authorized acquisition.
