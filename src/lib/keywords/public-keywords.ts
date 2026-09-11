import { apiGet } from "@/lib/runeforge-api/client";
import { standaloneKeywords, type SnapshotSource } from "@/data/knowledge-snapshot";

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
  | { available: true; source: SnapshotSource; items: PublicKeyword[] }
  | { available: false; source: null; items: null };

export async function getPublicKeywords(): Promise<PublicKeywordCatalogState> {
  try {
    const response = await apiGet<{ ok: true; total: number; items: PublicKeyword[] }>(
      "/api/public/game/keywords",
    );
    return {
      available: true,
      source: "api",
      items: Array.isArray(response.items) ? response.items : [],
    };
  } catch {
    const items = standaloneKeywords();
    return items.length
      ? { available: true, source: "snapshot", items }
      : { available: false, source: null, items: null };
  }
}

export async function getPublicKeyword(key: string): Promise<PublicKeyword | null | undefined> {
  const state = await getPublicKeywords();
  if (!state.available) return undefined;
  const normalized = key.trim().toLocaleLowerCase("en-US");
  return state.items.find((item) => item.key.toLocaleLowerCase("en-US") === normalized) ?? null;
}
