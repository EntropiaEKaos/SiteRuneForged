import { apiGet, RuneForgeApiError } from "@/lib/runeforge-api/client";
import type { PortalResourceKey } from "./content-model";

export type PortalPublishedItem<T> = {
  slug: string;
  locale: string;
  payload: T;
  seo?: unknown;
  version: number;
  publishedAt?: string | null;
};

type PublishedResponse<T> = {
  ok: true;
  resource: PortalResourceKey;
  item: PortalPublishedItem<T>;
};

type PublishedListResponse<T> = {
  ok: true;
  resource: PortalResourceKey;
  locale: string;
  items: PortalPublishedItem<T>[];
};

export async function getPublishedItem<T>(
  resource: PortalResourceKey,
  slug: string,
  fallback: PortalPublishedItem<T>,
  locale = "pt-BR",
): Promise<PortalPublishedItem<T>> {
  try {
    const response = await apiGet<PublishedResponse<T>>(
      `/api/public/site/${resource}/${encodeURIComponent(slug)}?locale=${encodeURIComponent(locale)}`,
    );
    return response.item ?? fallback;
  } catch {
    return fallback;
  }
}

export async function getPublishedItemOrNull<T>(
  resource: PortalResourceKey,
  slug: string,
  fallback: PortalPublishedItem<T>,
  locale = "pt-BR",
): Promise<PortalPublishedItem<T> | null> {
  try {
    const response = await apiGet<PublishedResponse<T>>(
      `/api/public/site/${resource}/${encodeURIComponent(slug)}?locale=${encodeURIComponent(locale)}`,
    );
    return response.item ?? null;
  } catch (error) {
    if (error instanceof RuneForgeApiError && error.status === 404) return null;
    return fallback;
  }
}

export async function getPublishedList<T>(
  resource: PortalResourceKey,
  fallback: PortalPublishedItem<T>[] = [],
  locale = "pt-BR",
): Promise<PortalPublishedItem<T>[]> {
  try {
    const response = await apiGet<PublishedListResponse<T>>(
      `/api/public/site/${resource}?locale=${encodeURIComponent(locale)}`,
    );
    return Array.isArray(response.items) ? response.items : fallback;
  } catch {
    return fallback;
  }
}

export async function getPublishedContent<T>(
  resource: PortalResourceKey,
  slug: string,
  fallback: T,
  locale = "pt-BR",
): Promise<T> {
  const item = await getPublishedItem(resource, slug, {
    slug,
    locale,
    payload: fallback,
    version: 0,
    publishedAt: null,
  }, locale);
  return item.payload;
}
