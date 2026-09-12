import assert from "node:assert/strict";

const backend = String(process.env.RUNEFORGE_INTEGRATION_BACKEND_URL || "").replace(/\/$/, "");
const site = String(process.env.RUNEFORGE_INTEGRATION_SITE_URL || "").replace(/\/$/, "");

assert.ok(backend, "RUNEFORGE_INTEGRATION_BACKEND_URL is required");
assert.ok(site, "RUNEFORGE_INTEGRATION_SITE_URL is required");

const cardResponse = await fetch(`${backend}/api/public/game/cards/rf296_sent_ilyra`, { cache: "no-store" });
assert.equal(cardResponse.status, 200, "public Sentinela endpoint must return 200");
const payload = await cardResponse.json();
const card = payload?.item;

assert.equal(card?.defId, "rf296_sent_ilyra");
assert.equal(card?.sentinela?.startingLoyalty, 4, "Ilyra must expose starting loyalty 4");
assert.equal(card?.sentinela?.abilities?.length, 3, "Ilyra must expose all three public abilities");
assert.deepEqual(
  card.sentinela.abilities.map(({ cost, description }) => ({ cost, description })),
  [
    { cost: 1, description: "+1: cause 1 de dano ao Nexus inimigo" },
    { cost: -2, description: "-2: conceda Ataque Rápido a uma unidade aliada" },
    { cost: -6, description: "-6: cause 4 de dano a todos os inimigos" },
  ],
);
assert.ok(card.sentinela.abilities.every((ability) => !("effect" in ability)), "public Sentinela abilities must never expose executable effects");

const legacyResponse = await fetch(`${backend}/api/public/game/cards/sent_aurion`, { cache: "no-store" });
assert.equal(legacyResponse.status, 200, "legacy public Sentinela endpoint must return 200");
const legacy = (await legacyResponse.json())?.item;
assert.equal(legacy?.sentinela?.startingLoyalty, 4, "Aurion must expose starting loyalty");
assert.equal(legacy?.sentinela?.abilities?.length, 3, "Aurion must expose all public abilities");
assert.ok(legacy.sentinela.abilities.every((ability) => !("effect" in ability)), "legacy Sentinela abilities must also remain presentation-only");

const detailResponse = await fetch(`${site}/cards/rf296_sent_ilyra`, { cache: "no-store" });
assert.equal(detailResponse.status, 200, "portal Sentinela detail must return 200");
const detailHtml = (await detailResponse.text()).replace(/<!-- -->/g, "");
assert.match(detailHtml, /data-sentinela-abilities="true"/);
assert.match(detailHtml, /LEALDADE INICIAL 4/);
assert.match(detailHtml, /data-loyalty-cost="1"[^>]*>\+1: cause 1 de dano ao Nexus inimigo/);
assert.match(detailHtml, /data-loyalty-cost="-2"[^>]*>-2: conceda Ataque Rápido a uma unidade aliada/);
assert.match(detailHtml, /data-loyalty-cost="-6"[^>]*>-6: cause 4 de dano a todos os inimigos/);

console.log("SENTINELA PUBLIC INTEGRATION: PASS — Ilyra + legacy Aurion · loyalty · all abilities · no executable effect leakage · portal detail");
