import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium } from "@playwright/test";

const backend = process.env.RUNEFORGE_INTEGRATION_BACKEND_URL || "http://127.0.0.1:3001";
const site = process.env.RUNEFORGE_INTEGRATION_SITE_URL || "http://127.0.0.1:3000";
const evidenceDir = "integration-evidence";

async function json(path) {
  const response = await fetch(backend + path, { headers: { Accept: "application/json" } });
  const body = await response.json().catch(() => null);
  assert.equal(response.ok, true, `${path} failed with HTTP ${response.status}: ${JSON.stringify(body)}`);
  return body;
}

await fs.mkdir(evidenceDir, { recursive: true });

const collections = await json("/api/collections");
assert.equal(collections.ok, true);
assert.ok(Array.isArray(collections.collections));
const vanilla = collections.collections.find((collection) =>
  String(collection.key).toLowerCase() === "vanilla" ||
  String(collection.code).toLowerCase() === "van"
);
assert.ok(vanilla, "published Vanilla collection must exist");

const vanillaCards = await json("/api/public/game/cards?collection=vanilla&page=1&pageSize=1");
assert.equal(vanillaCards.ok, true);
assert.ok(vanillaCards.total > 0, "Vanilla must expose public collectible cards");
assert.equal(
  Number(vanilla.cardCount),
  Number(vanillaCards.total),
  "collection cardCount must equal the public card catalog projection",
);

const firstCard = vanillaCards.items[0];
assert.ok(firstCard?.defId && firstCard?.name, "public catalog must return a card");
const cardDetail = await json(`/api/public/game/cards/${encodeURIComponent(firstCard.defId)}`);
assert.equal(cardDetail.item.defId, firstCard.defId);
assert.equal(cardDetail.item.name, firstCard.name);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

try {
  await page.goto(`${site}/cards?collection=vanilla`, { waitUntil: "networkidle" });
  assert.match(await page.locator("h1").innerText(), /Catálogo de cartas/i);
  assert.ok(await page.locator(".catalog-card").count() > 0, "site catalog must render live cards");
  assert.equal(await page.locator(".card-catalog-empty").count(), 0, "live catalog must not show unavailable/empty state");
  await page.screenshot({ path: `${evidenceDir}/live-cards.png`, fullPage: true });

  await page.goto(`${site}/cards/${encodeURIComponent(firstCard.defId)}`, { waitUntil: "networkidle" });
  const escapedName = firstCard.name.replace(/[.*+?^\${}()|[\]\\]/g, "\\$&");
  assert.match(await page.locator("h1").innerText(), new RegExp(escapedName, "i"));
  await page.screenshot({ path: `${evidenceDir}/live-card-detail.png`, fullPage: true });

  await page.goto(`${site}/collections`, { waitUntil: "networkidle" });
  assert.match(await page.locator("h1").innerText(), /Coleções de RuneForge/i);
  assert.ok(await page.locator(".collection-card-live").count() > 0, "site must render live published collections");
  assert.equal(await page.locator(".card-catalog-empty").count(), 0, "live collections must not show unavailable/empty state");
  await page.screenshot({ path: `${evidenceDir}/live-collections.png`, fullPage: true });

  await page.goto(`${site}/collections/${encodeURIComponent(vanilla.key)}`, { waitUntil: "networkidle" });
  assert.match(await page.locator("h1").innerText(), /Vanilla/i);
  assert.ok(await page.locator(".collection-card-mini-grid a").count() > 0, "Vanilla detail must render live cards");
  await page.screenshot({ path: `${evidenceDir}/live-vanilla.png`, fullPage: true });

  await page.goto(`${site}/regions`, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".region-live-card").count(), 6, "regional codex must render six CMS regions");
  assert.equal(await page.getByText("catálogo offline", { exact: false }).count(), 0, "live regional counts must be available");
  await page.screenshot({ path: `${evidenceDir}/live-regions.png`, fullPage: true });

  await page.goto(`${site}/regions/emberhold`, { waitUntil: "networkidle" });
  assert.match(await page.locator("h1").innerText(), /Emberhold/i);
  assert.ok(await page.locator(".collection-card-mini-grid a").count() > 0, "Emberhold detail must render live cards");
  assert.equal(await page.locator(".region-catalog-unavailable").count(), 0);
  await page.screenshot({ path: `${evidenceDir}/live-emberhold.png`, fullPage: true });
} finally {
  await browser.close();
}

console.log(
  `FULL STACK INTEGRATION: PASS — backend ${backend} · site ${site} · Vanilla ${vanilla.cardCount} public cards · card ${firstCard.defId} · collections · regions`,
);
