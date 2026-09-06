# Alpha Build Provenance

The Alpha Launch Hub consumes the RuneForgedTCG public runtime identity instead of maintaining a local build table.

## Public source

The portal reads:

`GET /api/public/game/deployment/provenance`

The backend response contains only safe immutable identity:

- application release;
- engine version;
- ruleset version;
- content version;
- exact 40-character Git commit SHA;
- 12-character short SHA;
- bounded deployment environment.

The portal fetches this endpoint with `cache: "no-store"`.

## Optional certified SHA pin

Production can configure:

```env
RUNEFORGE_EXPECTED_DEPLOY_SHA=<exact 40-character certified RuneForgedTCG SHA>
```

This is a server-side deployment control. It is not shipped as application content and must not use a `NEXT_PUBLIC_` prefix.

When configured, the Alpha Launch Hub compares the live backend `commitSha` with the expected SHA:

- **verified** — exact match; the build is shown as certified;
- **mismatch** — live backend differs; game CTAs fail closed;
- **unavailable** — provenance cannot be read; game CTAs fail closed while a pin is configured;
- **invalid-config** — the configured pin is not a full 40-character SHA; game CTAs fail closed.

When no pin is configured, the portal still shows the live exact SHA as **identified**, but does not claim that the portal deployment pinned it.

## Cross-endpoint consistency

The Launch Hub also compares the release, engine, ruleset and content versions returned by deployment provenance with the Alpha readiness endpoint.

If those immutable version contracts disagree, the game CTAs fail closed even when the runtime otherwise reports `ready`.

## Cross-repository certification

`.github/workflows/full-stack-integration.yml` pins one certified RuneForgedTCG backend SHA, starts that exact backend, injects the same SHA into backend runtime provenance and into `RUNEFORGE_EXPECTED_DEPLOY_SHA`, then verifies in Chromium that:

- backend provenance returns the pinned exact SHA;
- provenance environment is `alpha`;
- the portal renders the same exact SHA;
- the portal marks the build as verified;
- the seven Alpha capabilities remain available;
- the Play CTA points to the live backend `/play` route.

This keeps source authority in RuneForgedTCG while making the public portal visibly traceable to one exact game build.
