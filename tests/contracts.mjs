import assert from "node:assert/strict";
import fs from "node:fs";

const read = (path) => fs.readFileSync(path, "utf8");
const packageJson = JSON.parse(read("package.json"));
const packageLock = JSON.parse(read("package-lock.json"));
const nvmrc = read(".nvmrc").trim();
const webWorkflow = read(".github/workflows/ci.yml");
const vercelConfig = JSON.parse(read("vercel.json"));
const portalRequestSecurity = read("src/lib/portal/request-security.ts");
const portalMiddleware = read("src/middleware.ts");
const nextConfig = read("next.config.ts");

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
const standaloneCardSnapshot = JSON.parse(read("src/data/card-catalog-snapshot.json"));
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
const publicDeployment = read("src/lib/alpha/public-deployment.ts");
const apiClient = read("src/lib/runeforge-api/client.ts");
const alphaPage = read("src/app/alpha/page.tsx");
const alphaOrigin = read("src/lib/runeforge-api/public-origin.ts");
const homePage = read("src/app/page.tsx");
const fullStackWorkflow = read(".github/workflows/full-stack-integration.yml");
const fullStackScript = read("scripts/full-stack-integration.mjs");
const productionSmokeWorkflow = read(".github/workflows/production-alpha-smoke.yml");
const productionSmokeScript = read("scripts/production-alpha-smoke.mjs");
const adminResourcePage = read("src/app/admin/[resource]/page.tsx");
const portalDeployment = read("src/lib/portal/deployment-provenance.ts");
const portalDeploymentRoute = read("src/app/api/public/portal/deployment/provenance/route.ts");
const portalReleasePreflight = read("scripts/portal-release-preflight.mjs");

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

