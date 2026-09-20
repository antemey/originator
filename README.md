# WooCommerce Discount Engine Replication

Deterministic in-memory TypeScript replication of a bounded pricing slice from **L’Atelier des Cafés**.

The clone covers supported cart transitions, coupon decisions, item discounts, taxes and rounding for a guest customer in France. Shipping, fees, checkout and most of the catalogue are outside scope.

For the best reading experience, start with [`WRITEUP.pdf`](docs/WRITEUP.pdf). The same write-up is also available as [`WRITEUP.md`](WRITEUP.md), which is the source used by the repository's delivery checks.

## Quick start

Prerequisites:

- Node.js 22.16.0 (pinned in `.node-version`)
- Corepack
- Git
- a POSIX-compatible shell environment

```bash
corepack pnpm@10.11.0 install --frozen-lockfile
corepack pnpm@10.11.0 check
```

`check` runs type checking, linting, architecture checks, fixture/seed integrity and the full test suite.

Apart from installing the public npm dependencies, the normal review path does **not** require Docker, the live merchant, browser automation, or private environment configuration.

Run one merchant scenario:

```bash
corepack pnpm@10.11.0 -s scenario fixtures/discovery/target-mixed-replay.json
```

Demonstrate deterministic reset/replay:

```bash
corepack pnpm@10.11.0 -s scenario --reset-demo fixtures/discovery/target-transitions.json
```

## Reviewer path

If you only have a few minutes:

1. Read [`WRITEUP.pdf`](docs/WRITEUP.pdf) — or [`WRITEUP.md`](WRITEUP.md).
2. Run `corepack pnpm@10.11.0 check`.
3. Read [`VERDICTS.md`](VERDICTS.md).
4. Run one scenario above.

The official held-out evaluation is complete: **3 preregistered merchant scenarios passed with no differences**. `VERDICTS.md` is the original one-time verdict; normal checks do not rerun it.

## Engine

```ts
reset(seed: Seed): void
dispatch(action: Action): Result
snapshot(): CartProjection
```

State is kept in memory only. Refused actions do not mutate the cart. The engine does not read fixtures or expected results.

## Repository map

| Path | Purpose |
|---|---|
| `src/` | cart and pricing engine |
| `target/` | bounded merchant profile and seeds |
| `fixtures/` | discovery and post-freeze held-out references |
| `VERDICTS.md` | official held-out result |
| `ai/` | prompts, roles and selected traces |
| `research/` | local WooCommerce reference lab |
| `docs/` | rendered write-up, scope, delivery and historical notes |

For provenance, see [`fixtures/PROVENANCE.md`](fixtures/PROVENANCE.md).

## Scope limits

Demonstrated scope: guest, FR, EUR, prepared products/coupon configuration and item-level pricing.

Shipping, fees, checkout, most of the catalogue and successful coffee pricing above quantity 1 are not claimed. Captured refusals of larger coffee quantity requests are included. Multiple-coupon behaviour was measured only in the local Woo lab.

Some historical preparation files describe earlier project states; current claims are those in `docs/WRITEUP.pdf` / `WRITEUP.md`, `VERDICTS.md` and the published fixtures.

For an agent reviewing the repository, start with [`AGENTS.md`](AGENTS.md).
