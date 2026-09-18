# Local WooCommerce laboratory

This operator-only reference is separate from the in-memory clone and reader `pnpm check`. Run commands from `repo/`. Actual phase-B versions: WordPress 6.8.2, WooCommerce 10.1.2, PHP 8.2.29 and MariaDB image 11.4.8. The web binds only to `127.0.0.1:8088`; the database has no host port. Do not change unrelated Docker containers.

Create ignored `research/.env` from `.env.example`, replacing both database passwords with fresh local secrets, then:

```sh
docker compose --env-file research/.env -f research/compose.yml up -d
```

Install the official plugin archive inside the web container, using `curl` and the image's native PHP `ZipArchive`. The exact URL is `https://downloads.wordpress.org/plugin/woocommerce.10.1.2.zip`; the archive actually executed had SHA-256 `9b8737d3c0bf2e4f31081785a51728eef58dd2c34a874aa5e2075a31361142ad`. Check that digest before extracting to `/var/www/html/wp-content/plugins/`; a different digest requires operator investigation. No WordPress/plugin auto-upgrade is part of this procedure.

Initialize only a new local site or the existing marked lab:

```sh
docker compose --env-file research/.env -f research/compose.yml exec -T web php /dev/stdin < research/seed/bootstrap.php
sh research/seed/seed.sh mirror
sh research/probe.sh mirror new-attempt-label
sh research/seed/seed.sh interaction
sh research/probe.sh interaction new-attempt-label
```

The initializer suppresses installation mail, generates a local administrator password without printing it, and refuses an unrecognized existing site. Seed configuration is idempotent by product SKU/coupon code, and creates the native tax class through `WC_Tax::create_tax_class`. Do not configure or replay after a final freeze. Review the returned native IDs before probing: the retained lab uses coffee 10 and accessory 11; the bounded capture script deliberately names those IDs. A differently populated lab needs an explicit mapping review, not an unnoticed ID substitution.

The mirror is created before LAB20 exists. `interaction` adds the second combinable percentage coupon for coffee only. Sequential discounts remain disabled throughout; no other combination mode is implemented. To reproduce a pristine mirror after interaction, use a separately reviewed clean lab rather than assuming that rerunning `mirror` deletes LAB20.

The probe uses real Store API POSTs and a guest cookie/Nonce session retained only in memory. A GET after each successful action checks persisted cart contents before continuing. It writes sanitized records to a new attempt-labelled file and refuses to replace existing evidence. Cookie/header values are never written; address/shipping-rate payloads are omitted, item keys aliased, monetary strings unchanged. Actual action errors remain recorded and fail the capture. This script is restricted to the local reference; target measurements were performed separately through the browser tools.

Accepted captures: `phase-b-lab-mirror-cookie-session.json` and `phase-b-lab-interaction-measured.json` under `ai/traces/discovery/`. Two earlier failed attempts are retained and excluded from executable fixtures; see the preparation inventory. No general promise is made about the unresolved local Cart-Token path.

Local environment files, raw probes and SQL dumps stay unversioned. Preserve the named volumes when stopping the lab:

```sh
docker compose --env-file research/.env -f research/compose.yml stop
```

The public API reference is [WooCommerce Store API cart documentation](https://developer.woocommerce.com/docs/apis/store-api/resources-endpoints/cart/); algorithm claims refer to the pinned plugin archive and the kernel model, not to current documentation as evidence of the merchant version.
