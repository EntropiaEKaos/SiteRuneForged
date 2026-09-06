import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

const siteUrl = normalizeOrigin(process.env.RUNEFORGE_SMOKE_SITE_URL, "RUNEFORGE_SMOKE_SITE_URL");
const gameUrl = normalizeOrigin(process.env.RUNEFORGE_SMOKE_GAME_URL, "RUNEFORGE_SMOKE_GAME_URL");
const expectedGameSha = (process.env.RUNEFORGE_SMOKE_EXPECTED_GAME_SHA || "").trim().toLowerCase();
const expectedEnvironment = (process.env.RUNEFORGE_SMOKE_EXPECTED_ENV || "alpha").trim().toLowerCase();
const allowHttp = process.env.RUNEFORGE_SMOKE_ALLOW_HTTP === "true";
const evidenceDir = path.resolve(process.env.RUNEFORGE_SMOKE_EVIDENCE_DIR || "production-evidence");
const manifestPath = path.join(evidenceDir, "manifest.json");
const screenshotPath = path.join(evidenceDir, "alpha-launch.png");

const expectedCapabilities = [
  "onboarding",
  "deck-selection",
  "mulligan",
  "pve",
  "forge",
  "rewards-progression",
  "casual-pvp",
];

function normalizeOrigin(raw, name) {
  assert.ok(raw?.trim(), `${name} is required`);
  const url = new URL(raw.trim());
  assert.ok(url.protocol === "https:" || url.protocol === "http:", `${name} must use HTTP(S)`);
  assert.equal(url.username, "", `${name} must not contain credentials`);
  assert.equal(url.password, "", `${name} must not contain credentials`);
  assert.equal(url.search, "", `${name} must not contain a query string`);
  assert.equal(url.hash, "", `${name} must not contain a fragment`);
  assert.ok(url.pathname === "/" || url.pathname === "", `${name} must be an origin URL without a path`);
  return url.origin;
}

function isLoopback(hostname) {
  const host = hostname.toLowerCase();
  return host === "localhost"
    || host === "127.0.0.1"
    || host === "::1"
    || host === "[::1]";
}

function requireProductionTransport(origin, name) {
  const url = new URL(origin);
  if (allowHttp) return;
  assert.equal(url.protocol, "https:", `${name} must use HTTPS for production smoke certification`);
  assert.equal(isLoopback(url.hostname), false, `${name} must not use a loopback host for production smoke certification`);
}

async function publicJson(pathname) {
  const response = await fetch(gameUrl + pathname, {
    headers: { Accept: "application/json" },
    cache: "no-store",
    redirect: "follow",
  });
  const text = await response.text();
  let body = null;
  try {
    body = JSON.parse(text);
  } catch {
    throw new Error(`${pathname} did not return JSON (HTTP ${response.status})`);
  }
  assert.equal(response.status, 200, `${pathname} must return HTTP 200: ${JSON.stringify(body)}`);
  assert.match(
    response.headers.get("cache-control") || "",
    /(?:^|,)\s*no-store(?:,|$)/i,
    `${pathname} must be cache-control: no-store`,
  );
  return body;
}

function versionTuple(value) {
  return {
    release: value?.release ?? null,
    engineVersion: value?.engineVersion ?? null,
    rulesetVersion: value?.rulesetVersion ?? null,
    contentVersion: value?.contentVersion ?? null,
  };
}

