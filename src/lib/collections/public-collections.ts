import { apiGet } from "@/lib/runeforge-api/client";

export type PublicCollection = {
  key: string;
  code: string;
  name: string;
  description?: string | null;
  symbol?: string | null;
  banner?: string | null;
  releaseDate?: string | null;
  rotationDate?: string | null;
  lifecycle: "upcoming" | "active" | "rotated" | string;
  cardCount: number;
  metadata?: Record<string, unknown> | null;
};

export type PublicCollectionsState =
  | { available: true; collections: PublicCollection[] }
  | { available: false; collections: null };

export async function getPublicCollections(): Promise<PublicCollectionsState> {
  try {
    const response = await apiGet<{ ok: true; collections: PublicCollection[] }>("/api/collections");
    return {
      available: true,
      collections: Array.isArray(response.collections) ? response.collections : [],
    };
  } catch {
    return { available: false, collections: null };
  }
}

export async function getPublicCollection(key: string): Promise<PublicCollection | null | undefined> {
  const state = await getPublicCollections();
  if (!state.available) return undefined;
  const normalized = key.trim().toLocaleLowerCase("en-US");
  return state.collections.find((collection) =>
    collection.key.toLocaleLowerCase("en-US") === normalized ||
    collection.code.toLocaleLowerCase("en-US") === normalized
  ) ?? null;
}
