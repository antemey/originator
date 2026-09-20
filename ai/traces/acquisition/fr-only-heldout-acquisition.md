# Held-out acquisition completed — 2026-09-20

Executed authorization: [FR-only precondition clarification](../../prompts/acquisition/fr-only-precondition.md). Frozen commit remains `73ed2aae95def394edf861b0fdce4e10000b8f0b`. The acquisition clarification changes no recipe, seed, clone, expected outcome or frozen input.

All three recipes were acquired sequentially in the original accessible headed Chrome session. Before each, the validated selective Woo reset preserved access/unrelated state and a separate GET confirmed HTTP 200, valid guest cart, country FR, EUR/2, zero lines and zero coupons. City/postcode were neither initialized nor required. No control was replayed between recipes.

| Recipe | UTC interval | Action responses | Checkpoints | Status |
| --- | --- | --- | --- | --- |
| evaluation-01 | 12:33:19.389–12:33:40.266 | 3/3 | 3/3 | Complete candidate |
| evaluation-02 | 12:33:59.769–12:34:20.385 | 4/4 | 4/4 | Complete candidate |
| evaluation-03 | 12:34:30.039–12:34:49.594 | 4/4 | 4/4 | Complete candidate; one merchant HTTP 400 refusal preserved |

Recipe SHA-256 commitments matched before each capture and in the final audit. Native request payloads/order, response associations and candidate projections were verified against the registered actions and actual captured sources only. Successful action responses agree with their following GETs on retained fields. No clone/discovery comparison or business interpretation was performed. No missing checkpoint or technical blocker occurred.

Exact review selection: `.delivery/heldout-fr-acquisition-20260920/review/` (48 files), with `REVIEW-MANIFEST.sha256` in its parent directory. Its README and acquisition audit identify the candidate fixtures, source bundles, separate setup/reset records and all response provenance. Twenty-five original decoded source bodies remain private (0700 directories / 0600 files), with matching hashes. Earlier unsuccessful attempts are preserved separately.

Gitleaks scanned the exact selection and exited 1 with 50 generic-api-key alerts: 14 / 18 / 18 by recipe. Every alert was reviewed as a SHA-256 token fingerprint, not an authentication value. Retained redacted findings and `final-scan-review.json` document all classifications; scanner rules were unchanged. Known captured credential values were also checked in memory against candidate files during acquisition. The previous control's 16 reviewed digest alerts remain a separate historical result. Do not label this a generic Gitleaks PASS.

All 85 frozen fingerprints remain intact. Delivery state remains frozen, no role active and index empty. No import plan, import, official evaluation, verdict, commit or push. The browser remains open with the final recipe's cart. Next: operator review of the exact sanitized evidence selection; no automatic continuation.
