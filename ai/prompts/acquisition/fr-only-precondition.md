# Operator acquisition clarification — 2026-09-20

Executed instruction, preserved verbatim. This supersedes the Paris/75001 acquisition precondition only; frozen recipes and executable inputs remain unchanged.

> My decision: Paris / 75001 persistence is not required for held-out
> acquisition. Country=FR remains required by frozen V1.
>
> Resume acquisition using the already validated Woo reset procedure.
>
> Before each preregistered recipe, require only:
> - normal Cloudflare access;
> - HTTP 200 and valid guest cart JSON;
> - country=FR;
> - currency=EUR with minor unit 2;
> - zero cart lines;
> - zero coupons;
> - recipe SHA-256 matching its preregistered commitment.
>
> Do not initialize or require city/postcode.
>
> This is an acquisition-protocol clarification based solely on frozen
> pre-held-out evidence. It does not change the recipe, clone, seed,
> expected outcomes or frozen inputs.
>
> Proceed with the three held-out acquisitions one at a time under the
> previously established capture/sanitation/stop rules.
> Stop before import-plan creation or official evaluation.
