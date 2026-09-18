# Target configuration

`seed.json` is deliberately unconfigured. It contains no merchant products, coupon parameters or inferred tax settings.
`_synthetic.seed.json` is tooling data only and must never be cited as target or lab evidence.

The setup seed format supports product identities, integer input amounts, tax-class labels, percentage coupon parameters and explicit scalar settings. These are input slots, not validated merchant rules. The stub does not interpret pricing settings.

Before role sessions, Antoine must establish the pinned customer context, supported configuration keys and seed from evidence. Any contract extension requires operator review before freezing; unsupported settings must be explicitly rejected by the later engine.
Fixture context must exactly match its configured seed context. A lab fixture must explicitly select its separate `target/` seed.

Fixture and schema paths are repository-relative; resolved seeds cannot escape `target/`, including through symlinks. Checkpoint and decision indices are zero-based.

## Phase-A alignment caveat

The current `Product.unit_price: MinorUnits`, seed schema and runtime validator force source prices to integer cents. This is not evidence that the merchant/lab has that precision. Phase B must resolve the representation explicitly before the checkpoint, without silently rounding source data or introducing bigint/decimal dependencies. Document bounds, input precision and calculation/rounding rules from evidence.

`target/lab/` is reserved for a separate evidence-backed lab seed: two percentage coupons, sequential discounts disabled, no additional combination mode. No actual lab values or business settings are populated in phase A.
