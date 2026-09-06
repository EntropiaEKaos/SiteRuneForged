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

const keywords = await json("/api/public/game/keywords");
assert.equal(keywords.ok, true);
assert.ok(Array.isArray(keywords.items));
assert.ok(keywords.items.length >= 20, "public keyword codex must expose all canonical keywords");
const liveKeyword = keywords.items.find((item) => item.source === "canonical" && Number(item.cardCount) > 0);
assert.ok(liveKeyword?.key && liveKeyword?.name, "at least one canonical keyword must be used by a public card");
const keywordCards = await json(`/api/public/game/cards?keyword=${encodeURIComponent(liveKeyword.key)}&page=1&pageSize=24`);
assert.equal(
  Number(liveKeyword.cardCount),
  Number(keywordCards.total),
  "keyword cardCount must equal exact public catalog filter",
);

const rules = await json("/api/public/game/rules/contracts");
assert.equal(rules.ok, true);
assert.equal(rules.version, 1);
assert.equal(rules.structural.length, 6, "public rules must expose six structural contracts");
assert.equal(rules.semantic.length, 3, "public rules must expose three certified semantic contracts");
const structureRule = rules.semantic.find((item) => item.key === "structure");
const ritualRule = rules.semantic.find((item) => item.key === "ritual");
const trapRule = rules.semantic.find((item) => item.key === "trap");
assert.ok(structureRule && ritualRule && trapRule, "Structure, Ritual and Trap public contracts must exist");
assert.equal(structureRule.mana, "regular");
assert.equal(structureRule.countsAsSpellCast, false);
assert.equal(ritualRule.timing, "main-only");
assert.equal(ritualRule.mana, "spell");
assert.equal(trapRule.timing, "reaction-only");
assert.equal(trapRule.mana, "spell");
for (const contract of rules.all) {
  assert.equal("spell" in contract, false, "rules DTO must not expose executable spell payload");
  assert.equal("effect" in contract, false, "rules DTO must not expose effect graph");
  assert.equal("mechanics" in contract, false, "rules DTO must not expose mechanics AST");
}

const alpha = await json("/api/public/game/alpha/readiness");
assert.equal(alpha.ok, true);
assert.equal(alpha.readiness.alpha, "playable");
assert.equal(alpha.readiness.state, "ready", "fresh certified integration runtime must expose ready Alpha state");
assert.equal(alpha.readiness.entryRoute, "/play");
assert.equal(alpha.readiness.capabilities.length, 7, "certified Alpha scope must expose seven capabilities");
assert.ok(alpha.readiness.capabilities.every((item) => item.status === "available"), "fresh integration runtime must expose all Alpha capabilities");
assert.equal(alpha.readiness.boundaries.rankedPublicLaunchRequirement, false);
assert.equal(alpha.readiness.boundaries.realMoneyPaymentsLaunchRequirement, false);
assert.equal(alpha.readiness.boundaries.largeScaleLiveOpsLaunchRequirement, false);

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

  await page.goto(`${site}/keywords`, { waitUntil: "networkidle" });
  assert.match(await page.locator("h1").innerText(), /Keywords & Mecânicas/i);
  assert.ok(await page.locator(".keyword-card").count() >= 20, "mechanics codex must render canonical keywords");
  assert.equal(await page.locator(".card-catalog-empty").count(), 0, "live mechanics codex must not show unavailable state");
  await page.screenshot({ path: `${evidenceDir}/live-keywords.png`, fullPage: true });

  await page.goto(`${site}/keywords/${encodeURIComponent(liveKeyword.key)}`, { waitUntil: "networkidle" });
  const escapedKeywordName = liveKeyword.name.replace(/[.*+?^\${}()|[\]\\]/g, "\\$&");
  assert.match(await page.locator("h1").innerText(), new RegExp(escapedKeywordName, "i"));
  assert.ok(await page.locator(".collection-card-mini-grid a").count() > 0, "keyword detail must render exactly filtered live cards");
  assert.equal(await page.locator(".region-catalog-unavailable").count(), 0);
  await page.screenshot({ path: `${evidenceDir}/live-keyword-detail.png`, fullPage: true });

  await page.goto(`${site}/cards?keyword=${encodeURIComponent(liveKeyword.key)}`, { waitUntil: "networkidle" });
  assert.match(await page.locator("h1").innerText(), /Catálogo de cartas/i);
  assert.ok(await page.locator(".catalog-card").count() > 0, "exact keyword filter must render matching public cards");
  assert.equal(await page.locator('select[name="keyword"]').inputValue(), liveKeyword.key);
  await page.screenshot({ path: `${evidenceDir}/live-keyword-filter.png`, fullPage: true });

  await page.goto(`${site}/rules`, { waitUntil: "networkidle" });
  assert.match(await page.locator("h1").innerText(), /Regras & Como Jogar/i);
  assert.equal(await page.locator(".rules-semantic-grid .rule-contract-card").count(), 3, "rules page must render three live semantic contracts");
  assert.equal(await page.locator(".rules-structural-grid .rule-contract-card").count(), 6, "rules page must render six live structural contracts");
  assert.equal(await page.locator(".rules-contract-unavailable").count(), 0, "live rules page must not show engine-contract unavailable state");
  assert.ok(await page.getByText("Ritual", { exact: true }).count() > 0);
  assert.ok(await page.getByText("Armadilha", { exact: true }).count() > 0);
  assert.ok(await page.getByText("Estrutura", { exact: true }).count() > 0);
  await page.screenshot({ path: `${evidenceDir}/live-rules-intelligence.png`, fullPage: true });

  await page.goto(`${site}/alpha`, { waitUntil: "networkidle" });
  assert.match(await page.locator("h1").innerText(), /Entre na forja/i);
  assert.equal(await page.locator(".alpha-runtime-ready").count(), 1, "Alpha launch hub must show the live ready runtime");
  assert.equal(await page.locator(".alpha-capability-card").count(), 7, "Alpha launch hub must render seven certified capabilities");
  assert.equal(await page.locator(".alpha-readiness-unavailable").count(), 0);
  assert.equal(await page.locator(".alpha-boundary-grid article").count(), 3);
  assert.equal(await page.locator(".alpha-play-cta").getAttribute("href"), `${backend}/play`);
  await page.screenshot({ path: `${evidenceDir}/live-alpha-launch.png`, fullPage: true });
} finally {
  await browser.close();
}

console.log(
  `FULL STACK INTEGRATION: PASS — backend ${backend} · site ${site} · Vanilla ${vanilla.cardCount} public cards · card ${firstCard.defId} · collections · regions · ${keywords.items.length} keywords · exact keyword ${liveKeyword.key} · 6 structural rules + 3 semantic rules · Alpha ${alpha.readiness.state} with ${alpha.readiness.capabilities.length} capabilities`,
);
