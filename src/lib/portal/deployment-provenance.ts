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

export function getPortalDeploymentProvenance(): PortalDeploymentProvenance | null {
  const commitSha = process.env.RUNEFORGE_PORTAL_DEPLOY_SHA?.trim().toLowerCase() || "";
  const environment = process.env.RUNEFORGE_PORTAL_DEPLOY_ENV?.trim().toLowerCase() || "";

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
