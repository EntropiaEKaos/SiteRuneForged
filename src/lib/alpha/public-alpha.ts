import { apiGetFresh } from "@/lib/runeforge-api/client";

export type AlphaCapability = {
  key: "onboarding" | "deck-selection" | "mulligan" | "pve" | "forge" | "rewards-progression" | "casual-pvp";
  label: string;
  status: "available" | "temporarily-unavailable";
  route: string;
};

export type PublicAlphaReadiness = {
  alpha: "playable";
  state: "ready" | "limited" | "maintenance";
  release: {
    release: string;
    engineVersion: string;
    rulesetVersion: string;
    contentVersion: string;
  };
  entryRoute: "/play";
  capabilities: AlphaCapability[];
  boundaries: {
    rankedPublicLaunchRequirement: false;
    realMoneyPaymentsLaunchRequirement: false;
    largeScaleLiveOpsLaunchRequirement: false;
    rankedOperational: boolean;
  };
};

export type PublicAlphaReadinessState =
  | { available: true; data: PublicAlphaReadiness }
  | { available: false; data: null };

export async function getPublicAlphaReadiness(): Promise<PublicAlphaReadinessState> {
  try {
    const response = await apiGetFresh<{ ok: true; readiness: PublicAlphaReadiness }>(
      "/api/public/game/alpha/readiness",
    );
    return response.readiness
      ? { available: true, data: response.readiness }
      : { available: false, data: null };
  } catch {
    return { available: false, data: null };
  }
}
