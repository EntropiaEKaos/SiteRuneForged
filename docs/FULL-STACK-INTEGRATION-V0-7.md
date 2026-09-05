# Full-Stack Integration Gate v0.7

## Goal

Prove that the two independently deployed repositories actually work together, not merely that each repository passes its own isolated CI.

The gate starts, in one GitHub Actions runner:

1. PostgreSQL 17;
2. a pinned, certified RuneForgedTCG backend revision;
3. SiteRuneForged built against that backend;
4. Chromium.

## Backend pin

The workflow contains an explicit `RUNEFORGE_BACKEND_REF` commit SHA.

This is deliberate:

- portal CI remains reproducible;
- adopting a new backend contract is an explicit reviewed change;
- a backend `main` movement cannot silently change an already-certified portal PR.

Before opening/merging the v0.7 PR, the pin must be updated to the definitive post-merge SHA containing Public Collection Count Consistency (#139).

## Data certification

The Node/Playwright journey first compares backend APIs directly:

- published Vanilla exists;
- public Vanilla card catalog is non-empty;
- `/api/collections` Vanilla `cardCount` equals `/api/public/game/cards?collection=vanilla` total;
- public card detail resolves the same card.

It then certifies the portal in Chromium:

- live `/cards`;
- live card detail;
- live `/collections`;
- live Vanilla collection detail;
- six-region `/regions`;
- live Emberhold detail.

Unavailable/fallback states are explicitly rejected during this gate.

## Evidence

The run captures full-page PNGs for:

- card catalog;
- card detail;
- collections;
- Vanilla;
- regions;
- Emberhold.

They are uploaded as a `rune-forge-full-stack-<sha>` workflow artifact.

## Scope

This gate focuses on the public read path. Administrative login/publish flows remain certified in RuneForgedTCG and the SiteRuneForged BFF contracts. A future integration layer can add cross-repository admin-session testing if deployment topology requires it.
