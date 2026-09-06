import { apiGet } from "@/lib/runeforge-api/client";

export type PublicKeyword = {
  key: string;
  name: string;
  description: string;
  icon: string;
  source: "canonical" | "custom";
  engineKeyword?: string;
  runtimeDomains: string[];
  grantable: boolean;
  requiresTrigger?: string;
  timing?: string;
  cardCount: number;
};

export type PublicKeywordCatalogState =
  | { available: true; items: PublicKeyword[] }
  | { available: false; items: null };

export async function getPublicKeywords(): Promise<PublicKeywordCatalogState> {
  try {
    const response = await apiGet<{ ok: true; total: number; items: PublicKeyword[] }>(
      "/api/public/game/keywords",
    );
    return {
      available: true,
      items: Array.isArray(response.items) ? response.items : [],
    };
  } catch {
    return { available: false, items: null };
  }
}

export async function getPublicKeyword(key: string): Promise<PublicKeyword | null | undefined> {
  const state = await getPublicKeywords();
  if (!state.available) return undefined;
  const normalized = key.trim().toLocaleLowerCase("en-US");
  return state.items.find((item) => item.key.toLocaleLowerCase("en-US") === normalized) ?? null;
}
