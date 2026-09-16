# Fixture provenance

Expectations are captured, or explicitly derived; never calculated from the clone. Reserved cases enter only at the end so they cannot guide construction.

| id | provenance | timestamp | session recipe and actions | action channel and read endpoint | sanitized JSON SHA-256 | actual independent replay | held-out entry date |
| --- | --- | --- | --- | --- | --- | --- | --- |
| _example | synthetic | 2026-09-16T00:00:00Z | Reset synthetic seed; attempt one add; expect documented stub refusal | tooling only; no endpoint | See MANIFEST.sha256 | Contract tooling only; no merchant replay | Not held-out |

Initial operator setup seal includes `_example.json`, the unconfigured target seed and the synthetic seed. Synthetic files are hashed but excluded from discovery fidelity execution.
All subsequent fixture/seed changes require an operator provenance entry and an explicit reseal. Checksums detect drift, additions and removals; a manifest editable by the same person is not tamper-proof.
