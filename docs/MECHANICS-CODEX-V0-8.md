# Portal Mechanics Codex v0.8

## Objective

Expose RuneForge mechanics as a first-class public experience without creating a second hand-written rules glossary in the website repository.

The public portal consumes the authoritative RuneForgedTCG Public Keyword Codex 1.0.

## Routes

- `/keywords` — public mechanics/keyword archive;
- `/keywords/{key}` — mechanic detail with exact live card usage;
- `/cards?keyword={key}` — exact keyword-filtered card catalog.

Printed keywords in public card detail pages link directly to their codex entry.

## Authority

The portal does not define keyword behavior.

RuneForgedTCG owns:

- canonical keyword names/descriptions/icons;
- runtime-domain labels;
- grantability;
- required trigger/timing contracts;
- published custom keyword definitions;
- public-card usage counts;
- exact keyword filtering.

SiteRuneForged only renders the safe public DTO.

## Safe public boundary

The site consumes:

`GET /api/public/game/keywords`

and intentionally has no knowledge of:

- behavior graphs;
- effect graphs;
- conditions;
- Studio metadata;
- admin authorization;
- authoring schemas.

Custom mechanics become visible only when the backend Public Keyword Codex considers them safely published.

## Card catalog integration

The existing public card catalog gains an exact Keyword selector.

The selector is populated from the backend keyword facet and preserves the active `keyword` query parameter through pagination.

Card detail pages deduplicate canonical/custom keyword keys before rendering codex links.

## Availability semantics

### Keyword archive unavailable

The portal displays an explicit unavailable state.

It does not synthesize a local canonical glossary because doing so could mask drift between the website and engine.

### Unknown keyword

When the authoritative API is available and the requested key does not exist, the detail route returns Next.js 404.

### Keyword available, card catalog unavailable

The mechanic definition remains visible, while the card-usage area displays an explicit catalog-unavailable state.

This prevents a secondary card failure from hiding the authoritative mechanic definition.

## Offline visual certification

Normal Web CI runs without a RuneForgedTCG backend and certifies desktop/mobile resilience states for:

- `/keywords`;
- `/keywords/Flying`.

## Live full-stack certification

The Full Stack Integration workflow is pinned to RuneForgedTCG:

`3b0ec9a4a4bd20d865a947ba881420c902a2752d`

It proves:

1. at least 20 canonical keywords are publicly available;
2. at least one canonical keyword is used by public collectible cards;
3. `keyword.cardCount` equals `/api/public/game/cards?keyword={key}` total;
4. `/keywords` renders the live codex;
5. `/keywords/{key}` renders live matching cards;
6. `/cards?keyword={key}` preserves the exact filter;
7. screenshot evidence is captured for archive, detail and filtered cards.

The portal PR remains blocked from merge until this backend SHA has completed its own post-merge repository certification.
