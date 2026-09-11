import assert from "node:assert/strict";
import fs from "node:fs";

const read = (path) => fs.readFileSync(path, "utf8");
const cardSnapshot = JSON.parse(read("src/data/card-catalog-snapshot.json"));
const knowledge = read("src/data/knowledge-snapshot.ts");
const keywords = read("src/lib/keywords/public-keywords.ts");
const rules = read("src/lib/rules/public-rules.ts");
const collections = read("src/lib/collections/public-collections.ts");
const editorial = read("src/components/PortalEditorial.tsx");
const snapshotPage = read("src/app/snapshot/page.tsx");
const loreIndex = read("src/data/lore-book/index.ts");

assert.equal(cardSnapshot.source.commitSha, "4028da3999c168fa43e55c967d2d9cf90d30ebb1");
assert.equal(cardSnapshot.cards.length, 446);
assert.match(knowledge, /keywords:\s*20/);
assert.match(knowledge, /ruleContracts:\s*9/);
assert.match(knowledge, /standaloneKeywords/);
assert.match(knowledge, /standaloneRules/);
assert.match(knowledge, /standaloneCollections/);
assert.match(knowledge, /source: "canonical" as const/);
assert.match(knowledge, /cardCount: usage\.get\(keyword\.key\) \?\? 0/);
assert.equal((knowledge.match(/engineKeyword:/g) || []).length, 20, "snapshot must preserve all 20 canonical engine keywords");

for (const key of ["Unit", "Spell", "Enchantment", "Artifact", "Equipment", "Sentinela"]) {
  assert.match(knowledge, new RegExp(`key: "${key}"[^\\n]*kind: "structural"`), `missing structural rule ${key}`);
}
for (const key of ["structure", "ritual", "trap"]) {
  assert.match(knowledge, new RegExp(`key: "${key}"[^\\n]*kind: "semantic"`), `missing semantic rule ${key}`);
}

assert.match(keywords, /\/api\/public\/game\/keywords/);
assert.match(keywords, /standaloneKeywords\(\)/);
assert.match(keywords, /source: "api"/);
assert.match(keywords, /source: "snapshot"/);
assert.match(rules, /\/api\/public\/game\/rules\/contracts/);
assert.match(rules, /standaloneRules\(\)/);
assert.match(rules, /source: "snapshot"/);
assert.match(collections, /\/api\/collections/);
assert.match(collections, /standaloneCollections\(\)/);
assert.match(collections, /source: "snapshot"/);

const loreFiles = [
  "prologo-a-palavra-morta.json",
  "capitulo-i-dezessete-anos-depois.json",
  "capitulo-ii-a-mulher-que-comprava-guerras.json",
  "capitulo-iii-o-preco-de-uma-palavra.json",
  "capitulo-iv-a-cidade-onde-deuses-tem-preco.json",
  "interludio-i-as-nove-familias.json",
  "capitulo-v-o-deus-debaixo-da-cidade.json",
  "capitulo-vi-a-estrada-dos-enforcados.json",
  "interludio-ii-codice-de-edran.json",
];
const lore = loreFiles.map((file) => JSON.parse(read(`src/data/lore-book/${file}`)));
assert.equal(lore.length, 9);
assert.deepEqual(lore.map((entry) => entry.order), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
assert.ok(lore.every((entry) => entry.slug && entry.title && entry.summary && entry.body.length > 0));
assert.ok(lore[0].body.includes("— Forja."), "prologue must retain the ninth-rune revelation");
assert.ok(lore[4].body.includes("— RuneForge."), "chapter IV must retain the first RuneForge naming");
assert.ok(lore[8].body.includes("“E a dívida venceu.”"), "current manuscript ending must remain intact");
assert.match(loreIndex, /Quando as Runas Sangraram/);
assert.match(loreIndex, /version: "v0\.3"/);
assert.match(loreIndex, /entries: 9/);

assert.match(editorial, /standaloneLoreArticles/);
assert.match(editorial, /section === "lore"/);
assert.match(editorial, /paragraph\.startsWith\("## "\)/);
assert.match(snapshotPage, /Snapshot de Conhecimento RuneForge/);
assert.match(snapshotPage, /standaloneKnowledgeSource/);
assert.match(snapshotPage, /getStandaloneLoreSnapshotInfo/);

console.log("KNOWLEDGE SNAPSHOT: PASS — 446 cards · 20 keywords · 9 rule contracts · Vanilla · RuneForge Book I v0.3 with 9 lore entries");
