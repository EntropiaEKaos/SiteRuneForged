import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedItemOrNull, getPublishedList } from "@/lib/cms/public-content";
import { fallbackArticle, publicSections, type EditorialPayload, type PublicSectionKey } from "@/lib/cms/public-sections";

function formatPublishedAt(value?: string | null) {
  if (!value) return "Conteúdo base";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Publicado";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(date);
}

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
        <Link href="/events">Eventos</Link>
        <Link href="/roadmap">Roadmap</Link>
      </nav>
      <Link className="content-home-link" href="/">Voltar à Forja</Link>
    </header>
  );
}

export async function PortalSectionIndex({ section }: { section: PublicSectionKey }) {
  const config = publicSections[section];
  const items = await getPublishedList<EditorialPayload>(config.resource, config.fallback);

  return (
    <main className="content-shell">
      <PortalSectionNav />
      <section className="content-hero">
        <div className="content-hero-rune" aria-hidden="true">ᚱ</div>
        <div>
          <span className="content-kicker">{config.kicker}</span>
          <h1>{config.title}</h1>
          <p>{config.description}</p>
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
        <span>RuneForge · conteúdo publicado pelo Portal CMS</span>
        <Link href="/">Portal principal ↗</Link>
      </footer>
    </main>
  );
}

export async function PortalSectionArticle({ section, slug }: { section: PublicSectionKey; slug: string }) {
  const config = publicSections[section];
  const fallback = fallbackArticle(section, slug);
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
          {body.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </div>
        <div className="article-end"><span>◆</span><small>FIM DO REGISTRO</small><span>◆</span></div>
      </article>
      <footer className="content-footer">
        <span>Fonte pública · RuneForge Portal CMS</span>
        <Link href="/">Voltar à Forja ↗</Link>
      </footer>
    </main>
  );
}
