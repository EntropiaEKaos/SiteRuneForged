# Portal v1.0 — Alpha Launch Hub

## Objective

Turn the public portal's Alpha area into a real launch surface backed by two explicit authorities:

- **RuneForgedTCG runtime** owns operational availability, versions and the certified playable Alpha scope;
- **Portal CMS** owns public copy, labels, launch notes and presentation.

The portal does not maintain its own runtime status or game capability registry.

## Public route

`/alpha`

The launch hub displays:

- live runtime state;
- public release / engine / ruleset / content versions;
- the seven certified playable Alpha journeys;
- per-capability availability;
- server-configured game CTA;
- explicit launch boundaries;
- CMS-managed launch notes.

## Runtime source

`GET /api/public/game/alpha/readiness`

This call uses an explicit `no-store` fetch on the portal so maintenance and recovery are not hidden behind the normal five-minute catalog/CMS cache.

## Game origin

Server-side deployment variables:

```bash
RUNEFORGE_API_URL=https://api-or-game-origin
RUNEFORGE_GAME_URL=https://play-origin
```

`RUNEFORGE_GAME_URL` is optional and falls back to the origin of `RUNEFORGE_API_URL`.

The game origin helper:

- imports `server-only`;
- accepts only HTTP/HTTPS;
- never exposes a `NEXT_PUBLIC_*` variable;
- accepts only route-like paths supplied by the backend readiness DTO.

If the game origin is not configured, the portal shows operational status but disables the play CTA instead of inventing a destination.

## CMS authority

The existing Portal CMS resource `alpha` now has a typed public presentation contract in SiteRuneForged.

Recommended record:

- resource: `alpha`
- slug: `main`

CMS fields control:

- hero eyebrow/title/description;
- CTA labels;
- launch-journey explanatory copy;
- launch notes;
- boundary section explanation;
- Home Alpha teaser.

CMS does **not** control:

- live runtime state;
- release versions;
- available capabilities;
- gameplay routes;
- Alpha launch-scope booleans.

## Certified runtime scope

The launch hub renders the public readiness DTO, which currently covers:

1. first-run onboarding;
2. deck selection;
3. mulligan;
4. authoritative PvE;
5. Forge + persisted decks;
6. persisted rewards/progression;
7. authoritative Casual PvP.

## Launch boundary

The portal explicitly communicates that the playable Alpha does not require:

- public Ranked;
- real-money payments;
- large-scale Live Ops.

The portal may display current Ranked operational state only as context; that state cannot redefine the Alpha launch boundary.

## Failure semantics

### Backend readiness unavailable

The page keeps CMS/fallback launch copy visible but renders:

- `STATUS INDISPONÍVEL`;
- no fabricated versions;
- no fabricated capability list;
- play CTA disabled.

### Maintenance

The public DTO renders `MANUTENÇÃO`; all runtime capabilities are temporarily unavailable and the play CTA is disabled.

### AI/PvE disabled

The page renders `ALPHA LIMITADO`; non-AI journeys remain available according to the backend.

## Home integration

The Home Alpha teaser now consumes `alpha/main` CMS presentation and always navigates into `/alpha`.

The default global navigation CTA also points to `/alpha`.

## Certification

### Web CI

Desktop/mobile evidence covers the launch hub while the public backend is unavailable:

- editorial copy still renders;
- runtime status is fail-visible;
- capabilities are not locally duplicated;
- three launch-boundary cards remain visible.

### Full Stack Integration

The cross-repository gate pins an explicit RuneForgedTCG SHA and requires:

- Alpha readiness endpoint success;
- state `ready`;
- exactly seven certified capabilities;
- all capabilities available in a clean integration runtime;
- all three launch-boundary booleans false;
- live `/alpha` browser rendering;
- seven capability cards;
- ready status;
- play CTA resolving to the configured RuneForgedTCG `/play` route;
- screenshot evidence.

The portal PR must remain draft until Public Alpha Readiness 1.0 is merged and post-merge certified, after which the integration pin must be updated to the definitive backend SHA.
