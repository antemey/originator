# Local WooCommerce laboratory

This optional reference is separate from the in-memory clone and `pnpm check`.
No container, WooCommerce installation, seed or probe has run during setup.

`compose.yml` prepares WordPress and a private database; it does not install WooCommerce by itself. `.env.example` records proposed explicit image/plugin versions, not observed target versions. Validate availability before the later first launch and record the versions actually executed.

Configuration-only check, with no container launch:

```sh
docker compose --env-file research/.env.example -f research/compose.yml config --quiet
```

The web port binds only to `127.0.0.1`; the database has no host port.
The database belongs to the reference lab only, never to the clone runtime.
The seed and probe entry points currently fail explicitly. Implement them in the later operator-controlled reference phase, including two combinable percentage coupons in a lab-only seed. Do not change the merchant catalogue to fit that experiment.

Local `.env`, raw probes and SQL dumps are ignored. Only individually reviewed sanitized JSON probes are force-added by the operator delivery procedure at the end. Never expose reserved captures to either role.
