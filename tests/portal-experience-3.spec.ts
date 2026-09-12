import { test, expect } from "@playwright/test";

const base = "http://127.0.0.1:3000";

test("Homepage 3.0 exposes real discovery surfaces", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(base, { waitUntil: "networkidle" });
  await expect(page.locator(".hero-command-card")).toBeVisible();
  await expect(page.locator(".home-discovery-strip > a")).toHaveCount(3);
  await expect(page.locator(".home-live-cards .home-live-card").first()).toBeVisible();
  await expect(page.locator(".home-foundation")).toContainText("Vanilla");
  expect((await page.locator('script[type="application/ld+json"]').textContent()) || "").toContain("VideoGame");
  await page.screenshot({ path: "visual-evidence/home-v3-desktop.png", fullPage: true });
});

test("Card Explorer 2.0 has shareable advanced filters and list view", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(`${base}/cards?view=list&minCost=1&maxCost=6&sort=cost-desc`, { waitUntil: "networkidle" });
  for (const name of ["race", "class", "minCost", "maxCost", "sort"]) await expect(page.locator(`[name="${name}"]`)).toBeVisible();
  await expect(page.locator('.catalog-grid[data-view="list"]')).toBeVisible();
  await expect(page.locator(".catalog-filter-chip")).toHaveCount(2);
  await expect(page.locator(".catalog-card").first()).toBeVisible();
  await page.screenshot({ path: "visual-evidence/card-explorer-v2-list.png", fullPage: true });
});

test("Sentinela cards expose loyalty and all public abilities", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.goto(`${base}/cards/rf296_sent_ilyra`, { waitUntil: "networkidle" });
  const sentinela = page.locator("[data-sentinela-abilities]");
  await expect(sentinela).toBeVisible();
  await expect(sentinela).toContainText("LEALDADE INICIAL 4");
  await expect(sentinela.locator("[data-sentinela-ability]")).toHaveCount(3);
  await expect(sentinela).toContainText("+1: cause 1 de dano ao Nexus inimigo");
  await expect(sentinela).toContainText("-2: conceda Ataque Rápido a uma unidade aliada");
  await expect(sentinela).toContainText("-6: cause 4 de dano a todos os inimigos");
  await page.screenshot({ path: "visual-evidence/sentinela-abilities-ilyra.png", fullPage: true });

  await page.goto(`${base}/cards?type=Sentinela`, { waitUntil: "networkidle" });
  await expect(page.locator(".catalog-card").first()).toContainText("habilidades");
});

test("Card detail has sharing, related discovery and SEO", async ({ page }) => {
  await page.goto(`${base}/cards/forest_pack_shelter`, { waitUntil: "networkidle" });
  await expect(page.getByRole("button", { name: "Compartilhar carta" })).toBeVisible();
  await expect(page.locator(".card-related")).toBeVisible();
  const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  expect(canonical || "").toContain("/cards/forest_pack_shelter");
  const ogTitle = await page.locator('meta[property="og:title"]').getAttribute("content");
  expect(ogTitle || "").toContain("Abrigo da Matilha");
});

test("Collection and region surfaces expose catalog intelligence", async ({ page }) => {
  await page.goto(`${base}/collections/vanilla`, { waitUntil: "networkidle" });
  await expect(page.locator(".identity-intelligence .identity-breakdown")).toHaveCount(3);
  await expect(page.getByText("DISTRIBUIÇÃO POR RARIDADE", { exact: true })).toBeVisible();
  await page.goto(`${base}/regions/emberhold`, { waitUntil: "networkidle" });
  await expect(page.locator(".region-identity-summary > div")).toHaveCount(4);
  await expect(page.locator(".identity-intelligence .identity-breakdown")).toHaveCount(3);
});

test("Portal Admin UX 2.0 directory filters resources", async ({ page }) => {
  await page.goto(`${base}/admin?q=seo#content`, { waitUntil: "networkidle" });
  const search = page.getByPlaceholder("Home, lore, SEO, eventos…");
  await expect(search).toBeVisible();
  await expect(search).toHaveValue("seo");
  await expect(page.locator('[data-resource-key="seo"]')).toBeVisible();
  await expect(page.locator('[data-resource-key="home"]')).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Limpar" })).toBeVisible();
});

test("SEO endpoints index public content and protect admin", async ({ request }) => {
  const robots = await request.get(`${base}/robots.txt`);
  expect(robots.status()).toBe(200);
  const robotsText = await robots.text();
  expect(robotsText).toContain("Disallow: /admin/");
  expect(robotsText).toContain("Sitemap:");

  const sitemap = await request.get(`${base}/sitemap.xml`);
  expect(sitemap.status()).toBe(200);
  const sitemapText = await sitemap.text();
  expect(sitemapText).toContain("/cards/forest_pack_shelter");
  expect(sitemapText).toContain("/collections/vanilla");
  expect(sitemapText).toContain("/regions/emberhold");
});

test("first-party analytics accepts only bounded anonymous public events", async ({ request }) => {
  const accepted = await request.post(`${base}/api/public/portal/analytics`, { data: { type: "page_view", path: "/cards" } });
  expect(accepted.status()).toBe(204);
  expect(accepted.headers()["cache-control"] || "").toContain("no-store");
  const admin = await request.post(`${base}/api/public/portal/analytics`, { data: { type: "page_view", path: "/admin" } });
  expect(admin.status()).toBe(400);
  const unknown = await request.post(`${base}/api/public/portal/analytics`, { data: { type: "identity", path: "/" } });
  expect(unknown.status()).toBe(400);
});

for (const route of ["/", "/cards?view=list", "/collections/vanilla", "/regions/emberhold"]) {
  test(`Portal Experience 3.0 mobile has no horizontal overflow: ${route}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
    const sizes = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
    expect(sizes.scroll).toBeLessThanOrEqual(sizes.client + 1);
  });
}
