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
}
