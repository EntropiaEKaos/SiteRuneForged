import fs from "node:fs";
import path from "node:path";

const backend = (process.env.RUNEFORGE_SNAPSHOT_BACKEND_URL || "http://127.0.0.1:3001").replace(/\/$/, "");
const backendDir = path.resolve(process.env.RUNEFORGE_SNAPSHOT_BACKEND_DIR || "../backend");
const expectedSha = (process.env.RUNEFORGE_SNAPSHOT_EXPECTED_SHA || "").trim().toLowerCase();
const outputFile = path.resolve(process.env.RUNEFORGE_SNAPSHOT_OUTPUT || "src/data/card-catalog-snapshot.json");
const assetRoot = path.resolve(process.env.RUNEFORGE_SNAPSHOT_ASSET_ROOT || "public/standalone-game");

if (!/^[0-9a-f]{40}$/.test(expectedSha)) {
  throw new Error("RUNEFORGE_SNAPSHOT_EXPECTED_SHA must be an exact 40-character SHA");
}

async function getJson(pathname) {
  const response = await fetch(backend + pathname, { headers: { Accept: "application/json" } });
  const body = await response.json().catch(() => null);
  if (!response.ok || !body) {
    throw new Error(`${pathname} failed with HTTP ${response.status}: ${JSON.stringify(body)}`);
  }
  return body;
}

function copyLocalAsset(value) {
  if (typeof value !== "string" || !value.startsWith("/")) return value;
  const relative = value.replace(/^\/+/, "");
  if (!relative || relative.includes("..")) return value;

  const source = path.join(backendDir, "public", relative);
  if (!fs.existsSync(source) || !fs.statSync(source).isFile()) return value;

  const destination = path.join(assetRoot, relative);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
  return `/standalone-game/${relative}`;
}

const provenance = await getJson("/api/public/game/deployment/provenance");
if (provenance?.deployment?.commitSha !== expectedSha) {
  throw new Error(`backend provenance ${provenance?.deployment?.commitSha || "missing"} != expected ${expectedSha}`);
}

const first = await getJson("/api/public/game/cards?page=1&pageSize=100");
if (first?.ok !== true || !Array.isArray(first.items)) throw new Error("invalid public card catalog response");

const totalPages = Number(first.totalPages);
const pages = [first];
for (let page = 2; page <= totalPages; page += 1) {
  pages.push(await getJson(`/api/public/game/cards?page=${page}&pageSize=100`));
}

const cards = pages.flatMap((page) => page.items);
if (cards.length !== first.total) {
  throw new Error(`snapshot collected ${cards.length} cards but API reports ${first.total}`);
}

const ids = new Set();
for (const card of cards) {
  if (!card?.defId || ids.has(card.defId)) throw new Error(`invalid or duplicate defId: ${card?.defId}`);
  ids.add(card.defId);
  card.art = copyLocalAsset(card.art);
  if (card.collection?.symbol) card.collection.symbol = copyLocalAsset(card.collection.symbol);
}

cards.sort((a, b) => String(a.name).localeCompare(String(b.name)) || String(a.defId).localeCompare(String(b.defId)));

const snapshot = {
  schemaVersion: 1,
  source: {
    repository: "EntropiaEKaos/RuneForgedTCG",
    commitSha: expectedSha,
    commitShort: expectedSha.slice(0, 12),
    environment: provenance.deployment.environment,
    release: provenance.deployment.release,
    engineVersion: provenance.deployment.engineVersion,
    rulesetVersion: provenance.deployment.rulesetVersion,
    contentVersion: provenance.deployment.contentVersion,
    catalogRevision: first.catalogRevision,
    total: cards.length
  },
  cards
};

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, JSON.stringify(snapshot, null, 2) + "\n");

console.log(
  `STANDALONE CARD SNAPSHOT: PASS — ${cards.length} cards · ${snapshot.source.environment}@${snapshot.source.commitShort} · ${snapshot.source.catalogRevision}`
);
