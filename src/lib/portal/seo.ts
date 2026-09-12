import type { Metadata } from "next";

function candidateOrigin() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit;
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (production) return `https://${production}`;
  const deployment = process.env.VERCEL_URL?.trim();
  if (deployment) return `https://${deployment}`;
  return "http://localhost:3000";
}

export function portalOrigin() {
  try {
    return new URL(candidateOrigin()).origin;
  } catch {
    return "http://localhost:3000";
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
