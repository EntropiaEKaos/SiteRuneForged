export type PortalContentStatus = "draft" | "review" | "published" | "archived";

export type PortalAdminRole = "admin" | "designer" | "qa" | "liveops" | "publisher";

export type PortalResourceKey =
  | "home"
  | "navigation"
  | "pages"
  | "cards"
  | "collections"
  | "regions"
  | "keywords"
  | "rules"
  | "lore"
  | "news"
  | "media"
  | "seo"
  | "alpha"
  | "events"
  | "promotions"
  | "roadmap";

export interface PortalContentRecord<T = unknown> {
  id: string;
  resource: PortalResourceKey;
  slug: string;
  status: PortalContentStatus;
  locale: string;
  version: number;
  payload: T;
  updatedAt: string;
  updatedBy: string;
  publishedAt?: string | null;
}

export interface HomeContent {
  eyebrow: string;
  title: string;
  accentTitle: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  alphaLabel: string;
}

export interface SeoContent {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  noIndex?: boolean;
}

export interface PortalResourceDefinition {
  key: PortalResourceKey;
  label: string;
  description: string;
  ownerRoles: PortalAdminRole[];
  publishRoles: PortalAdminRole[];
}

export const portalResources: PortalResourceDefinition[] = [
  { key: "home", label: "Home", description: "Hero, CTAs, destaques e seções da página inicial.", ownerRoles: ["admin", "designer", "publisher"], publishRoles: ["admin", "publisher"] },
  { key: "navigation", label: "Navegação", description: "Menus, links globais, header e footer.", ownerRoles: ["admin", "designer", "publisher"], publishRoles: ["admin", "publisher"] },
  { key: "pages", label: "Páginas", description: "Páginas institucionais e blocos editoriais.", ownerRoles: ["admin", "designer", "publisher"], publishRoles: ["admin", "publisher"] },
  { key: "cards", label: "Cartas", description: "Catálogo público sincronizado com o Card Studio.", ownerRoles: ["admin", "designer", "qa"], publishRoles: ["admin", "publisher"] },
  { key: "collections", label: "Coleções", description: "Coleções, símbolos, textos e visibilidade pública.", ownerRoles: ["admin", "designer", "publisher"], publishRoles: ["admin", "publisher"] },
  { key: "regions", label: "Regiões", description: "Identidade, doutrina, textos, arte e destaque das regiões.", ownerRoles: ["admin", "designer", "publisher"], publishRoles: ["admin", "publisher"] },
  { key: "keywords", label: "Keywords", description: "Glossário público e explicações de mecânicas.", ownerRoles: ["admin", "designer", "qa"], publishRoles: ["admin", "publisher"] },
  { key: "rules", label: "Regras", description: "How to Play, regras completas, timing e FAQs.", ownerRoles: ["admin", "designer", "qa", "publisher"], publishRoles: ["admin", "publisher"] },
  { key: "lore", label: "Lore", description: "Universo, histórias, personagens e cronologia.", ownerRoles: ["admin", "designer", "publisher"], publishRoles: ["admin", "publisher"] },
  { key: "news", label: "Notícias", description: "Devlogs, anúncios, changelogs e notícias públicas.", ownerRoles: ["admin", "liveops", "publisher"], publishRoles: ["admin", "publisher", "liveops"] },
  { key: "media", label: "Mídia", description: "Biblioteca de imagens, banners e assets do portal.", ownerRoles: ["admin", "designer", "publisher"], publishRoles: ["admin", "publisher"] },
  { key: "seo", label: "SEO", description: "Metadata, Open Graph, canonical, indexação e sitemap.", ownerRoles: ["admin", "publisher"], publishRoles: ["admin", "publisher"] },
  { key: "alpha", label: "Alpha", description: "Status, CTAs, links de acesso e mensagens de disponibilidade.", ownerRoles: ["admin", "liveops", "publisher"], publishRoles: ["admin", "publisher", "liveops"] },
  { key: "events", label: "Eventos", description: "Calendário público, eventos e ativações especiais.", ownerRoles: ["admin", "liveops", "publisher"], publishRoles: ["admin", "publisher", "liveops"] },
  { key: "promotions", label: "Promoções", description: "Campanhas promocionais e destaques temporários.", ownerRoles: ["admin", "liveops", "publisher"], publishRoles: ["admin", "publisher", "liveops"] },
  { key: "roadmap", label: "Roadmap", description: "Marcos públicos, andamento e próximas entregas.", ownerRoles: ["admin", "liveops", "publisher"], publishRoles: ["admin", "publisher"] },
];
