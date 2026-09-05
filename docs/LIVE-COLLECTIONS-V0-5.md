# Portal Live Collections v0.5

## Objective

Expose the actual published RuneForge sets in SiteRuneForged without duplicating collection records in the website repository.

## Authority

Collection lifecycle comes from the RuneForgedTCG public endpoint:

`GET /api/collections`

The portal treats this endpoint as authoritative for:

- collection key/code/name;
- description;
- symbol and banner;
- release and rotation dates;
- lifecycle;
- public card count;
- public collection metadata.

The site does not maintain a fallback collection registry.

## Routes

- `/collections` — published collection archive;
- `/collections/{key}` — collection detail.

The detail route combines two public authorities:

1. `/api/collections` for the set identity/lifecycle;
2. Public Card Catalog 1.0 for cards filtered by `collection={key}`.

## Failure semantics

- API unavailable -> explicit archive-unavailable state;
- authoritative missing collection -> Next.js 404;
- card catalog unavailable while collection data is available -> collection page remains visible with an explicit card-catalog unavailable notice;
- successful collection with zero public cards -> explicit empty state.

No local fake collection/card data is substituted.

## Administration

Gameplay collections remain managed by the RuneForgedTCG content control plane. Publication/rotation state is therefore governed by the same Studio pipeline, approvals and audit model used by game content.

The generic Portal CMS `collections` resource may still be used for editorial content elsewhere, but the canonical public set archive uses the gameplay collection authority to avoid competing sources of truth.

## Visual certification

CI certifies desktop/mobile unavailable states without requiring a live external backend:

- `/collections`;
- `/collections/visual-fixture`.

Live-data E2E belongs in the integration environment where `RUNEFORGE_API_URL` points to a certified RuneForgedTCG backend.
