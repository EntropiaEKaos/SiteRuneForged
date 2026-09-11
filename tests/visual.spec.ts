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

  test(`rules standalone visual ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("http://127.0.0.1:3000/rules", { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toContainText("Regras & Como Jogar");
    await expect(page.locator(".rules-semantic-grid .rule-contract-card")).toHaveCount(3);
    await expect(page.locator(".rules-structural-grid .rule-contract-card")).toHaveCount(6);
    await expect(page.locator(".rules-editorial-grid .content-card")).toHaveCount(3);
    await expect(page.getByText("Fundamentos do duelo", { exact: true })).toBeVisible();
    await page.screenshot({ path: `visual-evidence/rules-standalone-${viewport.name}.png`, fullPage: true });
  });

  test(`rules article visual ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("http://127.0.0.1:3000/rules/fundamentos", { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toContainText("Fundamentos do duelo");
    await expect(page.locator(".article-body")).toBeVisible();
    await page.screenshot({ path: `visual-evidence/rules-article-${viewport.name}.png`, fullPage: true });
  });

  test(`cards standalone visual ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("http://127.0.0.1:3000/cards", { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toContainText("Catálogo de cartas");
    await expect(page.locator(".catalog-card")).toHaveCount(24);
    await expect(page.locator("[data-catalog-source=\"snapshot\"]")).toContainText("Modo standalone");
    await expect(page.getByText("446", { exact: true })).toBeVisible();
    await page.screenshot({ path: `visual-evidence/cards-standalone-${viewport.name}.png`, fullPage: true });
  });

  test(`card detail standalone visual ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("http://127.0.0.1:3000/cards/forest_pack_shelter", { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toContainText("Abrigo da Matilha");
    await expect(page.locator("[data-card-source=\"snapshot\"]")).toContainText("SNAPSHOT CERTIFICADO");
    await page.screenshot({ path: `visual-evidence/card-detail-standalone-${viewport.name}.png`, fullPage: true });
  });

  test(`collections standalone visual ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("http://127.0.0.1:3000/collections", { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toContainText("Coleções de RuneForge");
    await expect(page.getByText("FONTE · SNAPSHOT CERTIFICADO", { exact: true })).toBeVisible();
    await expect(page.locator(".collection-card-live")).toHaveCount(1);
    await expect(page.getByText("Vanilla", { exact: true })).toBeVisible();
    await page.screenshot({ path: `visual-evidence/collections-standalone-${viewport.name}.png`, fullPage: true });
  });

  test(`collection detail standalone visual ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("http://127.0.0.1:3000/collections/vanilla", { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toContainText("Vanilla");
    await expect(page.locator(".collection-cards-section h2")).toContainText("446 cartas públicas");
    await expect(page.locator(".collection-card-mini-grid > a").first()).toBeVisible();
    await page.screenshot({ path: `visual-evidence/collection-detail-standalone-${viewport.name}.png`, fullPage: true });
  });

  test(`regions visual ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("http://127.0.0.1:3000/regions", { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toContainText("Seis regiões");
    await expect(page.locator(".region-live-card")).toHaveCount(6);
    await page.screenshot({ path: `visual-evidence/regions-${viewport.name}.png`, fullPage: true });
  });

  test(`region detail standalone visual ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("http://127.0.0.1:3000/regions/emberhold", { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toContainText("Emberhold");
    await expect(page.locator(".region-card-archive h2")).toContainText("cartas públicas");
    await expect(page.locator(".collection-card-mini-grid > a").first()).toBeVisible();
    await page.screenshot({ path: `visual-evidence/region-detail-standalone-${viewport.name}.png`, fullPage: true });
  });

  test(`keywords standalone visual ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("http://127.0.0.1:3000/keywords", { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toContainText("Keywords & Mecânicas");
    await expect(page.getByText("FONTE · SNAPSHOT CERTIFICADO", { exact: true })).toBeVisible();
    await expect(page.locator(".keyword-card")).toHaveCount(20);
    await expect(page.getByText("Flying", { exact: true })).toBeVisible();
    await page.screenshot({ path: `visual-evidence/keywords-standalone-${viewport.name}.png`, fullPage: true });
  });

  test(`lore manuscript standalone visual ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("http://127.0.0.1:3000/lore", { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toContainText("RuneForge — Livro I");
    await expect(page.locator(".content-grid .content-card")).toHaveCount(9);
    await expect(page.getByText("O homem que encontrou uma palavra morta", { exact: true })).toBeVisible();
    await page.screenshot({ path: `visual-evidence/lore-manuscript-${viewport.name}.png`, fullPage: true });
  });

  test(`snapshot dashboard visual ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("http://127.0.0.1:3000/snapshot", { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toContainText("Snapshot de Conhecimento RuneForge");
    await expect(page.getByText("446", { exact: true })).toBeVisible();
    await expect(page.getByText("20", { exact: true })).toBeVisible();
    await expect(page.getByText("9", { exact: true }).first()).toBeVisible();
    await page.screenshot({ path: `visual-evidence/snapshot-dashboard-${viewport.name}.png`, fullPage: true });
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

  test(`keyword detail standalone visual ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("http://127.0.0.1:3000/keywords/Flying", { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toContainText("Flying");
    await expect(page.locator(".keyword-card-archive h2")).toContainText("cartas públicas");
    await page.screenshot({ path: `visual-evidence/keyword-detail-standalone-${viewport.name}.png`, fullPage: true });
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

test("portal security headers are enforced", async ({ request }) => {
  const response = await request.get("http://127.0.0.1:3000/");
  const headers = response.headers();
  expect(response.status()).toBe(200);
  expect(headers["content-security-policy"] || "").toContain("script-src");
  expect(headers["content-security-policy"] || "").toContain("nonce-");
  expect(headers["content-security-policy"] || "").toContain("strict-dynamic");
  expect(headers["content-security-policy"] || "").toContain("frame-ancestors 'none'");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["strict-transport-security"] || "").toContain("max-age=31536000");
});

test("portal admin BFF rejects cross-origin mutations before backend forwarding", async ({ request }) => {
  const response = await request.post("http://127.0.0.1:3000/api/portal-admin/session", {
    headers: {
      "Origin": "https://evil.example",
      "Sec-Fetch-Site": "cross-site",
      "Content-Type": "application/json",
    },
    data: JSON.stringify({ username: "admin", password: "invalid" }),
  });
  expect(response.status()).toBe(403);
  expect((await response.json()).error).toContain("Cross-origin");
  expect(response.headers()["cache-control"] || "").toContain("no-store");
});

test("portal admin BFF rejects oversized streamed bodies before backend forwarding", async ({ request }) => {
  const response = await request.post("http://127.0.0.1:3000/api/portal-admin/session", {
    headers: {
      "Origin": "http://127.0.0.1:3000",
      "Sec-Fetch-Site": "same-origin",
      "Content-Type": "application/json",
    },
    data: "x".repeat(17 * 1024),
  });
  expect(response.status()).toBe(413);
  expect((await response.json()).error).toContain("Payload too large");
});

test("portal CMS BFF rejects oversized mutations before backend forwarding", async ({ request }) => {
  const response = await request.put("http://127.0.0.1:3000/api/portal-admin/site/home/main", {
    headers: {
      "Origin": "http://127.0.0.1:3000",
      "Sec-Fetch-Site": "same-origin",
      "Content-Type": "application/json",
    },
    data: "x".repeat(513 * 1024),
  });
  expect(response.status()).toBe(413);
  expect((await response.json()).error).toContain("Payload too large");
});
