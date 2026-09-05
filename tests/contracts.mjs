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

console.log("PORTAL CONTRACT: PASS — CMS 2.1 · six editorial sections · live public card catalog/detail · no duplicate game authority");
