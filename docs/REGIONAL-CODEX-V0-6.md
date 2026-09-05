# Portal Regional Codex v0.6

## Purpose

Make the six RuneForge regions explorable as first-class public pages while keeping editorial presentation administrable in Portal CMS and gameplay/card counts authoritative in the game API.

## Composition model

Regional presentation is loaded from Portal CMS resource:

- resource: `regions`
- slug: `home`

This controls:
- kicker/title;
- regional descriptions;
- region icons;
- ordering/presentation.

Gameplay data is loaded from Public Card Catalog 1.0:

- region facet counts for `/regions`;
- `region={name}` filtered cards for `/regions/{region}`.

This intentionally combines two responsibilities instead of duplicating either one:

- CMS owns editorial identity;
- RuneForgedTCG owns actual public cards.

## Routes

- `/regions`
- `/regions/{region}`

The default Home navigation now points to `/regions`, and fallback Home region links point to the corresponding regional detail pages.

## Failure semantics

Portal CMS already provides curated fallback presentation during technical unavailability.

If the card catalog is unavailable:
- the regional editorial page remains visible;
- card counts render as unavailable;
- detail pages show an explicit catalog-unavailable notice.

If a requested region is not present in the currently published/fallback regional presentation, the route returns 404.

## Administration

Changing region copy, ordering or iconography continues through Portal CMS.

Changing which cards belong to a region remains a game-content concern and is reflected automatically through the public card API.

## Certification

CI guards:
- CMS region source;
- live public catalog composition;
- facet-based counts;
- filtered regional detail requests;
- 404 behavior.

Chromium evidence covers desktop/mobile region archive and Emberhold detail.
