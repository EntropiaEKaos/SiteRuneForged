import { apiGet } from "@/lib/runeforge-api/client";
import { standaloneRules, type SnapshotSource } from "@/data/knowledge-snapshot";

export type PublicCardRuleContract = {
  key: string;
  name: string;
  kind: "structural" | "semantic";
  baseType: string;
  icon: string;
  zone: "battlefield" | "stack" | "equipment";
  timing: "battlefield" | "main-only" | "reaction-only" | "speed-based";
  mana: "regular" | "spell";
  persistent: boolean;
  countsAsSpellCast: boolean;
  description: string;
  cardCount: number;
};

export type PublicRulesContracts = {
  version: 1;
  structural: PublicCardRuleContract[];
  semantic: PublicCardRuleContract[];
  all: PublicCardRuleContract[];
};

export type PublicRulesContractsState =
  | { available: true; source: SnapshotSource; data: PublicRulesContracts }
  | { available: false; source: null; data: null };

export async function getPublicRulesContracts(): Promise<PublicRulesContractsState> {
  try {
    const response = await apiGet<{ ok: true } & PublicRulesContracts>(
      "/api/public/game/rules/contracts",
    );
    return {
      available: true,
      source: "api",
      data: {
        version: response.version,
        structural: response.structural,
        semantic: response.semantic,
        all: response.all,
      },
    };
  } catch {
    const data = standaloneRules();
    return data.all.length
      ? { available: true, source: "snapshot", data }
      : { available: false, source: null, data: null };
  }
}
