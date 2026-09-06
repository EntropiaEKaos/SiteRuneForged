import { test, expect } from "@playwright/test";

for (const viewport of [
  { name: "desktop", width: 1440, height: 1100 },
  { name: "mobile", width: 390, height: 844 },
]) {
  test(`home visual ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("http://127.0.0.1:3000", { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toContainText("Forje sua lenda");
    await expect(page.locator("#regions .region-card")).toHaveCount(6);
    await expect(page.locator("#cards")).toBeVisible();
    await expect(page.locator('#alpha a[href="/alpha"]')).toBeVisible();
    await page.screenshot({ path: `visual-evidence/home-${viewport.name}.png`, fullPage: true });
  });

  test(`admin visual ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("http://127.0.0.1:3000/admin", { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toContainText("Controle total");
    await expect(page.getByText("RECURSOS", { exact: true })).toBeVisible();
    await expect(page.getByText("Home", { exact: true })).toBeVisible();
    await expect(page.getByText("Roadmap", { exact: true })).toBeVisible();
    await page.screenshot({ path: `visual-evidence/admin-${viewport.name}.png`, fullPage: true });
  });

  test(`news visual ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("http://127.0.0.1:3000/news", { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toContainText("Novidades da Forja");
    await expect(page.locator(".content-card")).toHaveCount(2);
    await page.screenshot({ path: `visual-evidence/news-${viewport.name}.png`, fullPage: true });
  });

  test(`rules intelligence resilience ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("http://127.0.0.1:3000/rules", { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toContainText("Regras & Como Jogar");
    await expect(page.locator(".rules-contract-unavailable")).toContainText("CONTRATOS DA ENGINE INDISPONÍVEIS");
    await expect(page.locator(".rules-editorial-grid .content-card")).toHaveCount(3);
    await expect(page.getByText("Fundamentos do duelo", { exact: true })).toBeVisible();
    await page.screenshot({ path: `visual-evidence/rules-intelligence-resilience-${viewport.name}.png`, fullPage: true });
  });

  test(`rules article visual ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("http://127.0.0.1:3000/rules/fundamentos", { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toContainText("Fundamentos do duelo");
    await expect(page.locator(".article-body")).toBeVisible();
    await page.screenshot({ path: `visual-evidence/rules-article-${viewport.name}.png`, fullPage: true });
  });

  test(`cards unavailable visual ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("http://127.0.0.1:3000/cards", { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toContainText("Catálogo de cartas");
    await expect(page.locator(".card-catalog-empty")).toContainText("não respondeu");
    await page.screenshot({ path: `visual-evidence/cards-unavailable-${viewport.name}.png`, fullPage: true });
  });

  test(`card detail unavailable visual ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("http://127.0.0.1:3000/cards/visual-fixture", { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toContainText("Não foi possível abrir esta carta");
    await page.screenshot({ path: `visual-evidence/card-detail-unavailable-${viewport.name}.png`, fullPage: true });
  });

  test(`collections unavailable visual ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("http://127.0.0.1:3000/collections", { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toContainText("Coleções de RuneForge");
    await expect(page.locator(".card-catalog-empty")).toContainText("coleções não responderam");
    await page.screenshot({ path: `visual-evidence/collections-unavailable-${viewport.name}.png`, fullPage: true });
  });

  test(`collection detail unavailable visual ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("http://127.0.0.1:3000/collections/visual-fixture", { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toContainText("Não foi possível abrir esta coleção");
    await page.screenshot({ path: `visual-evidence/collection-detail-unavailable-${viewport.name}.png`, fullPage: true });
  });

  test(`regions visual ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("http://127.0.0.1:3000/regions", { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toContainText("Seis regiões");
    await expect(page.locator(".region-live-card")).toHaveCount(6);
    await page.screenshot({ path: `visual-evidence/regions-${viewport.name}.png`, fullPage: true });
  });

  test(`region detail visual ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("http://127.0.0.1:3000/regions/emberhold", { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toContainText("Emberhold");
    await expect(page.locator(".region-catalog-unavailable")).toContainText("catálogo de cartas");
    await page.screenshot({ path: `visual-evidence/region-detail-${viewport.name}.png`, fullPage: true });
  });

  test(`keywords unavailable visual ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("http://127.0.0.1:3000/keywords", { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toContainText("Keywords & Mecânicas");
    await expect(page.locator(".card-catalog-empty")).toContainText("mecânicas não responderam");
    await page.screenshot({ path: `visual-evidence/keywords-unavailable-${viewport.name}.png`, fullPage: true });
  });

  test(`alpha launch unavailable visual ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("http://127.0.0.1:3000/alpha", { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toContainText("Entre na forja");
    await expect(page.locator(".alpha-runtime-unavailable")).toContainText("STATUS INDISPONÍVEL");
    await expect(page.locator(".alpha-readiness-unavailable")).toContainText("Não foi possível carregar");
    await expect(page.locator(".alpha-build-unavailable")).toContainText("PROVENANCE INDISPONÍVEL");
    await expect(page.locator(".alpha-release-panel")).toHaveAttribute(
      "data-portal-deploy-sha",
      process.env.RUNEFORGE_PORTAL_DEPLOY_SHA || "",
    );
    await expect(page.locator(".alpha-release-panel")).toHaveAttribute(
      "data-portal-deploy-environment",
      process.env.RUNEFORGE_PORTAL_DEPLOY_ENV || "",
    );
    await expect(page.locator(".alpha-boundary-grid article")).toHaveCount(3);
    await page.screenshot({ path: `visual-evidence/alpha-launch-unavailable-${viewport.name}.png`, fullPage: true });
  });

  test(`keyword detail unavailable visual ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("http://127.0.0.1:3000/keywords/Flying", { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toContainText("Não foi possível abrir esta mecânica");
    await page.screenshot({ path: `visual-evidence/keyword-detail-unavailable-${viewport.name}.png`, fullPage: true });
  });
}


test("portal deployment provenance API", async ({ request }) => {
  const response = await request.get("http://127.0.0.1:3000/api/public/portal/deployment/provenance");
  expect(response.status()).toBe(200);
  expect(response.headers()["cache-control"] || "").toContain("no-store");
  const body = await response.json();
  expect(body.ok).toBe(true);
  expect(body.portal.schemaVersion).toBe(1);
  expect(body.portal.application).toBe("SiteRuneForged");
  expect(body.portal.commitSha).toBe(process.env.RUNEFORGE_PORTAL_DEPLOY_SHA);
  expect(body.portal.commitShort).toBe((process.env.RUNEFORGE_PORTAL_DEPLOY_SHA || "").slice(0, 12));
  expect(body.portal.environment).toBe(process.env.RUNEFORGE_PORTAL_DEPLOY_ENV);
});
