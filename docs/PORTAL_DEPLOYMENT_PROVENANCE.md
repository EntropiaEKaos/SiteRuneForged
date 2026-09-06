# Portal Deployment Provenance 1.0

## Purpose

SiteRuneForged already verifies the exact deployed RuneForgedTCG build. This contract adds the missing half of the chain: the portal can now publicly prove the exact Git commit it is serving.

The goal is end-to-end release traceability:

- **portal SHA** — exact SiteRuneForged deployment;
- **game SHA** — exact RuneForgedTCG deployment.

Neither value is inferred from UI copy or duplicated content.

## Runtime configuration

A deploy configures two server-side variables:

```env
RUNEFORGE_PORTAL_DEPLOY_SHA=<exact 40-character SiteRuneForged Git SHA>
RUNEFORGE_PORTAL_DEPLOY_ENV=<ci|preview|alpha|staging|production>
```

Do not use `NEXT_PUBLIC_`.

## Public endpoint

`GET /api/public/portal/deployment/provenance`

Success:

```json
{
  "ok": true,
  "portal": {
    "schemaVersion": 1,
    "application": "SiteRuneForged",
    "release": "0.1.0",
    "commitSha": "<40-char sha>",
    "commitShort": "<12-char sha>",
    "environment": "alpha"
  }
}
```

The endpoint is dynamic and always returns `Cache-Control: no-store`.

If the SHA or environment is absent/invalid, it fails closed with HTTP 503 and `Retry-After: 5`.

The endpoint exposes no API origins, cookies, admin configuration, database values, secrets, tokens or payment settings.

## Release preflight

`npm run release:preflight` validates the two variables.

When `GITHUB_SHA` is present, the configured portal SHA must equal it exactly.

`npm run production:build` runs the preflight and then the Next.js production build.

Official deployment builds should use `npm run production:build`.

## Certification

Web CI injects its exact GitHub SHA with environment `ci`.

Full Stack Integration injects the exact checked-out portal SHA with environment `alpha` and verifies both the portal and game provenance endpoints.

Production Alpha Smoke requires the expected portal SHA and expected game SHA independently and refuses to certify if either deployed runtime differs.

This contract does not enable Ranked, payments or Live Ops.