// Portal Control BFF hardening: browser-origin enforcement + streamed body ceilings.
assert.match(portalRequestSecurity, /portalMutationOriginAllowed/);
assert.match(portalRequestSecurity, /sec-fetch-site/);
assert.match(portalRequestSecurity, /request\.headers\.get\("host"\)/);
assert.match(portalRequestSecurity, /x-forwarded-proto/);
assert.match(portalRequestSecurity, /parsedOrigin\.host === host/);
assert.match(portalRequestSecurity, /parsedOrigin\.protocol === protocol/);
assert.match(portalRequestSecurity, /PortalRequestBodyTooLargeError/);
assert.match(portalRequestSecurity, /request\.body\.getReader\(\)/);
assert.match(portalRequestSecurity, /total > maxBytes/);
assert.match(proxy, /MAX_PORTAL_ADMIN_BODY_BYTES = 512 \* 1024/);
assert.match(proxy, /portalMutationOriginAllowed\(req\)/);
assert.match(proxy, /readPortalBoundedText\(req, MAX_PORTAL_ADMIN_BODY_BYTES\)/);
assert.match(proxy, /Cross-origin portal admin mutation rejected/);
assert.match(proxy, /status, headers: \{ "Cache-Control": "no-store"/);
assert.match(session, /MAX_PORTAL_LOGIN_BODY_BYTES = 16 \* 1024/);
assert.match(session, /portalMutationOriginAllowed\(req\)/);
assert.match(session, /readPortalBoundedText\(req, MAX_PORTAL_LOGIN_BODY_BYTES\)/);
assert.match(session, /Cross-origin portal admin mutation rejected/);
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
assert.match(publicCards, /card-catalog-snapshot\.json/);
assert.match(publicCards, /source: "snapshot"/);
assert.match(publicCards, /querySnapshot/);
assert.match(publicCards, /getStandaloneCardSnapshotInfo/);
assert.equal(standaloneCardSnapshot.schemaVersion, 1);
assert.equal(standaloneCardSnapshot.source.commitSha, "4028da3999c168fa43e55c967d2d9cf90d30ebb1");
assert.equal(standaloneCardSnapshot.source.release, "2.97.0");
assert.equal(standaloneCardSnapshot.source.total, 446);
assert.equal(standaloneCardSnapshot.cards.length, 446);
assert.equal(new Set(standaloneCardSnapshot.cards.map((card) => card.defId)).size, 446);
assert.ok(standaloneCardSnapshot.cards.every((card) => card.collection?.key === "vanilla"));
assert.match(publicCards, /getPublicCard/);
assert.match(publicCards, /error\.status === 404/);
assert.doesNotMatch(publicCards, /admin|Bearer|Authorization|spell|mechanics/);
assert.match(cardsIndex, /getPublicCardCatalog/);
assert.match(cardsIndex, /card-catalog-empty/);
assert.match(cardsIndex, /data-catalog-source/);
assert.match(cardsIndex, /Modo standalone/);
assert.match(cardDetail, /data-card-source/);
assert.match(cardDetail, /SNAPSHOT CERTIFICADO/);
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
assert.match(publicDeployment, /^import "server-only";/);
assert.match(publicDeployment, /\/api\/public\/game\/deployment\/provenance/);
assert.match(publicDeployment, /RUNEFORGE_EXPECTED_DEPLOY_SHA/);
assert.match(publicDeployment, /\^\[0-9a-f\]\{40\}\$/);
assert.match(publicDeployment, /"verified"/);
assert.match(publicDeployment, /"mismatch"/);
assert.match(publicDeployment, /"invalid-config"/);
assert.doesNotMatch(publicDeployment, /admin|Bearer|Authorization|DATABASE_URL|SECRET|PAYMENT_/);
assert.doesNotMatch(publicDeployment, /4028da3999c168fa43e55c967d2d9cf90d30ebb1/);
assert.match(alphaOrigin, /^import "server-only";/);
assert.match(alphaOrigin, /RUNEFORGE_GAME_URL/);
assert.match(alphaOrigin, /RUNEFORGE_API_URL/);
assert.doesNotMatch(alphaOrigin, /NEXT_PUBLIC_/);
assert.match(alphaPage, /getPublishedContent<AlphaLaunchContent>\("alpha", "main"/);
assert.match(alphaPage, /getPublicAlphaReadiness/);
assert.match(alphaPage, /getPublicDeploymentProvenance/);
assert.match(alphaPage, /data-deploy-sha/);
assert.match(alphaPage, /data-deploy-verification/);
assert.match(alphaPage, /data-portal-deploy-sha/);
assert.match(alphaPage, /data-portal-deploy-environment/);
assert.match(alphaPage, /Portal commit/);
assert.match(alphaPage, /Portal env/);
assert.match(alphaPage, /alpha-build-verification/);
assert.match(alphaPage, /provenanceBlocksLaunch/);
assert.doesNotMatch(alphaPage, /4028da3999c168fa43e55c967d2d9cf90d30ebb1/);
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
const backendRef = fullStackWorkflow.match(/RUNEFORGE_BACKEND_REF:\s*([0-9a-f]{40})/)?.[1];
const deploySha = fullStackWorkflow.match(/RUNEFORGE_DEPLOY_SHA:\s*([0-9a-f]{40})/)?.[1];
const expectedDeploySha = fullStackWorkflow.match(/RUNEFORGE_EXPECTED_DEPLOY_SHA:\s*([0-9a-f]{40})/)?.[1];
assert.equal(backendRef, "4028da3999c168fa43e55c967d2d9cf90d30ebb1", "full-stack gate must pin the definitive certified backend main SHA");
assert.equal(deploySha, backendRef, "backend runtime provenance SHA must equal checkout ref");
assert.equal(expectedDeploySha, backendRef, "portal expected SHA must equal certified backend checkout ref");
assert.match(fullStackWorkflow, /RUNEFORGE_DEPLOY_ENV:\s*alpha/);
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
assert.match(fullStackScript, /\/api\/public\/game\/deployment\/provenance/);
assert.match(fullStackScript, /backend provenance must report the exact certified backend SHA/);
assert.match(fullStackScript, /RUNEFORGE_INTEGRATION_EXPECTED_PORTAL_SHA/);
assert.match(fullStackScript, /\/api\/public\/portal\/deployment\/provenance/);
assert.match(fullStackScript, /portal provenance must report the exact checked-out portal SHA/);
assert.match(fullStackScript, /\.alpha-build-verified/);
assert.match(fullStackScript, /data-deploy-sha/);
assert.match(fullStackScript, /data-deploy-verification/);
assert.match(fullStackScript, /certified Alpha scope must expose seven capabilities/);
assert.match(fullStackScript, /\.alpha-capability-card/);
assert.match(fullStackScript, /\.alpha-runtime-ready/);
assert.match(fullStackScript, /integration-evidence/);

assert.match(productionSmokeWorkflow, /workflow_dispatch:/);
assert.doesNotMatch(productionSmokeWorkflow, /^\s*push:/m);
assert.doesNotMatch(productionSmokeWorkflow, /^\s*pull_request:/m);
for (const input of ["site_url", "game_url", "expected_portal_sha", "expected_portal_environment", "expected_game_sha", "expected_game_environment"]) {
  assert.ok(productionSmokeWorkflow.includes(`${input}:`), `production smoke workflow must require input ${input}`);
}
assert.match(productionSmokeWorkflow, /node scripts\/production-alpha-smoke\.mjs/);
assert.match(productionSmokeWorkflow, /production-alpha-smoke-\$\{\{ inputs\.expected_portal_sha \}\}-\$\{\{ inputs\.expected_game_sha \}\}/);
assert.match(productionSmokeWorkflow, /retention-days:\s*90/);
assert.doesNotMatch(productionSmokeWorkflow, /RUNEFORGE_SMOKE_ALLOW_HTTP/);
assert.doesNotMatch(productionSmokeWorkflow, /RANKED_RELEASE_CERTIFIED:\s*["']?true|PAYMENT_|MERCADO_PAGO/);

assert.match(productionSmokeScript, /RUNEFORGE_SMOKE_EXPECTED_PORTAL_SHA/);
assert.match(productionSmokeScript, /RUNEFORGE_SMOKE_EXPECTED_PORTAL_ENV/);
assert.match(productionSmokeScript, /RUNEFORGE_SMOKE_EXPECTED_GAME_SHA/);
assert.match(productionSmokeScript, /\/api\/public\/portal\/deployment\/provenance/);
assert.match(productionSmokeScript, /live portal SHA must equal the certified expected SHA/);
assert.match(productionSmokeScript, /Production Alpha Smoke 1\.1/);
assert.match(productionSmokeScript, /\^\[0-9a-f\]\{40\}\$/);
assert.match(productionSmokeScript, /must use HTTPS for production smoke certification/);
assert.match(productionSmokeScript, /must not use a loopback host/);
assert.match(productionSmokeScript, /RUNEFORGE_SMOKE_ALLOW_HTTP === "true"/);
assert.match(productionSmokeScript, /\/api\/public\/game\/alpha\/readiness/);
assert.match(productionSmokeScript, /\/api\/public\/game\/deployment\/provenance/);
assert.match(productionSmokeScript, /cache-control/);
assert.match(productionSmokeScript, /rankedOperational/);
assert.match(productionSmokeScript, /\.alpha-build-verified/);
assert.match(productionSmokeScript, /data-deploy-verification/);
assert.match(productionSmokeScript, /a\.alpha-play-cta/);
assert.match(productionSmokeScript, /PRODUCTION ALPHA SMOKE: PASS/);
assert.doesNotMatch(productionSmokeScript, /ADMIN_|PAYMENT_|MERCADO_PAGO|Authorization|Bearer/);

assert.match(fullStackWorkflow, /RUNEFORGE_PORTAL_DEPLOY_SHA:\s*\$\{\{ github\.sha \}\}/);
assert.match(fullStackWorkflow, /RUNEFORGE_PORTAL_DEPLOY_ENV:\s*alpha/);
assert.match(fullStackWorkflow, /RUNEFORGE_INTEGRATION_EXPECTED_PORTAL_SHA="\$RUNEFORGE_PORTAL_DEPLOY_SHA"/);
assert.match(fullStackWorkflow, /RUNEFORGE_SMOKE_EXPECTED_PORTAL_SHA="\$RUNEFORGE_PORTAL_DEPLOY_SHA"/);
assert.match(fullStackWorkflow, /RUNEFORGE_SMOKE_EXPECTED_PORTAL_ENV=alpha/);
assert.match(fullStackWorkflow, /RUNEFORGE_SMOKE_ALLOW_HTTP=true/);
assert.match(fullStackWorkflow, /RUNEFORGE_SMOKE_EXPECTED_GAME_SHA="\$RUNEFORGE_BACKEND_REF"/);
assert.match(fullStackWorkflow, /node scripts\/production-alpha-smoke\.mjs/);
assert.match(fullStackWorkflow, /integration-evidence\/production-smoke/);


// Runtime and dependency reproducibility.
assert.equal(packageJson.engines?.node, "22.23.x");
assert.equal(packageJson.scripts?.["ci:install"], "npm ci --no-audit --no-fund");
assert.equal(packageJson.scripts?.["release:preflight"], "node scripts/portal-release-preflight.mjs");
assert.equal(packageJson.scripts?.["production:build"], "npm run release:preflight && npm run build");
assert.equal(nvmrc, "22.23.2");
assert.equal(packageJson.dependencies?.next, "15.5.25");
assert.equal(packageJson.dependencies?.react, "19.2.8");
assert.equal(packageJson.dependencies?.["react-dom"], "19.2.8");
assert.equal(packageJson.devDependencies?.["@playwright/test"], "1.63.0");
assert.equal(packageLock.lockfileVersion, 3);
assert.equal(packageLock.packages?.[""]?.dependencies?.next, packageJson.dependencies.next);
assert.equal(packageLock.packages?.[""]?.dependencies?.react, packageJson.dependencies.react);
assert.equal(packageLock.packages?.[""]?.dependencies?.["react-dom"], packageJson.dependencies["react-dom"]);
assert.equal(packageLock.packages?.[""]?.devDependencies?.["@playwright/test"], packageJson.devDependencies["@playwright/test"]);
assert.equal(packageLock.packages?.["node_modules/next"]?.version, "15.5.25");
assert.equal(packageLock.packages?.["node_modules/react"]?.version, "19.2.8");
assert.equal(packageLock.packages?.["node_modules/react-dom"]?.version, "19.2.8");
assert.equal(packageLock.packages?.["node_modules/@playwright/test"]?.version, "1.63.0");
assert.equal(fs.existsSync(".github/workflows/lockfile-bootstrap.yml"), false, "temporary lockfile bootstrap must never ship");

// Browser/transport hardening.
assert.match(portalMiddleware, /Content-Security-Policy/);
assert.match(portalMiddleware, /nonce-\$\{nonce\}/);
assert.match(portalMiddleware, /strict-dynamic/);
assert.match(portalMiddleware, /frame-ancestors 'none'/);
assert.match(portalMiddleware, /object-src 'none'/);
assert.match(portalMiddleware, /crypto\.randomUUID/);
for (const header of ["X-Content-Type-Options", "X-Frame-Options", "Referrer-Policy", "Permissions-Policy", "Cross-Origin-Opener-Policy", "Cross-Origin-Resource-Policy", "Strict-Transport-Security"]) {
  assert.ok(nextConfig.includes(header), `next.config.ts must retain security header ${header}`);
}
assert.match(nextConfig, /poweredByHeader:\s*false/);

// GitHub Actions are immutable-pinned, matching the game repository release posture.
for (const workflow of [webWorkflow, fullStackWorkflow, productionSmokeWorkflow]) {
  assert.doesNotMatch(workflow, /actions\/(?:checkout|setup-node|upload-artifact)@v\d+/);
}
assert.match(webWorkflow, /actions\/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1/);
assert.match(webWorkflow, /actions\/setup-node@820762786026740c76f36085b0efc47a31fe5020/);
assert.match(webWorkflow, /actions\/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0/);
assert.match(fullStackWorkflow, /actions\/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1/);
assert.match(fullStackWorkflow, /actions\/setup-node@820762786026740c76f36085b0efc47a31fe5020/);
assert.match(fullStackWorkflow, /actions\/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0/);
assert.match(productionSmokeWorkflow, /actions\/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1/);
assert.match(productionSmokeWorkflow, /actions\/setup-node@820762786026740c76f36085b0efc47a31fe5020/);
assert.match(productionSmokeWorkflow, /actions\/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0/);

assert.match(webWorkflow, /runs-on:\s*ubuntu-24\.04/);
assert.match(webWorkflow, /node-version:\s*22\.23\.2/);
assert.match(webWorkflow, /npm run ci:install/);
assert.match(webWorkflow, /RUNEFORGE_PORTAL_DEPLOY_SHA:\s*\$\{\{ github\.sha \}\}/);
assert.match(webWorkflow, /RUNEFORGE_PORTAL_DEPLOY_ENV:\s*ci/);
assert.match(webWorkflow, /npm run production:build/);
assert.match(webWorkflow, /VERCEL_GIT_COMMIT_SHA:\s*\$\{\{ github\.sha \}\}/);
assert.match(webWorkflow, /VERCEL_ENV:\s*preview/);
assert.match(webWorkflow, /Certify Vercel system identity fallback/);
assert.doesNotMatch(webWorkflow, /npm install(?:\s|$)/);

assert.match(fullStackWorkflow, /node-version:\s*22\.23\.2/);
assert.match(fullStackWorkflow, /working-directory:\s*portal\s*\n\s*run:\s*npm run ci:install/);
assert.doesNotMatch(fullStackWorkflow, /working-directory:\s*portal\s*\n\s*run:\s*npm install/);

assert.match(productionSmokeWorkflow, /node-version:\s*22\.23\.2/);
assert.match(productionSmokeWorkflow, /Install portal test runtime[\s\S]*?npm run ci:install/);
assert.doesNotMatch(productionSmokeWorkflow, /npm install(?:\s|$)/);

// Next 15 App Router request APIs remain async.
const asyncParamRoutes = [
  "src/app/admin/[resource]/page.tsx",
  "src/app/cards/[defId]/page.tsx",
  "src/app/collections/[slug]/page.tsx",
  "src/app/events/[slug]/page.tsx",
  "src/app/keywords/[key]/page.tsx",
  "src/app/lore/[slug]/page.tsx",
  "src/app/news/[slug]/page.tsx",
  "src/app/regions/[region]/page.tsx",
  "src/app/roadmap/[slug]/page.tsx",
  "src/app/rules/[slug]/page.tsx",
];
for (const route of asyncParamRoutes) {
  const source = read(route);
  assert.match(source, /params:\s*Promise</, `${route} must use async params on Next 15`);
  assert.match(source, /await params/, `${route} must await params on Next 15`);
}
assert.match(cardsIndex, /searchParams\?:\s*Promise<Search>/);
assert.match(cardsIndex, /await searchParams/);
assert.match(proxy, /params:\s*Promise<\{ path: string\[\] \}>/);
assert.match(proxy, /await ctx\.params/);
assert.match(adminResourcePage, /params:\s*Promise<\{ resource: string \}>/);


// SiteRuneForged self-provenance is public, bounded and fail-closed.
assert.match(portalDeployment, /^import "server-only";/);
assert.match(portalDeployment, /RUNEFORGE_PORTAL_DEPLOY_SHA/);
assert.match(portalDeployment, /RUNEFORGE_PORTAL_DEPLOY_ENV/);
assert.match(portalDeployment, /VERCEL_GIT_COMMIT_SHA/);
assert.match(portalDeployment, /VERCEL_ENV/);
assert.match(portalDeployment, /vercelEnvironment/);
assert.match(portalDeployment, /\^\[0-9a-f\]\{40\}\$/);
assert.match(portalDeployment, /SiteRuneForged/);
for (const environment of ["ci", "preview", "alpha", "staging", "production"]) {
  assert.ok(portalDeployment.includes(`"${environment}"`), `portal provenance must allow ${environment}`);
}
assert.doesNotMatch(portalDeployment, /DATABASE_URL|ADMIN_API|PAYMENT_|MERCADO_PAGO|Authorization|Bearer|SECRET|TOKEN/);

assert.match(portalDeploymentRoute, /dynamic = "force-dynamic"/);
assert.match(portalDeploymentRoute, /Cache-Control": "no-store"/);
assert.match(portalDeploymentRoute, /status: 503/);
assert.match(portalDeploymentRoute, /Retry-After": "5"/);
assert.match(portalDeploymentRoute, /getPortalDeploymentProvenance/);

assert.match(portalReleasePreflight, /RUNEFORGE_PORTAL_DEPLOY_SHA/);
assert.match(portalReleasePreflight, /RUNEFORGE_PORTAL_DEPLOY_ENV/);
assert.match(portalReleasePreflight, /GITHUB_SHA/);
assert.match(portalReleasePreflight, /VERCEL_GIT_COMMIT_SHA/);
assert.match(portalReleasePreflight, /VERCEL_ENV/);
assert.match(portalReleasePreflight, /source=\$\{source\}/);
assert.match(portalReleasePreflight, /GITHUB_SHA.*does not match VERCEL_GIT_COMMIT_SHA/);
assert.match(portalReleasePreflight, /PORTAL RELEASE PREFLIGHT: PASS/);
assert.match(portalReleasePreflight, /resolved portal SHA/);

assert.equal(vercelConfig.framework, "nextjs");
assert.equal(vercelConfig.installCommand, "npm run ci:install");
assert.equal(vercelConfig.buildCommand, "npm run production:build");
assert.equal(vercelConfig.$schema, "https://openapi.vercel.sh/vercel.json");

console.log("PORTAL CONTRACT: PASS — CMS 2.1 · standalone 446-card Vanilla snapshot · API-first fallback · Portal Admin hardening · immutable release chain");
