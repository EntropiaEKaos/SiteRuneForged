import { apiGet, RuneForgeApiError } from "@/lib/runeforge-api/client";
import snapshotJson from "@/data/card-catalog-snapshot.json";

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
    keywords: CardFacet[];
  };
};

export type CardCatalogQuery = {
  q?: string;
  region?: string;
  type?: string;
  rarity?: string;
  collection?: string;
  keyword?: string;
  page?: string | number;
  pageSize?: string | number;
};

export type CardCatalogSource = "api" | "snapshot";

export type PublicCardCatalogState =
  | { available: true; source: CardCatalogSource; data: PublicCardCatalogResponse }
  | { available: false; source: null; data: null };

export type PublicCardState =
  | { available: true; source: CardCatalogSource; item: PublicCard }
  | { available: false; source: "api"; item: null }
  | { available: false; source: null; item: undefined };

type SnapshotShape = {
  schemaVersion: number;
  source: {
    repository: string;
    commitSha: string;
    commitShort: string;
    environment: string;
    release: string;
    engineVersion: string;
    rulesetVersion: string;
    contentVersion: string;
    catalogRevision: string;
    total: number;
  };
  cards: PublicCard[];
};

const snapshot = snapshotJson as SnapshotShape;

function queryString(query: CardCatalogQuery) {
  const params = new URLSearchParams();
  for (const [key, raw] of Object.entries(query)) {
    const value = String(raw ?? "").trim();
    if (value) params.set(key, value);
  }
  return params.toString();
}

function normalized(value: unknown) {
  return String(value ?? "").trim().toLocaleLowerCase("en-US");
}

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function countFacet(values: string[]): CardFacet[] {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([value, count]) => ({ value, count }));
}

function querySnapshot(query: CardCatalogQuery): PublicCardCatalogResponse {
  const q = normalized(query.q);
  const region = normalized(query.region);
  const type = normalized(query.type);
  const rarity = normalized(query.rarity);
  const collection = normalized(query.collection);
  const keyword = normalized(query.keyword);

  const sorted = [...snapshot.cards].sort(
    (a, b) => a.name.localeCompare(b.name) || a.defId.localeCompare(b.defId),
  );

  const filtered = sorted.filter((card) => {
    if (q) {
      const haystack = [
        card.name,
        card.defId,
        card.description,
        card.flavor,
        card.region,
        ...card.regions,
        card.type,
        card.structuralType,
        card.rarity,
        ...card.keywords,
        ...card.customKeywords,
        ...card.races,
        ...card.classes,
        card.collection.name,
        card.collection.code,
      ].join(" ").toLocaleLowerCase("en-US");
      if (!haystack.includes(q)) return false;
    }

    if (region && !card.regions.some((value) => normalized(value) === region)) return false;
    if (type && normalized(card.type) !== type && normalized(card.structuralType) !== type) return false;
    if (rarity && normalized(card.rarity) !== rarity) return false;
    if (
      collection
      && normalized(card.collection.key) !== collection
      && normalized(card.collection.code) !== collection
    ) return false;
    if (
      keyword
      && ![...card.keywords, ...card.customKeywords].some((value) => normalized(value) === keyword)
    ) return false;

    return true;
  });

  const pageSize = Math.min(100, Math.max(1, Math.trunc(Number(query.pageSize) || 48)));
  const requestedPage = Math.max(1, Math.trunc(Number(query.page) || 1));
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const page = Math.min(requestedPage, totalPages);
  const start = (page - 1) * pageSize;

  const collectionCounts = new Map<string, { label: string; count: number }>();
  for (const card of sorted) {
    const key = card.collection.key;
    const current = collectionCounts.get(key);
    collectionCounts.set(key, {
      label: card.collection.name,
      count: (current?.count ?? 0) + 1,
    });
  }

  return {
    ok: true,
    catalogRevision: `snapshot:${snapshot.source.commitShort}:${snapshot.source.catalogRevision}`,
    total: filtered.length,
    page,
    pageSize,
    totalPages,
    items: filtered.slice(start, start + pageSize),
    facets: {
      regions: countFacet(sorted.flatMap((card) => card.regions)),
      types: countFacet(sorted.map((card) => card.type)),
      rarities: countFacet(sorted.map((card) => card.rarity)),
      collections: [...collectionCounts.entries()]
        .sort((a, b) => b[1].count - a[1].count || a[0].localeCompare(b[0]))
        .map(([value, data]) => ({ value, label: data.label, count: data.count })),
      keywords: countFacet(
        sorted.flatMap((card) => unique([...card.keywords, ...card.customKeywords])),
      ),
    },
  };
}

function snapshotCard(defId: string) {
  return snapshot.cards.find((card) => card.defId === defId);
}

export function getStandaloneCardSnapshotInfo() {
  return {
    ...snapshot.source,
    schemaVersion: snapshot.schemaVersion,
  };
}

export async function getPublicCardCatalog(query: CardCatalogQuery = {}): Promise<PublicCardCatalogState> {
  try {
    const search = queryString(query);
    const data = await apiGet<PublicCardCatalogResponse>(
      `/api/public/game/cards${search ? `?${search}` : ""}`,
    );
    return { available: true, source: "api", data };
  } catch {
    if (snapshot.schemaVersion === 1 && snapshot.cards.length === snapshot.source.total) {
      return { available: true, source: "snapshot", data: querySnapshot(query) };
    }
    return { available: false, source: null, data: null };
  }
}

export async function getPublicCardState(defId: string): Promise<PublicCardState> {
  try {
    const response = await apiGet<{ ok: true; item: PublicCard }>(
      `/api/public/game/cards/${encodeURIComponent(defId)}`,
    );
    return { available: true, source: "api", item: response.item };
  } catch (error) {
    if (error instanceof RuneForgeApiError && error.status === 404) {
      return { available: false, source: "api", item: null };
    }

    const item = snapshotCard(defId);
    if (item) return { available: true, source: "snapshot", item };
    return { available: false, source: null, item: undefined };
  }
}

export async function getPublicCard(defId: string): Promise<PublicCard | null | undefined> {
  const state = await getPublicCardState(defId);
  return state.item;
}
