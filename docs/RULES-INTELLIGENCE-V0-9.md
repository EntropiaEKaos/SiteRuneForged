# Portal Rules Intelligence v0.9

## Purpose

Turn `/rules` into a composed rules experience instead of a purely editorial index.

The page combines two authorities:

1. RuneForgedTCG public engine contracts for structural facts;
2. Portal CMS `rules` content for tutorials, examples and explanatory articles.

The portal does not copy engine timing or mana rules into a second hand-maintained data model.

## Backend dependency

Public endpoint:

`GET /api/public/game/rules/contracts`

The Full Stack workflow is pinned to the definitive RuneForgedTCG SHA containing Public Rules Contracts 1.0:

`b599bf1901d83e6de9dca167a89a7f467167db40`

The portal PR remains draft until that backend SHA completes its post-merge RuneForgedTCG repository certification.

## Rules composition

### Engine-owned facts

The public API owns:

- six structural engine contracts;
- three certified semantic contracts;
- base type;
- zone;
- timing;
- regular vs spell mana;
- persistence;
- whether a play counts as a spell cast;
- public description;
- public-card count.

### CMS-owned explanation

Portal CMS continues to own:

- article titles and summaries;
- tutorials;
- ordering;
- examples;
- published version history;
- educational copy.

Existing `/rules/{slug}` editorial article routes remain unchanged.

## Public terminology

The page intentionally describes:

- **six structural contracts**;
- **three semantic specializations**.

It does not market these as “nine card types”, avoiding conflict with the existing player-facing certified-type language.

## Failure semantics

If the engine rules API is unavailable:

- the page clearly marks engine contracts unavailable;
- it does not substitute hard-coded timing/mana values;
- CMS/fallback tutorials remain visible and usable.

This makes an engine outage partial rather than turning the whole learning experience into an error page.

## Cross-repository certification

The Full Stack journey validates directly against the pinned backend:

- version 1 rules contract;
- exactly 6 structural contracts;
- exactly 3 semantic contracts;
- Structure uses regular mana and does not count as a spell cast;
- Ritual is main-only and uses spell mana;
- Trap is reaction-only and uses spell mana;
- public DTO does not contain spell/effect/mechanics payloads.

The browser journey then requires `/rules` to render:

- 3 semantic rule cards;
- 6 structural rule cards;
- no engine-unavailable state;
- Ritual, Armadilha and Estrutura labels;
- screenshot evidence.

Normal Web CI separately certifies the resilience state where the engine API is absent while CMS tutorials remain visible.
