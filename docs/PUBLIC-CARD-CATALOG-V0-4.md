# Portal Public Card Catalog v0.4

## Goal

SiteRuneForged must display the real RuneForge card catalog without copying game definitions into the website repository.

The portal consumes the dedicated public endpoints from RuneForgedTCG Public Card Catalog 1.0:

- `GET /api/public/game/cards`
- `GET /api/public/game/cards/{defId}`

## Routes

- `/cards` — searchable/filterable public catalog;
- `/cards/{defId}` — public card detail.

## Filters

The catalog forwards only supported public query parameters:

- search text;
- region;
- semantic/structural card type;
- rarity;
- collection;
- page.

Page size is fixed to 24 by the portal while the backend keeps the authoritative upper bound.

## No duplicated card authority

The site contains types for the public transport DTO, but no game card definitions.

When the RuneForge public API is unavailable, the site renders an explicit unavailable state rather than falling back to a copied/fake card catalog.

When the API returns an authoritative card 404, the detail route returns the portal 404 through Next.js `notFound()`.

## Public presentation

The catalog surfaces only fields already projected by the backend safe DTO:

- name / defId;
- regions;
- public card type;
- cost and combat stats;
- rarity;
- keyword names;
- collection;
- public art;
- public rules/flavor;
- races/classes/strategic identity.

The portal never requests or stores engine effect graphs, mechanics ASTs, administrator state or audit data.

## Visual certification

CI covers desktop and mobile unavailable-state rendering for catalog and detail because CI intentionally does not depend on a live production RuneForge backend.

Full live-data E2E should run in an integration environment where `RUNEFORGE_API_URL` points to the certified backend.
