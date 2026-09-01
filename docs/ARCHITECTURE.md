# RuneForge Web — Architecture

## Objective

The public portal is an independent application and repository. It must never depend directly on the game engine, Studio internals, or the production database.

## Data flow

```text
RuneForgedTCG / authoritative backend
            |
            | public read-only API
            v
      SiteRuneForged
            |
            v
          Vercel
```

## Boundary rules

1. The game remains the source of truth for cards, collections, rules metadata, keywords and public game information.
2. SiteRuneForged only consumes public read-only endpoints.
3. No database credentials or game secrets belong in this repository.
4. The web portal must degrade safely when the API is unavailable.
5. Public DTO contracts should be versioned before production integration.
6. Portal CI and deployment are independent from game CI and deployment.

## Initial public API contract proposal

- `GET /api/public/cards`
- `GET /api/public/cards/:slug`
- `GET /api/public/collections`
- `GET /api/public/regions`
- `GET /api/public/keywords`
- `GET /api/public/rules`
- `GET /api/public/game-info`

## Vercel

Set `RUNEFORGE_API_URL` as a server-side environment variable. Do not prefix it with `NEXT_PUBLIC_` unless browser-side access is intentionally required.

## Visual evidence

Each meaningful UI milestone should include desktop and mobile screenshots under `docs/screenshots/` and reference them from the PR description or milestone notes.
