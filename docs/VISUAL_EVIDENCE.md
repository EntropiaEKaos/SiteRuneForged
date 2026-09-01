# Visual Evidence Policy

Every meaningful UI change must be visually certified in a real browser.

## Foundation v0.1

The CI captures full-page screenshots at:

- Desktop: 1440×1100
- Mobile: 390×844

Screenshots are uploaded by GitHub Actions as the artifact `rune-forge-visual-evidence` on every PR run.

## Rule

A UI PR is not considered visually certified until the browser job succeeds and the screenshots have been reviewed.
