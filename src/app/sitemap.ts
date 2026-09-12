import type { MetadataRoute } from "next";
import snapshotJson from "@/data/card-catalog-snapshot.json";
import { defaultRegionsHome } from "@/lib/cms/defaults";
import { publicSections } from "@/lib/cms/public-sections";
import { absolutePortalUrl } from "@/lib/portal/seo";

type Snapshot = { cards: Array<{ defId: string }> };

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "/", "/alpha", "/cards", "/collections", "/regions", "/keywords", "/rules",
    "/lore", "/news", "/events", "/roadmap", "/snapshot",
  ];
  const now = new Date();
  const entries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: absolutePortalUrl(path),
    lastModified: now,
    changeFrequency: path === "/" || path === "/news" ? "daily" : "weekly",
    priority: path === "/" ? 1 : path === "/cards" ? 0.9 : 0.75,
  }));

  const snapshot = snapshotJson as Snapshot;
  for (const card of snapshot.cards) {
    entries.push({
      url: absolutePortalUrl(`/cards/${encodeURIComponent(card.defId)}`),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.65,
    });
  }

  entries.push({
    url: absolutePortalUrl("/collections/vanilla"),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  });

  for (const region of defaultRegionsHome.items) {
    entries.push({
      url: absolutePortalUrl(`/regions/${encodeURIComponent(region.name.trim().toLocaleLowerCase("en-US"))}`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75,
    });
  }

  for (const [section, config] of Object.entries(publicSections)) {
    for (const item of config.fallback) {
      entries.push({
        url: absolutePortalUrl(`/${section}/${encodeURIComponent(item.slug)}`),
        lastModified: now,
        changeFrequency: "monthly",
        priority: section === "lore" ? 0.7 : 0.55,
      });
    }
  }

  return entries;
}
