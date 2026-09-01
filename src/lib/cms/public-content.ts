import { apiGet } from "@/lib/runeforge-api/client";
import type { PortalResourceKey } from "./content-model";

type PublishedResponse<T> = {
  ok: true;
  resource: PortalResourceKey;
  item: {
    slug: string;
    locale: string;
    payload: T;
    seo?: unknown;
    version: number;
    publishedAt?: string | null;
  };
};

export async function getPublishedContent<T>(
  resource: PortalResourceKey,
  slug: string,
  fallback: T,
  locale = "pt-BR",
): Promise<T> {
  try {
    const response = await apiGet<PublishedResponse<T>>(
      `/api/public/site/${resource}/${encodeURIComponent(slug)}?locale=${encodeURIComponent(locale)}`,
    );
    return response.item?.payload ?? fallback;
  } catch {
    return fallback;
  }
}
