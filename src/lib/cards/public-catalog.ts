import { apiGet, RuneForgeApiError } from "@/lib/runeforge-api/client";

export type PublicCard = {
  defId: string;
  name: string;
  region: string;
  regions: string[];
  type: string;
  structuralType: string;
  archetypeKey?: string;
  archetypeName?: string;
  cost: number;
  power?: number;
  health?: number;
  keywords: string[];
  customKeywords: string[];
  description: string;
  flavor?: string;
  rarity: string;
  races: string[];
  classes: string[];
  isLegend: boolean;
  isChampion: boolean;
  art?: string;
  emoji: string;
  strategicRole?: string;
  doctrineAffinities: string[];
  collection: {
    key: string;
    code: string;
    name: string;
    symbol?: string | null;
  };
};

export type CardFacet = { value: string; count: number; label?: string };

export type PublicCardCatalogResponse = {
  ok: true;
  catalogRevision: string;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  items: PublicCard[];
  facets: {
    regions: CardFacet[];
    types: CardFacet[];
    rarities: CardFacet[];
    collections: CardFacet[];
  };
};

export type CardCatalogQuery = {
  q?: string;
  region?: string;
  type?: string;
  rarity?: string;
  collection?: string;
  page?: string | number;
  pageSize?: string | number;
};

export type PublicCardCatalogState =
  | { available: true; data: PublicCardCatalogResponse }
  | { available: false; data: null };

function queryString(query: CardCatalogQuery) {
  const params = new URLSearchParams();
  for (const [key, raw] of Object.entries(query)) {
    const value = String(raw ?? "").trim();
    if (value) params.set(key, value);
  }
  return params.toString();
}

export async function getPublicCardCatalog(query: CardCatalogQuery = {}): Promise<PublicCardCatalogState> {
  try {
    const search = queryString(query);
    const data = await apiGet<PublicCardCatalogResponse>(`/api/public/game/cards${search ? `?${search}` : ""}`);
    return { available: true, data };
  } catch {
    return { available: false, data: null };
  }
}

export async function getPublicCard(defId: string): Promise<PublicCard | null | undefined> {
  try {
    const response = await apiGet<{ ok: true; item: PublicCard }>(
      `/api/public/game/cards/${encodeURIComponent(defId)}`,
    );
    return response.item;
  } catch (error) {
    if (error instanceof RuneForgeApiError && error.status === 404) return null;
    return undefined;
  }
}
