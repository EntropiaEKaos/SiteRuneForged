import "server-only";
import { apiGetFresh } from "@/lib/runeforge-api/client";

export const DEPLOYMENT_ENVIRONMENTS = ["ci", "preview", "alpha", "staging", "production"] as const;
export type DeploymentEnvironment = typeof DEPLOYMENT_ENVIRONMENTS[number];

export type PublicDeploymentProvenance = {
  schemaVersion: 1;
  release: string;
  engineVersion: string;
  rulesetVersion: string;
  contentVersion: string;
  commitSha: string;
  commitShort: string;
  environment: DeploymentEnvironment;
};

export type DeploymentVerification =
  | "verified"
  | "unconfigured"
  | "mismatch"
  | "unavailable"
  | "invalid-config";

export type PublicDeploymentProvenanceState = {
  available: boolean;
  data: PublicDeploymentProvenance | null;
  pinConfigured: boolean;
  expectedSha: string | null;
  verification: DeploymentVerification;
};

const SHA_40 = /^[0-9a-f]{40}$/;

function expectedDeploySha() {
  const raw = process.env.RUNEFORGE_EXPECTED_DEPLOY_SHA?.trim().toLowerCase() || "";
  return {
    configured: Boolean(raw),
    valid: !raw || SHA_40.test(raw),
    value: SHA_40.test(raw) ? raw : null,
  };
}

function isDeploymentProvenance(value: unknown): value is PublicDeploymentProvenance {
  if (!value || typeof value !== "object") return false;
  const deployment = value as Partial<PublicDeploymentProvenance>;
  return deployment.schemaVersion === 1
    && typeof deployment.release === "string"
    && typeof deployment.engineVersion === "string"
    && typeof deployment.rulesetVersion === "string"
    && typeof deployment.contentVersion === "string"
    && typeof deployment.commitSha === "string"
    && SHA_40.test(deployment.commitSha)
    && deployment.commitShort === deployment.commitSha.slice(0, 12)
    && typeof deployment.environment === "string"
    && DEPLOYMENT_ENVIRONMENTS.includes(deployment.environment as DeploymentEnvironment);
}

export async function getPublicDeploymentProvenance(): Promise<PublicDeploymentProvenanceState> {
  const expected = expectedDeploySha();

  if (!expected.valid) {
    return {
      available: false,
      data: null,
      pinConfigured: true,
      expectedSha: null,
      verification: "invalid-config",
    };
  }

  try {
    const response = await apiGetFresh<{ ok: true; deployment: PublicDeploymentProvenance }>(
      "/api/public/game/deployment/provenance",
    );

    if (!isDeploymentProvenance(response.deployment)) {
      return {
        available: false,
        data: null,
        pinConfigured: expected.configured,
        expectedSha: expected.value,
        verification: "unavailable",
      };
    }

    if (!expected.configured) {
      return {
        available: true,
        data: response.deployment,
        pinConfigured: false,
        expectedSha: null,
        verification: "unconfigured",
      };
    }

    return {
      available: true,
      data: response.deployment,
      pinConfigured: true,
      expectedSha: expected.value,
      verification: response.deployment.commitSha === expected.value ? "verified" : "mismatch",
    };
  } catch {
    return {
      available: false,
      data: null,
      pinConfigured: expected.configured,
      expectedSha: expected.value,
      verification: "unavailable",
    };
  }
}
