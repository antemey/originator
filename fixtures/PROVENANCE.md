# Fixture provenance

Expectations are captured, or explicitly derived; never calculated from the clone. Reserved cases enter only at the end so they cannot guide construction.

| id | provenance | timestamp | session recipe and actions | action channel and read endpoint | sanitized JSON SHA-256 | actual independent replay | held-out entry date |
| --- | --- | --- | --- | --- | --- | --- | --- |
| _example | synthetic | 2026-09-16T00:00:00Z | Reset synthetic seed; attempt one add; expect documented stub refusal | tooling only; no endpoint | See MANIFEST.sha256 | Contract tooling only; no merchant replay | Not held-out |

Initial operator setup seal includes `_example.json`, the unconfigured target seed and the synthetic seed. Synthetic files are hashed but excluded from discovery fidelity execution.
All subsequent fixture/seed changes require an operator provenance entry and an explicit reseal. Checksums detect drift, additions and removals; a manifest editable by the same person is not tamper-proof.

## Phase B discovery — 2026-09-18

| target-transitions | target | 2026-09-18T11:53:32.238Z | 10 recorded actions; see fixture and `phase-b-target-sequence.json` | Store API POST responses; GET after refusal; guest Cart-Token retained only in memory | `f047838e8c7588fb03c0207387535fc6c26805ea31fe47a6b39e0e189adcceee` | Separate initially empty merchant session agrees on all three nominal projections | Not held-out |
| target-mixed-replay | target | 2026-09-18T11:59:48.803Z | 3 recorded actions; see fixture and `phase-b-target-replay.json` | Store API POST responses; GET after refusal; guest Cart-Token retained only in memory | `c11407872d1e71b0eb7a72bc903b9fdeaba35f3e3f4232097551a5a45bc8323c` | Separate initially empty merchant session agrees on all three nominal projections | Not held-out |
| lab-mirror-mixed | lab | 2026-09-18T12:04:15.812Z | 3 recorded actions; see fixture and `phase-b-lab-mirror-cookie-session.json` | Store API POST responses with guest cookie/Nonce session; persisted GET checked after each action | `0cafd21ef6006ac98bc4943342400bc6974ad9ee0a81a48c562458259878f2ab` | Three mirror checkpoints agree with target; interaction measurements remain lab-only | Not held-out |
| lab-two-percent-nonsequential | lab | 2026-09-18T12:04:43.239Z | 5 recorded actions; see fixture and `phase-b-lab-interaction-measured.json` | Store API POST responses with guest cookie/Nonce session; persisted GET checked after each action | `7049a2919f757c6735d726a97a3cea64d2591e84fee71f4678ea9e88bbecc8a5` | Three mirror checkpoints agree with target; interaction measurements remain lab-only | Not held-out |

Raw sanitized responses are under `ai/traces/discovery/`. Original supplied JSON/PNGs are unchanged. Two incomplete lab attempts are preserved there as failed preparation experiments, excluded from executable fidelity fixtures. The first used an unregistered tax class and lost session continuity; the second corrected tax but still lost Cart-Token continuity. The accepted runs use a cookie/Nonce session and check persisted GET responses after each action. No secret header values are retained.

Unseen action-only recipes selected by Antoine are registered outside the repository. Only their byte-level SHA-256 hashes and registration date are published here; no reserved outcomes were accessed or captured. This registration is not a completed implementation or delivery freeze.

| Registration date (UTC) | Recipe SHA-256 |
| --- | --- |
| 2026-09-18T12:16:51Z | `3c5d67520299f185229f5e160d9925c972ebf7e0fb09bdc483bd76f96e972296` |
| 2026-09-18T12:16:51Z | `3ffdc5e12db2a4fbe8316188762d5e6c50b7bff6192f174aa7641fd9fd91183b` |
| 2026-09-18T12:16:51Z | `584fa1154703f0bda72d99598def0869ecc95e55a6e8dcef3c282fb74e462d2f` |

<!-- delivery-freeze 73ed2aae95def394edf861b0fdce4e10000b8f0b -->

| id | provenance | timestamp | session recipe and actions | action channel and read endpoint | sanitized JSON SHA-256 | actual independent replay | held-out entry date |
| --- | --- | --- | --- | --- | --- | --- | --- |
| evaluation-01 | target | 2026-09-20T12:33:26.921Z | Original headed guest Chrome session; selective Woo business cookies/cart caches reset before this recipe, access-layer state preserved. HTTP 200 empty guest cart preflight: FR, EUR/2, zero lines and coupons. City/postcode neither initialized nor required under the operator clarification. Executed exactly the ordered actions in the referenced preregistered recipe, with a cart GET after every action. | Store API POST requests from the existing storefront page context with browser cookies and standard Woo Nonce; original action responses and subsequent cart GETs captured and sanitized.; https://www.latelierdescafes.com/wp-json/wc/store/v1/cart | ff81f01f6d037e3e3f2e4927fedd95a05e9a2b43cfc77d3c8c2773a3416fa928 | No independent held-out replay performed. The earlier target-mixed-replay discovery control is separate comparability evidence, not held-out coverage. | 2026-09-20T13:26:24.603Z |
| evaluation-02 | target | 2026-09-20T12:34:02.173Z | Original headed guest Chrome session; selective Woo business cookies/cart caches reset before this recipe, access-layer state preserved. HTTP 200 empty guest cart preflight: FR, EUR/2, zero lines and coupons. City/postcode neither initialized nor required under the operator clarification. Executed exactly the ordered actions in the referenced preregistered recipe, with a cart GET after every action. | Store API POST requests from the existing storefront page context with browser cookies and standard Woo Nonce; original action responses and subsequent cart GETs captured and sanitized.; https://www.latelierdescafes.com/wp-json/wc/store/v1/cart | c790deb527bd3831f2607d5209d3da4c379b44cec41907fa6b71009e3c60339e | No independent held-out replay performed. The earlier target-mixed-replay discovery control is separate comparability evidence, not held-out coverage. | 2026-09-20T13:26:24.603Z |
| evaluation-03 | target | 2026-09-20T12:34:32.340Z | Original headed guest Chrome session; selective Woo business cookies/cart caches reset before this recipe, access-layer state preserved. HTTP 200 empty guest cart preflight: FR, EUR/2, zero lines and coupons. City/postcode neither initialized nor required under the operator clarification. Executed exactly the ordered actions in the referenced preregistered recipe, with a cart GET after every action. | Store API POST requests from the existing storefront page context with browser cookies and standard Woo Nonce; original action responses and subsequent cart GETs captured and sanitized.; https://www.latelierdescafes.com/wp-json/wc/store/v1/cart | 1914a9c945b0f1a36b1e2f970167cb882c72d68ef63355950f18e21e38675e9e | No independent held-out replay performed. The earlier target-mixed-replay discovery control is separate comparability evidence, not held-out coverage. | 2026-09-20T13:26:24.603Z |
