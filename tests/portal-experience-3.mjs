import assert from "node:assert/strict";
import fs from "node:fs";

const read = (path) => fs.readFileSync(path, "utf8");
const exists = (path) => assert.ok(fs.existsSync(path), `missing ${path}`);

const home = read("src/app/page.tsx");
const cards = read("src/app/cards/page.tsx");
const cardDetail = read("src/app/cards/[defId]/page.tsx");
const publicCards = read("src/lib/cards/public-catalog.ts");
const collectionDetail = read("src/app/collections/[slug]/page.tsx");
const regionDetail = read("src/app/regions/[region]/page.tsx");
const admin = read("src/app/admin/page.tsx");
const adminDirectory = read("src/app/admin/AdminResourceDirectory.tsx");
const editor = read("src/app/admin/[resource]/ResourceEditor.tsx");
const layout = read("src/app/layout.tsx");
const seo = read("src/lib/portal/seo.ts");
const analytics = read("src/components/PortalAnalytics.tsx");
const analyticsRoute = read("src/app/api/public/portal/analytics/route.ts");
const sitemap = read("src/app/sitemap.ts");
const robots = read("src/app/robots.ts");
const editorial = read("src/components/PortalEditorial.tsx");
const css = read("src/app/portal-v3.css");
const docs = read("docs/PORTAL-EXPERIENCE-3-0.md");

// Homepage 3.0 — CMS remains authoritative while discovery consumes public data.
assert.match(home, /getPublishedContent<HomeContent>/);
assert.match(home, /getPublicCardCatalog/);
assert.match(home, /getPublicCollections/);
assert.match(home, /getPublishedList<EditorialPayload>/);
assert.match(home, /application\/ld\+json/);
assert.match(home, /Card Explorer/);
assert.match(home, /home-live-cards/);
assert.match(home, /home-foundation/);
assert.match(home, /home-news-grid/);

// Card Explorer 2.0 — shareable GET filters, advanced public facets and list/grid display.
for (const field of ["keyword", "race", "class", "minCost", "maxCost", "sort"]) {
  assert.match(cards, new RegExp(`name=\\"${field}\\"`), `missing Explorer field ${field}`);
}
assert.match(cards, /method="get"/);
assert.match(cards, /catalog-filter-chip/);
assert.match(cards, /data-view=\{view\}/);
assert.match(cards, /facets\.races/);
assert.match(cards, /facets\.classes/);
assert.match(cards, /breakdown\?\.regions/);
assert.match(publicCards, /race\?: string/);
assert.match(publicCards, /class\?: string/);
assert.match(publicCards, /minCost\?: string \| number/);
assert.match(publicCards, /maxCost\?: string \| number/);
assert.match(publicCards, /sortCards/);
assert.match(publicCards, /breakdown/);
assert.match(publicCards, /normalizeApiResponse/);
assert.match(cardDetail, /generateMetadata/);
assert.match(cardDetail, /ShareCardButton/);
assert.match(cardDetail, /CONTINUE EXPLORANDO/);
exists("src/components/ShareCardButton.tsx");

// Collection + region identity intelligence derives from the filtered public result.
assert.match(collectionDetail, /DISTRIBUIÇÃO POR REGIÃO/);
assert.match(collectionDetail, /DISTRIBUIÇÃO POR RARIDADE/);
assert.match(collectionDetail, /CURVA DE MANA/);
assert.match(collectionDetail, /generateMetadata/);
assert.match(regionDetail, /TIPOS DE CARTA/);
assert.match(regionDetail, /RARIDADES/);
assert.match(regionDetail, /CURVA DE MANA/);
assert.match(regionDetail, /generateMetadata/);

// Portal Admin UX 2.0 must improve workflow without weakening optimistic concurrency.
assert.match(admin, /AdminResourceDirectory/);
assert.match(adminDirectory, /Buscar recurso/);
assert.match(adminDirectory, /Experiência/);
assert.match(adminDirectory, /Live Ops/);
assert.match(editor, /expectedVersion/);
assert.match(editor, /response\.status === 409/);
assert.match(editor, /localStorage\.setItem/);
assert.match(editor, /beforeunload/);
assert.match(editor, /event\.ctrlKey \|\| event\.metaKey/);
assert.match(editor, /confirm\(`Confirma que deseja/);
assert.match(editor, /Preview/);
assert.doesNotMatch(editor, /localStorage.*cookie|localStorage.*token|localStorage.*password/i);
exists("src/app/admin/AdminResourceDirectory.module.css");

// SEO + sharing — one helper, per-route metadata and complete standalone indexability.
assert.match(layout, /metadataBase/);
assert.match(layout, /PortalAnalytics/);
assert.match(layout, /portal-v3\.css/);
assert.match(seo, /VERCEL_PROJECT_PRODUCTION_URL/);
assert.match(seo, /alternates: \{ canonical \}/);
assert.match(seo, /openGraph/);
assert.match(seo, /twitter/);
assert.match(editorial, /getPortalSectionMetadata/);
assert.match(editorial, /getPortalArticleMetadata/);
assert.match(sitemap, /card-catalog-snapshot\.json/);
assert.match(sitemap, /snapshot\.cards/);
assert.match(robots, /\/admin\//);
assert.match(robots, /\/api\/portal-admin\//);
for (const path of ["src/app/opengraph-image.tsx", "src/app/sitemap.ts", "src/app/robots.ts", "src/lib/portal/seo.ts"]) exists(path);

// Observability — first party, bounded and deliberately anonymous.
assert.match(analytics, /page_view/);
assert.match(analytics, /interaction/);
assert.match(analytics, /web_vital/);
assert.doesNotMatch(analytics, /useSearchParams|window\.location\.search|cookie|userId|playerId/i);
assert.match(analyticsRoute, /raw\.length > 2048/);
assert.match(analyticsRoute, /allowedTypes/);
assert.match(analyticsRoute, /path\.startsWith\("\/admin"\)/);
assert.match(analyticsRoute, /Cache-Control.*no-store/s);
assert.doesNotMatch(analyticsRoute, /cookie|authorization|user-agent|x-forwarded-for|ip address/i);
exists("src/app/api/public/portal/analytics/route.ts");

// Visual layer stays isolated from the already-certified mobile navigation CSS.
assert.match(css, /Portal Experience 3\.0/);
assert.match(css, /hero-command-card/);
assert.match(css, /catalog-filters-advanced/);
assert.match(css, /identity-intelligence/);
assert.match(docs, /Portal Admin UX 2\.0/);
assert.match(docs, /Homepage 3\.0/);
assert.match(docs, /Card Explorer 2\.0/);
assert.match(docs, /Observabilidade/);

console.log("PORTAL EXPERIENCE 3.0: PASS — Admin UX 2.0 · Homepage 3.0 · Explorer 2.0 · identities · SEO/share · anonymous observability");
