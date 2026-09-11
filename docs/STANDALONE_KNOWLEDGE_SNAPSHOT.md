# Standalone Knowledge Snapshot 1.0

## Goal

SiteRuneForged is deployed independently on Vercel. The public portal should remain useful even when RuneForgedTCG is not reachable.

The portal therefore follows one rule:

**live API / Portal CMS first; bundled certified snapshot second.**

The snapshot never becomes gameplay authority. It is a read-only release artifact.

## Current bundle

Technical source:

- RuneForgedTCG SHA: `4028da3999c168fa43e55c967d2d9cf90d30ebb1`;
- release: `2.97.0`;
- engine: `2.96.0`;
- ruleset: `2026.08.96`;
- content: `2026.08.25.93`.

Bundled public knowledge:

- 446 Vanilla cards;
- 20 canonical engine keywords;
- 6 structural rule contracts;
- 3 semantic rule contracts;
- collections projected from the bundled card catalog;
- RuneForge Book I lore manuscript v0.3 as 9 ordered public records.

## Source strategy

### Cards

The portal first requests the public card API. On technical failure it queries `src/data/card-catalog-snapshot.json` with the same public filters and pagination surface.

A live API `404` on a card detail remains authoritative and is not resurrected from stale snapshot content.

### Keywords

The portal first requests `/api/public/game/keywords`.

On technical failure it uses the 20 canonical definitions certified at the bundled game SHA. `cardCount` is not hard-coded: it is recalculated from the 446 bundled cards.

### Rules

The portal first requests `/api/public/game/rules/contracts`.

On technical failure it uses the six structural and three semantic contracts certified at the bundled game SHA. Public card counts are recalculated from the card snapshot.

### Collections

The portal first requests `/api/collections`.

On technical failure the set archive is projected directly from collection metadata embedded in the card snapshot. This prevents a second independent set/card count.

### Lore

The Portal CMS remains the preferred source for published lore.

If CMS/game is unavailable, `/lore` falls back to the bundled manuscript:

`RuneForge — Livro I — Quando as Runas Sangraram · Crônicas da Era da Fratura · v0.3`

The current snapshot contains:

1. Prólogo — O homem que encontrou uma palavra morta;
2. Capítulo I — Dezessete anos depois;
3. Capítulo II — A mulher que comprava guerras;
4. Capítulo III — O preço de uma palavra;
5. Capítulo IV — A cidade onde deuses têm preço;
6. Interlúdio I — As nove famílias conhecidas;
7. Capítulo V — O deus debaixo da cidade;
8. Capítulo VI — A estrada dos enforcados;
9. Interlúdio II — Fragmento do Códice de Edran.

The manuscript body is bundled in full. Secondary manuscript headings use the `## ` convention and render as article subsections.

## Public provenance page

`/snapshot` exposes the bundled counts and source versions so a visitor or operator can distinguish the standalone archive from live runtime data.

## Update procedure

When a new game SHA becomes the certified public source:

1. regenerate/update the card snapshot;
2. update the keyword/rules contract baseline only when the engine contract changes;
3. run `npm run contract:test`;
4. run Web CI and Full Stack Integration;
5. merge only after both gates are green.

When the lore manuscript advances:

1. update the chapter JSON records under `src/data/lore-book/`;
2. update `src/data/lore-book/index.ts` version/entry metadata;
3. keep ordering stable;
4. run the knowledge snapshot integrity gate and browser certification.

## Vercel

No additional runtime service is needed for fallback content. The snapshot is compiled into the same SiteRuneForged deployment, so a normal Git-linked Vercel deployment receives it with the portal build.
