import assert from "node:assert/strict";
import fs from "node:fs";

const read = (path) => fs.readFileSync(path, "utf8");

const editor = read("src/app/admin/[resource]/ResourceEditor.tsx");
const proxy = read("src/app/api/portal-admin/site/[...path]/route.ts");
const session = read("src/app/api/portal-admin/session/route.ts");
const adminClient = read("src/lib/runeforge-api/admin-client.ts");
const publicContent = read("src/lib/cms/public-content.ts");
const publicSections = read("src/lib/cms/public-sections.ts");
const editorial = read("src/components/PortalEditorial.tsx");
const contentModel = read("src/lib/cms/content-model.ts");
const docs = read("docs/ADMIN_CMS.md");
const adminPage = read("src/app/admin/page.tsx");
const publicCards = read("src/lib/cards/public-catalog.ts");
const cardsIndex = read("src/app/cards/page.tsx");
const cardDetail = read("src/app/cards/[defId]/page.tsx");
const publicCollections = read("src/lib/collections/public-collections.ts");
const collectionsIndex = read("src/app/collections/page.tsx");
const collectionDetail = read("src/app/collections/[slug]/page.tsx");
const regionsIndex = read("src/app/regions/page.tsx");
const regionDetail = read("src/app/regions/[region]/page.tsx");
const publicKeywords = read("src/lib/keywords/public-keywords.ts");
const keywordsIndex = read("src/app/keywords/page.tsx");
const keywordDetail = read("src/app/keywords/[key]/page.tsx");
const publicRules = read("src/lib/rules/public-rules.ts");
const rulesIndex = read("src/app/rules/page.tsx");
const rulesCss = read("src/app/rules/rules-intelligence.css");
const publicAlpha = read("src/lib/alpha/public-alpha.ts");
const apiClient = read("src/lib/runeforge-api/client.ts");
const alphaPage = read("src/app/alpha/page.tsx");
const alphaOrigin = read("src/lib/runeforge-api/public-origin.ts");
const homePage = read("src/app/page.tsx");
const fullStackWorkflow = read(".github/workflows/full-stack-integration.yml");
const fullStackScript = read("scripts/full-stack-integration.mjs");

assert.match(editor, /const expectedVersion = item\?\.version \?\? 0/);
assert.ok((editor.match(/expectedVersion/g) || []).length >= 5, "all create/update/lifecycle mutations must carry expectedVersion");
assert.match(editor, /response\.status === 409/);
assert.match(editor, /Seu JSON local foi preservado/);
assert.match(editor, /conflictVersion !== null/);
assert.match(editor, /rollback\/\$\{version\}/);

