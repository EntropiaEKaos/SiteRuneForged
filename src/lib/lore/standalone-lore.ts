import { loreBookSnapshot } from "@/data/lore-book";

export type StandaloneLorePayload = {
  kicker?: string;
  title: string;
  summary: string;
  body?: string[];
  meta?: string;
  badge?: string;
};

export type StandaloneLoreArticle = {
  slug: string;
  locale: string;
  payload: StandaloneLorePayload;
  version: number;
  publishedAt: string | null;
};

export const standaloneLoreArticles: StandaloneLoreArticle[] = loreBookSnapshot.entries
  .slice()
  .sort((a, b) => a.order - b.order)
  .map((entry) => ({
    slug: entry.slug,
    locale: loreBookSnapshot.book.locale,
    payload: {
      kicker: entry.section.toUpperCase(),
      title: entry.title,
      summary: entry.summary,
      body: entry.body,
      meta: `${loreBookSnapshot.book.book} · ${loreBookSnapshot.book.version}`,
      badge: loreBookSnapshot.book.version.toUpperCase(),
    },
    version: 3,
    publishedAt: null,
  }));

export function getStandaloneLoreSnapshotInfo() {
  return {
    schemaVersion: loreBookSnapshot.schemaVersion,
    ...loreBookSnapshot.book,
  };
}
