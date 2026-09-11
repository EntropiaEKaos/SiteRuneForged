import { test, expect } from "@playwright/test";

const publicRoutes = [
  "/",
  "/cards",
  "/collections",
  "/regions",
  "/keywords",
  "/rules",
  "/lore",
  "/alpha",
];

test("mobile navigation is persistent and public pages do not overflow horizontally", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  for (const route of publicRoutes) {
    await page.goto(`http://127.0.0.1:3000${route}`, { waitUntil: "networkidle" });
    await expect(page.locator(".mobile-site-nav")).toBeVisible();
    await expect(page.getByRole("button", { name: "Menu" })).toBeVisible();

    const overflow = await page.evaluate(() => ({
      viewport: window.innerWidth,
      content: document.documentElement.scrollWidth,
    }));
    expect(overflow.content).toBeLessThanOrEqual(overflow.viewport + 1);
  }
});

test("mobile menu exposes the full RuneForge public information architecture", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://127.0.0.1:3000/cards", { waitUntil: "networkidle" });

  const trigger = page.getByRole("button", { name: "Menu" });
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");

  const dialog = page.getByRole("dialog", { name: "Menu do RuneForge" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link", { name: /Coleções/ })).toBeVisible();
  await expect(dialog.getByRole("link", { name: /Regiões/ })).toBeVisible();
  await expect(dialog.getByRole("link", { name: /Mecânicas/ })).toBeVisible();
  await expect(dialog.getByRole("link", { name: /Regras/ })).toBeVisible();
  await expect(dialog.getByRole("link", { name: /Snapshot/ })).toBeVisible();
  await expect(dialog.getByRole("link", { name: /Alpha/ })).toBeVisible();

  await page.screenshot({ path: "visual-evidence/mobile-navigation-sheet.png", fullPage: true });

  await dialog.getByRole("link", { name: /Regras/ }).click();
  await expect(page).toHaveURL(/\/rules$/);
  await expect(page.locator(".mobile-site-nav")).toBeVisible();
  await expect(page.getByRole("dialog", { name: "Menu do RuneForge" })).toHaveCount(0);
});

test("mobile navigation stays out of the admin surface", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://127.0.0.1:3000/admin", { waitUntil: "networkidle" });
  await expect(page.locator(".mobile-site-nav")).toHaveCount(0);
});
