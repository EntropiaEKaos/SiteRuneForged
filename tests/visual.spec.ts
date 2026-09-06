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
}
