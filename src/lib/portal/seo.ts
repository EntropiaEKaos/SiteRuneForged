import type { Metadata } from "next";

const fallbackOrigin = "https://runeforge.example";

export function portalOrigin() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return fallbackOrigin;
  try {
    return new URL(raw).origin;
  } catch {
    return fallbackOrigin;
  }
}

export function absolutePortalUrl(path = "/") {
  return new URL(path, `${portalOrigin()}/`).toString();
}

export function portalMetadata(input: {
  title: string;
  description: string;
  path?: string;
  image?: string | null;
  type?: "website" | "article";
  noIndex?: boolean;
}): Metadata {
  const canonical = absolutePortalUrl(input.path || "/");
  const image = input.image ? absolutePortalUrl(input.image) : absolutePortalUrl("/opengraph-image");
  return {
    title: input.title,
    description: input.description,
    alternates: { canonical },
    robots: input.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title: input.title,
      description: input.description,
      url: canonical,
      siteName: "RuneForge",
      locale: "pt_BR",
      type: input.type ?? "website",
      images: [{ url: image, width: 1200, height: 630, alt: input.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [image],
    },
  };
}
