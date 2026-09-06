# Production Alpha Smoke 1.0

## Purpose

The repository's normal Web CI proves the portal in isolation, and Full Stack Integration proves SiteRuneForged against an exact RuneForgedTCG SHA inside an ephemeral CI environment.

Production Alpha Smoke 1.0 closes a different boundary: it verifies the **already deployed public HTTPS origins** without assuming Vercel, AWS, Render, Railway, Fly.io, Kubernetes or any other provider.

## Manual workflow

Run the GitHub Actions workflow:

`.github/workflows/production-alpha-smoke.yml`

It is intentionally `workflow_dispatch` only. A code push must not silently certify whichever production URLs happen to be live.

Required inputs:

- `site_url` — public SiteRuneForged origin;
- `game_url` — public RuneForgedTCG/game origin;
- `expected_portal_sha` — exact certified 40-character SiteRuneForged commit SHA;
- `expected_portal_environment` — `alpha` or `production`;
- `expected_game_sha` — exact certified 40-character RuneForgedTCG commit SHA;
- `expected_game_environment` — `alpha` or `production`.

## Production transport boundary

For the manual production workflow:

- both origins must use HTTPS;
- loopback hosts are rejected;
- credentials in URLs are rejected;
- query strings, fragments and path-prefixed origins are rejected.

The executable smoke script has a narrowly scoped `RUNEFORGE_SMOKE_ALLOW_HTTP=true` override only so Full Stack Integration can test the same gate against local ephemeral servers. The production workflow never sets that override.

## Portal deployment certification

The smoke gate first requires:

`GET /api/public/portal/deployment/provenance`

- HTTP 200;
- `Cache-Control: no-store`;
- schema version 1;
- application `SiteRuneForged`;
- exact live portal `commitSha == expected_portal_sha`;
- correct 12-character short SHA;
- expected portal deployment environment.

## Game API certification

The smoke gate requires:

`GET /api/public/game/alpha/readiness`

- HTTP 200;
- `Cache-Control: no-store`;
- `alpha=playable`;
- `state=ready`;
- entry route `/play`;
- exactly seven certified Alpha capabilities;
- all seven available;
- Ranked, real-money payments and large-scale Live Ops remain outside the Alpha launch requirement;
- Ranked remains operationally disabled.

It also requires:

`GET /api/public/game/deployment/provenance`

- HTTP 200;
- `Cache-Control: no-store`;
- schema version 1;
- exact live `commitSha == expected_game_sha`;
- correct 12-character short SHA;
- expected deployment environment;
- release, engine, ruleset and content versions exactly matching readiness.

## Portal browser certification

Chromium opens the deployed `/alpha` page and requires:

- runtime state rendered as ready;
- `BUILD CERTIFICADO`;
- seven capability cards;
- no readiness/provenance block state;
- exact full portal SHA and exact full game SHA in the public build panel;
- `data-deploy-verification=verified`;
- Play CTA targeting the supplied game origin at `/play`.

## Evidence

Every run writes:

- `production-evidence/manifest.json`;
- `production-evidence/alpha-launch.png`.

The manifest schema is version 2 and records both portal deployment identity and game deployment identity, plus public runtime gate results. It contains no credentials or administrative data.

## Launch discipline

This gate does **not** enable Ranked, payments or Live Ops.

It only answers:

> Are the public site and public game currently deployed, mutually consistent, HTTPS-accessible, and serving the exact certified Alpha build we intended?

A production launch decision should reference the green workflow run, its exact expected game SHA and the uploaded evidence artifact.