assert.match(adminClient, /^import "server-only";/);
assert.match(adminClient, /SiteLifecycleRequest/);
assert.match(adminClient, /expectedVersion: number/);
assert.match(adminClient, /\/publish/);
assert.match(adminClient, /\/archive/);
assert.match(adminClient, /\/rollback\//);
assert.ok((adminClient.match(/body: JSON\.stringify\(request\)/g) || []).length >= 3);

assert.match(proxy, /Cookie: cookie/);
assert.doesNotMatch(proxy, /Bearer|Authorization/);
assert.match(session, /Set-Cookie/);
assert.match(publicContent, /\/api\/public\/site\//);
assert.match(publicContent, /getPublishedList/);
assert.match(publicContent, /getPublishedItem/);
assert.match(publicContent, /getPublishedItemOrNull/);
assert.match(publicContent, /error\.status === 404/);
assert.match(publicContent, /Array\.isArray\(response\.items\)/);
assert.match(editorial, /getPublishedList/);
assert.match(editorial, /getPublishedItemOrNull/);
assert.match(editorial, /notFound/);

for (const section of ["news", "lore", "rules", "collections", "events", "roadmap"]) {
  assert.ok(publicSections.includes(`${section}:`), `missing public section config ${section}`);
  assert.ok(fs.existsSync(`src/app/${section}/page.tsx`), `missing public index route ${section}`);
  assert.ok(fs.existsSync(`src/app/${section}/[slug]/page.tsx`), `missing public detail route ${section}`);
}

const expectedResources = [
  "home", "navigation", "pages", "cards", "collections", "regions", "keywords", "rules",
  "lore", "news", "media", "seo", "alpha", "events", "promotions", "roadmap",
];
for (const resource of expectedResources) {
  assert.ok(contentModel.includes(`key: "${resource}"`), `missing portal resource ${resource}`);
}

assert.doesNotMatch(docs, /PR #86|feat\/site-cms-api/);
assert.doesNotMatch(adminPage, /PR #86|>86</);
assert.match(docs, /expectedVersion/);
assert.match(docs, /409/);

assert.match(publicCards, /\/api\/public\/game\/cards/);
assert.match(publicCards, /getPublicCardCatalog/);
assert.match(publicCards, /getPublicCard/);
assert.match(publicCards, /error\.status === 404/);
assert.doesNotMatch(publicCards, /admin|Bearer|Authorization|spell|mechanics/);
assert.match(cardsIndex, /getPublicCardCatalog/);
assert.match(cardsIndex, /card-catalog-empty/);
assert.match(cardsIndex, /collection/);
assert.match(cardDetail, /getPublicCard/);
assert.match(cardDetail, /notFound/);
assert.ok(fs.existsSync("src/app/cards/page.tsx"));
assert.ok(fs.existsSync("src/app/cards/[defId]/page.tsx"));

assert.match(publicCollections, /\/api\/collections/);
assert.match(publicCollections, /getPublicCollections/);
assert.match(publicCollections, /getPublicCollection/);
assert.doesNotMatch(publicCollections, /admin|Bearer|Authorization/);
assert.match(collectionsIndex, /getPublicCollections/);
assert.match(collectionsIndex, /cardCount/);
assert.match(collectionDetail, /getPublicCollection/);
assert.match(collectionDetail, /getPublicCardCatalog/);
assert.match(collectionDetail, /collection: collection\.key/);
assert.match(collectionDetail, /notFound/);

assert.match(regionsIndex, /getPublishedContent<RegionShowcaseContent>/);
assert.match(regionsIndex, /getPublicCardCatalog/);
assert.match(regionsIndex, /facets\.regions/);
assert.match(regionDetail, /getPublishedContent<RegionShowcaseContent>/);
assert.match(regionDetail, /getPublicCardCatalog/);
assert.match(regionDetail, /region: region\.name/);
assert.match(regionDetail, /notFound/);
assert.ok(fs.existsSync("src/app/regions/page.tsx"));
assert.ok(fs.existsSync("src/app/regions/[region]/page.tsx"));

assert.match(publicKeywords, /\/api\/public\/game\/keywords/);
assert.match(publicKeywords, /getPublicKeywords/);
assert.match(publicKeywords, /getPublicKeyword/);
assert.doesNotMatch(publicKeywords, /admin|Bearer|Authorization|behavior|effect|condition/);
assert.match(keywordsIndex, /getPublicKeywords/);
assert.match(keywordsIndex, /source === "canonical"/);
assert.match(keywordsIndex, /cardCount/);
assert.match(keywordDetail, /getPublicKeyword/);
assert.match(keywordDetail, /getPublicCardCatalog/);
assert.match(keywordDetail, /keyword: keyword\.key/);
assert.match(keywordDetail, /notFound/);
assert.match(cardsIndex, /name="keyword"/);
assert.match(cardsIndex, /facets\.keywords/);
assert.match(cardDetail, /\/keywords\/\$\{encodeURIComponent\(keyword\)\}/);
assert.ok(fs.existsSync("src/app/keywords/page.tsx"));
assert.ok(fs.existsSync("src/app/keywords/[key]/page.tsx"));

assert.match(publicRules, /\/api\/public\/game\/rules\/contracts/);
assert.match(publicRules, /getPublicRulesContracts/);
assert.match(publicRules, /countsAsSpellCast/);
assert.doesNotMatch(publicRules, /admin|Bearer|Authorization|CardEffect|effect graph|mechanics AST/);
assert.match(rulesIndex, /getPublicRulesContracts/);
assert.match(rulesIndex, /getPublishedList<EditorialPayload>/);
assert.match(rulesIndex, /rules-semantic-grid/);
assert.match(rulesIndex, /rules-structural-grid/);
assert.match(rulesIndex, /rules-contract-unavailable/);
assert.match(rulesIndex, /contracts\.data\.semantic/);
assert.match(rulesIndex, /contracts\.data\.structural/);
assert.match(rulesIndex, /\/cards\?type=/);
assert.match(rulesIndex, /rules-intelligence\.css/);
assert.match(rulesCss, /rule-contract-card/);
assert.ok(fs.existsSync("src/app/rules/rules-intelligence.css"));

assert.match(publicAlpha, /\/api\/public\/game\/alpha\/readiness/);
assert.match(publicAlpha, /getPublicAlphaReadiness/);
assert.match(publicAlpha, /apiGetFresh/);
assert.match(apiClient, /export async function apiGetFresh/);
assert.match(apiClient, /cache: "no-store"/);
assert.doesNotMatch(publicAlpha, /admin|Bearer|Authorization|economy|matchmaking/);
assert.match(alphaOrigin, /^import "server-only";/);
assert.match(alphaOrigin, /RUNEFORGE_GAME_URL/);
assert.match(alphaOrigin, /RUNEFORGE_API_URL/);
assert.doesNotMatch(alphaOrigin, /NEXT_PUBLIC_/);
assert.match(alphaPage, /getPublishedContent<AlphaLaunchContent>\("alpha", "main"/);
assert.match(alphaPage, /getPublicAlphaReadiness/);
assert.match(alphaPage, /getRuneForgeGameHref/);
assert.match(alphaPage, /alpha-runtime-status/);
assert.match(alphaPage, /alpha-capability-card/);
assert.match(alphaPage, /rankedOperational/);
assert.match(alphaPage, /Dinheiro real/);
assert.match(alphaPage, /Live Ops em escala/);
assert.match(homePage, /getPublishedContent<AlphaLaunchContent>\("alpha", "main"/);
assert.match(homePage, /href="\/alpha"/);
assert.ok(fs.existsSync("src/app/alpha/page.tsx"));
assert.ok(fs.existsSync("src/app/alpha/alpha-launch.css"));

assert.match(fullStackWorkflow, /EntropiaEKaos\/RuneForgedTCG/);
assert.match(fullStackWorkflow, /RUNEFORGE_BACKEND_REF:\s*b61364ad51c7886cdad1183eec665068570672fc/);
assert.match(fullStackWorkflow, /postgres:17-alpine/);
assert.match(fullStackWorkflow, /RUNEFORGE_API_URL=http:\/\/127\.0\.0\.1:3001/);
assert.match(fullStackWorkflow, /RUNEFORGE_GAME_URL=http:\/\/127\.0\.0\.1:3001/);
assert.match(fullStackWorkflow, /full-stack-integration\.mjs/);
assert.match(fullStackScript, /collection cardCount must equal the public card catalog projection/);
assert.match(fullStackScript, /\.catalog-card/);
assert.match(fullStackScript, /\.collection-card-live/);
assert.match(fullStackScript, /\.region-live-card/);
assert.match(fullStackScript, /\/api\/public\/game\/keywords/);
assert.match(fullStackScript, /keyword cardCount must equal exact public catalog filter/);
assert.match(fullStackScript, /\.keyword-card/);
assert.match(fullStackScript, /\/api\/public\/game\/rules\/contracts/);
assert.match(fullStackScript, /public rules must expose six structural contracts/);
assert.match(fullStackScript, /public rules must expose three certified semantic contracts/);
assert.match(fullStackScript, /\.rules-semantic-grid/);
assert.match(fullStackScript, /\.rules-structural-grid/);
assert.match(fullStackScript, /\/api\/public\/game\/alpha\/readiness/);
assert.match(fullStackScript, /certified Alpha scope must expose seven capabilities/);
assert.match(fullStackScript, /\.alpha-capability-card/);
assert.match(fullStackScript, /\.alpha-runtime-ready/);
assert.match(fullStackScript, /integration-evidence/);

console.log("PORTAL CONTRACT: PASS — CMS 2.1 · live cards/collections/regions/keywords/rules/alpha · pinned cross-repo integration gate · no duplicate game authority");
