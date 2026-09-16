# Target configuration

`seed.json` is deliberately unconfigured. It contains no merchant products, coupon parameters or inferred tax settings.
`_synthetic.seed.json` is tooling data only and must never be cited as target or lab evidence.

The setup seed format supports product identities, integer input amounts, tax-class labels, percentage coupon parameters and explicit scalar settings. These are input slots, not validated merchant rules. The stub does not interpret pricing settings.

Before role sessions, Antoine must establish the pinned customer context, supported configuration keys and seed from evidence. Any contract extension requires operator review before freezing; unsupported settings must be explicitly rejected by the later engine.
Fixture context must exactly match its configured seed context. A lab fixture must explicitly select its separate `target/` seed.

Fixture and schema paths are repository-relative; resolved seeds cannot escape `target/`, including through symlinks. Checkpoint and decision indices are zero-based.
