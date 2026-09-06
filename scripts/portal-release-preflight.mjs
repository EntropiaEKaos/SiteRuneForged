const sha = (process.env.RUNEFORGE_PORTAL_DEPLOY_SHA || "").trim().toLowerCase();
const environment = (process.env.RUNEFORGE_PORTAL_DEPLOY_ENV || "").trim().toLowerCase();
const githubSha = (process.env.GITHUB_SHA || "").trim().toLowerCase();

const allowed = new Set(["ci", "preview", "alpha", "staging", "production"]);
const shaPattern = /^[0-9a-f]{40}$/;

function fail(message) {
  console.error(`PORTAL RELEASE PREFLIGHT: FAIL — ${message}`);
  process.exit(1);
}

if (!shaPattern.test(sha)) {
  fail("RUNEFORGE_PORTAL_DEPLOY_SHA must be an exact 40-character Git SHA");
}

if (!allowed.has(environment)) {
  fail("RUNEFORGE_PORTAL_DEPLOY_ENV must be ci, preview, alpha, staging or production");
}

if (githubSha) {
  if (!shaPattern.test(githubSha)) {
    fail("GITHUB_SHA must be an exact 40-character Git SHA when present");
  }
  if (githubSha !== sha) {
    fail(`configured portal SHA ${sha} does not match GITHUB_SHA ${githubSha}`);
  }
}

console.log(`PORTAL RELEASE PREFLIGHT: PASS — ${environment}@${sha.slice(0, 12)}`);
