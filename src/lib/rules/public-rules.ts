import { apiGet } from "@/lib/runeforge-api/client";

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
  | { available: true; data: PublicRulesContracts }
  | { available: false; data: null };

export async function getPublicRulesContracts(): Promise<PublicRulesContractsState> {
  try {
    const response = await apiGet<{ ok: true } & PublicRulesContracts>(
      "/api/public/game/rules/contracts",
    );
    return {
      available: true,
      data: {
        version: response.version,
        structural: response.structural,
        semantic: response.semantic,
        all: response.all,
      },
    };
  } catch {
    return { available: false, data: null };
  }
}
