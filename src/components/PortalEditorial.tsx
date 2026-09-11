import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedItemOrNull, getPublishedList } from "@/lib/cms/public-content";
import { fallbackArticle, publicSections, type EditorialPayload, type PublicSectionKey } from "@/lib/cms/public-sections";
import { standaloneLoreArticles } from "@/lib/lore/standalone-lore";

function formatPublishedAt(value?: string | null) {
  if (!value) return "Snapshot local";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Publicado";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(date);
}

function fallbackFor(section: PublicSectionKey): EditorialFallback[] {
  return section === "lore"
    ? standaloneLoreArticles
    : publicSections[section].fallback;
}

type EditorialFallback = {
  slug: string;
  locale: string;
  payload: EditorialPayload;
  version: number;
  publishedAt?: string | null;
};

function PortalSectionNav() {
  return (
    <header className="content-nav">
      <Link className="content-brand" href="/">
        <span className="content-brand-mark">RF</span>
        <span><strong>RuneForge</strong><small>Portal oficial</small></span>
      </Link>
      <nav aria-label="Conteúdo público">
        <Link href="/news">Notícias</Link>
        <Link href="/lore">Lore</Link>
        <Link href="/rules">Regras</Link>
        <Link href="/collections">Coleções</Link>
        <Link href="/snapshot">Snapshot</Link>
        <Link href="/events">Eventos</Link>
        <Link href="/roadmap">Roadmap</Link>
      </nav>
      <Link className="content-home-link" href="/">Voltar à Forja</Link>
    </header>
  );
}

export async function PortalSectionIndex({ section }: { section: PublicSectionKey }) {
  const config = publicSections[section];
  const fallback = fallbackFor(section);
  const items = await getPublishedList<EditorialPayload>(config.resource, fallback);
  const usingLoreSnapshot = section === "lore" && items === fallback;

  return (
    <main className="content-shell">
      <PortalSectionNav />
      <section className="content-hero">
        <div className="content-hero-rune" aria-hidden="true">ᚱ</div>
        <div>
          <span className="content-kicker">{config.kicker}</span>
          <h1>{section === "lore" ? "RuneForge — Livro I" : config.title}</h1>
          <p>{section === "lore" ? "Quando as Runas Sangraram · Crônicas da Era da Fratura. O manuscrito atual permanece disponível no próprio deploy mesmo sem o backend." : config.description}</p>
          {usingLoreSnapshot ? <small className="content-kicker">SNAPSHOT DO MANUSCRITO · v0.3</small> : null}
        </div>
        <div className="content-count"><strong>{String(items.length).padStart(2, "0")}</strong><span>publicações</span></div>
      </section>

      <section className="content-grid" aria-label={config.title}>
        {items.map((item, index) => (
          <article className="content-card" key={item.slug}>
            <div className="content-card-top">
              <span>{item.payload.kicker || config.kicker}</span>
              <em>{item.payload.badge || String(index + 1).padStart(2, "0")}</em>
            </div>
            <h2>{item.payload.title || item.slug}</h2>
            <p>{item.payload.summary}</p>
            <div className="content-card-meta">
              <span>{formatPublishedAt(item.publishedAt)}</span>
              <span>v{item.version}</span>
            </div>
            <Link href={"/" + section + "/" + item.slug}>Abrir registro <span>↗</span></Link>
          </article>
        ))}
      </section>

      <footer className="content-footer">
        <span>RuneForge · CMS ao vivo com fallback de snapshot certificado</span>
        <Link href="/snapshot">Ver snapshot ↗</Link>
      </footer>
    </main>
  );
}

export async function PortalSectionArticle({ section, slug }: { section: PublicSectionKey; slug: string }) {
  const config = publicSections[section];
  const loreFallback = standaloneLoreArticles.find((entry) => entry.slug === slug);
  const fallback = section === "lore" && loreFallback ? loreFallback : fallbackArticle(section, slug);
  const item = await getPublishedItemOrNull<EditorialPayload>(config.resource, slug, fallback);
  if (!item) notFound();
  const body = item.payload.body?.length ? item.payload.body : [item.payload.summary];

  return (
    <main className="content-shell article-shell">
      <PortalSectionNav />
      <article className="article">
        <div className="article-back"><Link href={"/" + section}>← {config.title}</Link></div>
        <header>
          <span className="content-kicker">{item.payload.kicker || config.kicker}</span>
          <h1>{item.payload.title || item.slug}</h1>
          <p>{item.payload.summary}</p>
          <div className="article-meta">
            <span>{formatPublishedAt(item.publishedAt)}</span>
            <span>Versão pública {item.version}</span>
            {item.payload.badge ? <span>{item.payload.badge}</span> : null}
          </div>
        </header>
        <div className="article-body">
          {body.map((paragraph, index) => paragraph.startsWith("## ")
            ? <h2 key={index}>{paragraph.slice(3)}</h2>
            : <p key={index}>{paragraph}</p>)}
        </div>
        <div className="article-end"><span>◆</span><small>FIM DO REGISTRO</small><span>◆</span></div>
      </article>
      <footer className="content-footer">
        <span>Fonte pública · CMS ao vivo / snapshot RuneForge</span>
        <Link href="/snapshot">Proveniência do snapshot ↗</Link>
      </footer>
    </main>
  );
}
