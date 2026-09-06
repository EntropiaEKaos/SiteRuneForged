# Vercel Alpha Deployment

## Repository contract

SiteRuneForged is Vercel-ready from source control.

`vercel.json` pins:

- framework: `nextjs`;
- install command: `npm run ci:install`;
- build command: `npm run production:build`.

This preserves the same deterministic dependency tree and release preflight used by GitHub CI.

## System environment variables

In the Vercel project, enable **access to System Environment Variables**.

The deployment contract uses:

- `VERCEL_GIT_COMMIT_SHA` — exact Git SHA of the deployment;
- `VERCEL_ENV` — `preview` or `production` deployment environment.

SiteRuneForged uses those values automatically when explicit RuneForge portal identity is not configured.

For a Git deployment, you normally should **not** manually set `RUNEFORGE_PORTAL_DEPLOY_SHA`. This avoids stale SHA configuration across deploys.

## Required RuneForge project variables

Configure server-side Vercel Project Environment Variables:

```env
RUNEFORGE_API_URL=https://<public-game-api-origin>
RUNEFORGE_GAME_URL=https://<playable-game-origin>
RUNEFORGE_EXPECTED_DEPLOY_SHA=4028da3999c168fa43e55c967d2d9cf90d30ebb1
```

When the administrative API lives on a different origin:

```env
RUNEFORGE_ADMIN_API_URL=https://<admin-api-origin>
```

Do not prefix these with `NEXT_PUBLIC_`.

## Preview

A Preview deployment should resolve its own identity as:

- portal SHA = `VERCEL_GIT_COMMIT_SHA`;
- portal environment = `preview`.

The public endpoint:

`GET /api/public/portal/deployment/provenance`

must return the exact preview SHA with `Cache-Control: no-store`.

## Production

A Production deployment from the certified portal commit must prove:

- portal SHA = the exact SiteRuneForged commit being deployed;
- portal environment = `production`;
- game SHA = `4028da3999c168fa43e55c967d2d9cf90d30ebb1` until a later certified game main replaces it.

Current certified portal main at the time this runbook was introduced:

`7086e50360ad426f45858b14ccf9fefcf2121f21`

Do not hard-code that portal SHA into Vercel project variables; Git system identity should follow each deployment automatically.

## Post-deploy certification

After both public HTTPS origins exist, run **Production Alpha Smoke** with:

- site URL;
- game URL;
- expected portal SHA;
- expected portal environment `production`;
- expected game SHA;
- expected game environment (`alpha` or `production`, matching the game deployment).

The gate validates both public provenance endpoints, the seven Alpha capabilities, Ranked disabled, the visible build panel and the `/play` CTA.

A deployment is not considered publicly certified until this real HTTPS smoke run is green.

## Failure behavior

The Vercel build fails before `next build` when:

- Git SHA is absent or malformed;
- deployment environment cannot be resolved;
- explicit RuneForge portal SHA conflicts with Vercel Git SHA;
- GitHub and Vercel platform SHAs are both present but disagree.

The runtime provenance endpoint fails closed with HTTP 503 when identity is invalid.
