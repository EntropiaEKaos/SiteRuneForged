import { test, expect } from "@playwright/test";

const instagram = "https://www.instagram.com/runeforgeproject/";

test("homepage exposes certified gameplay screenshots and official Instagram", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("http://127.0.0.1:3000", { waitUntil: "networkidle" });

  const gallery = page.locator("[data-gameplay-gallery]");
  await expect(gallery).toBeVisible();
  await expect(gallery.locator("figure")).toHaveCount(3);
  await expect(gallery.locator('img[src="/gameplay/05-battlefield.webp"]')).toBeVisible();
  await expect(gallery.locator('img[src="/gameplay/06-collection.webp"]')).toBeVisible();
  await expect(gallery.locator('img[src="/gameplay/07-forge.webp"]')).toBeVisible();
  await expect(gallery.getByText("CI #922", { exact: false })).toBeVisible();

  const socialLink = gallery.locator(`a[href="${instagram}"]`);
  await expect(socialLink).toBeVisible();
  await expect(socialLink).toHaveAttribute("target", "_blank");
  await expect(page.locator(`footer a[href="${instagram}"]`)).toContainText("@runeforgeproject");

  await gallery.screenshot({ path: "visual-evidence/gameplay-gallery-desktop.png" });
});

test("gameplay gallery remains usable without horizontal overflow on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://127.0.0.1:3000", { waitUntil: "networkidle" });
  const gallery = page.locator("[data-gameplay-gallery]");
  await expect(gallery).toBeVisible();
  await expect(gallery.locator("figure")).toHaveCount(3);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await gallery.screenshot({ path: "visual-evidence/gameplay-gallery-mobile.png" });
});