async function run() {
  await fs.mkdir(evidenceDir, { recursive: true });

  assert.match(expectedGameSha, /^[0-9a-f]{40}$/, "RUNEFORGE_SMOKE_EXPECTED_GAME_SHA must be an exact 40-character Git SHA");
  assert.ok(
    expectedEnvironment === "alpha" || expectedEnvironment === "production",
    "RUNEFORGE_SMOKE_EXPECTED_ENV must be alpha or production",
  );
  requireProductionTransport(siteUrl, "RUNEFORGE_SMOKE_SITE_URL");
  requireProductionTransport(gameUrl, "RUNEFORGE_SMOKE_GAME_URL");

  const readinessEnvelope = await publicJson("/api/public/game/alpha/readiness");
  const readiness = readinessEnvelope?.readiness;
  assert.equal(readinessEnvelope?.ok, true, "Alpha readiness envelope must be ok");
  assert.equal(readiness?.alpha, "playable");
  assert.equal(readiness?.state, "ready", "deployed public Alpha must report ready");
  assert.equal(readiness?.entryRoute, "/play");

  const capabilities = Array.isArray(readiness?.capabilities) ? readiness.capabilities : [];
  const capabilityKeys = capabilities.map((item) => item?.key);
  assert.equal(capabilities.length, expectedCapabilities.length, "public Alpha must expose exactly seven capabilities");
  assert.deepEqual(
    [...capabilityKeys].sort(),
    [...expectedCapabilities].sort(),
    "public Alpha capability keys must match the certified seven",
  );
  assert.ok(capabilities.every((item) => item?.status === "available"), "all public Alpha capabilities must be available");

  assert.equal(readiness?.boundaries?.rankedPublicLaunchRequirement, false);
  assert.equal(readiness?.boundaries?.realMoneyPaymentsLaunchRequirement, false);
  assert.equal(readiness?.boundaries?.largeScaleLiveOpsLaunchRequirement, false);
  assert.equal(
    readiness?.boundaries?.rankedOperational,
    false,
    "Ranked must remain operationally disabled for this public Alpha smoke gate",
  );

  const provenanceEnvelope = await publicJson("/api/public/game/deployment/provenance");
  const deployment = provenanceEnvelope?.deployment;
  assert.equal(provenanceEnvelope?.ok, true, "Deployment provenance envelope must be ok");
  assert.equal(deployment?.schemaVersion, 1);
  assert.equal(deployment?.commitSha, expectedGameSha, "live game SHA must equal the certified expected SHA");
  assert.equal(deployment?.commitShort, expectedGameSha.slice(0, 12));
  assert.equal(deployment?.environment, expectedEnvironment, "live game environment must match the expected deployment environment");
  assert.deepEqual(
    versionTuple(deployment),
    versionTuple(readiness?.release),
    "readiness and deployment provenance versions must agree exactly",
  );

  const browser = await chromium.launch({ headless: true });
  let portal = null;
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
    const response = await page.goto(`${siteUrl}/alpha`, { waitUntil: "networkidle" });
    assert.ok(response, "portal /alpha must return a navigation response");
    assert.ok(response.status() >= 200 && response.status() < 400, `portal /alpha returned HTTP ${response.status()}`);

    assert.equal(await page.locator(".alpha-runtime-ready").count(), 1, "portal must show the live Alpha runtime as ready");
    assert.equal(await page.locator(".alpha-build-verified").count(), 1, "portal must mark the deployed game build as verified");
    assert.equal(await page.locator(".alpha-capability-card").count(), 7, "portal must render seven certified capabilities");
    assert.equal(await page.locator(".alpha-readiness-unavailable").count(), 0);
    assert.equal(await page.locator(".alpha-provenance-block-note").count(), 0);

    const panel = page.locator(".alpha-release-panel");
    const portalSha = await panel.getAttribute("data-deploy-sha");
    const portalVerification = await panel.getAttribute("data-deploy-verification");
    assert.equal(portalSha, expectedGameSha, "portal must expose the exact certified game SHA");
    assert.equal(portalVerification, "verified", "portal must verify the live game SHA");

    const panelText = await panel.innerText();
    assert.ok(panelText.includes(expectedGameSha), "portal build panel must visibly show the full 40-character game SHA");
    assert.ok(panelText.includes(expectedEnvironment), "portal build panel must visibly show the deployment environment");

    const playHref = await page.locator("a.alpha-play-cta").getAttribute("href");
    const expectedPlayHref = new URL("/play", gameUrl).toString();
    assert.equal(playHref, expectedPlayHref, "portal Play CTA must target the certified game origin /play");

    await page.screenshot({ path: screenshotPath, fullPage: true });

    portal = {
      alphaStatus: "ready",
      verification: portalVerification,
      commitSha: portalSha,
      playHref,
    };
  } finally {
    await browser.close();
  }

  const manifest = {
    schemaVersion: 1,
    gate: "Production Alpha Smoke 1.0",
    passed: true,
    generatedAt: new Date().toISOString(),
    siteUrl,
    gameUrl,
    expectedGameSha,
    expectedEnvironment,
    transport: allowHttp ? "local-http-test-override" : "https",
    readiness,
    deployment,
    portal,
  };
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");

  console.log(
    `PRODUCTION ALPHA SMOKE: PASS — site ${siteUrl} · game ${gameUrl} · ${expectedEnvironment}@${expectedGameSha.slice(0, 12)} · 7/7 capabilities · portal verified`,
  );
}

run().catch(async (error) => {
  await fs.mkdir(evidenceDir, { recursive: true }).catch(() => {});
  const message = error instanceof Error ? error.message : String(error);
  await fs.writeFile(manifestPath, JSON.stringify({
    schemaVersion: 1,
    gate: "Production Alpha Smoke 1.0",
    passed: false,
    generatedAt: new Date().toISOString(),
    siteUrl: typeof siteUrl === "string" ? siteUrl : null,
    gameUrl: typeof gameUrl === "string" ? gameUrl : null,
    expectedGameSha: expectedGameSha || null,
    expectedEnvironment: expectedEnvironment || null,
    error: message,
  }, null, 2) + "\n", "utf8").catch(() => {});
  console.error(`PRODUCTION ALPHA SMOKE: FAIL — ${message}`);
  process.exit(1);
});
