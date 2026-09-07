const explicitSha = (process.env.RUNEFORGE_PORTAL_DEPLOY_SHA || "").trim().toLowerCase();
const explicitEnvironment = (process.env.RUNEFORGE_PORTAL_DEPLOY_ENV || "").trim().toLowerCase();
const githubSha = (process.env.GITHUB_SHA || "").trim().toLowerCase();
const vercelSha = (process.env.VERCEL_GIT_COMMIT_SHA || "").trim().toLowerCase();
const vercelEnv = (process.env.VERCEL_ENV || "").trim().toLowerCase();

const allowed = new Set(["ci", "preview", "alpha", "staging", "production"]);
const shaPattern = /^[0-9a-f]{40}$/;

function fail(message) {
  console.error(`PORTAL RELEASE PREFLIGHT: FAIL — ${message}`);
  process.exit(1);
}

function resolveVercelEnvironment(value) {
  if (value === "production") return "production";
  if (value === "preview") return "preview";
  return "";
}

const sha = explicitSha || vercelSha;
const environment = explicitEnvironment || resolveVercelEnvironment(vercelEnv);
const source = explicitSha ? "runeforge-env" : vercelSha ? "vercel-system" : "missing";

if (!shaPattern.test(sha)) {
  fail("portal deploy SHA must come from RUNEFORGE_PORTAL_DEPLOY_SHA or VERCEL_GIT_COMMIT_SHA and be an exact 40-character Git SHA");
}

if (!allowed.has(environment)) {
  fail("portal deploy environment must come from RUNEFORGE_PORTAL_DEPLOY_ENV or supported VERCEL_ENV and resolve to ci, preview, alpha, staging or production");
}

for (const [name, platformSha] of [
  ["GITHUB_SHA", githubSha],
  ["VERCEL_GIT_COMMIT_SHA", vercelSha],
]) {
  if (!platformSha) continue;
  if (!shaPattern.test(platformSha)) {
    fail(`${name} must be an exact 40-character Git SHA when present`);
  }
  if (platformSha !== sha) {
    fail(`resolved portal SHA ${sha} does not match ${name} ${platformSha}`);
  }
}

if (githubSha && vercelSha && githubSha !== vercelSha) {
  fail(`GITHUB_SHA ${githubSha} does not match VERCEL_GIT_COMMIT_SHA ${vercelSha}`);
}

console.log(`PORTAL RELEASE PREFLIGHT: PASS — ${environment}@${sha.slice(0, 12)} · source=${source}`);
