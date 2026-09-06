import "server-only";
import packageJson from "../../../package.json";

export const PORTAL_DEPLOYMENT_ENVIRONMENTS = ["ci", "preview", "alpha", "staging", "production"] as const;
export type PortalDeploymentEnvironment = typeof PORTAL_DEPLOYMENT_ENVIRONMENTS[number];

export type PortalDeploymentProvenance = {
  schemaVersion: 1;
  application: "SiteRuneForged";
  release: string;
  commitSha: string;
  commitShort: string;
  environment: PortalDeploymentEnvironment;
};

const SHA_40 = /^[0-9a-f]{40}$/;

function explicitOrFallback(explicit: string | undefined, fallback: string | undefined) {
  const value = explicit?.trim();
  if (value) return value;
  return fallback?.trim() || "";
}

function vercelEnvironment(value: string | undefined): PortalDeploymentEnvironment | "" {
  const normalized = value?.trim().toLowerCase() || "";
  if (normalized === "production") return "production";
  if (normalized === "preview") return "preview";
  return "";
}

export function getPortalDeploymentProvenance(): PortalDeploymentProvenance | null {
  const commitSha = explicitOrFallback(
    process.env.RUNEFORGE_PORTAL_DEPLOY_SHA,
    process.env.VERCEL_GIT_COMMIT_SHA,
  ).toLowerCase();

  const explicitEnvironment = process.env.RUNEFORGE_PORTAL_DEPLOY_ENV?.trim().toLowerCase() || "";
  const environment = explicitEnvironment || vercelEnvironment(process.env.VERCEL_ENV);

  if (!SHA_40.test(commitSha)) return null;
  if (!PORTAL_DEPLOYMENT_ENVIRONMENTS.includes(environment as PortalDeploymentEnvironment)) return null;

  return {
    schemaVersion: 1,
    application: "SiteRuneForged",
    release: packageJson.version,
    commitSha,
    commitShort: commitSha.slice(0, 12),
    environment: environment as PortalDeploymentEnvironment,
  };
}
