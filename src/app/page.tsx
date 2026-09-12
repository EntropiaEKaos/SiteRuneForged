import Link from "next/link";
import { defaultAlphaLaunch, defaultCardsHome, defaultHome, defaultNavigation, defaultRegionsHome } from "@/lib/cms/defaults";
import { getPublishedContent, getPublishedList } from "@/lib/cms/public-content";
import { publicSections, type EditorialPayload } from "@/lib/cms/public-sections";
import type { AlphaLaunchContent, CardShowcaseContent, HomeContent, NavigationContent, RegionShowcaseContent } from "@/lib/cms/content-model";
import { getPublicCardCatalog } from "@/lib/cards/public-catalog";
import { getPublicCollections } from "@/lib/collections/public-collections";
import { absolutePortalUrl } from "@/lib/portal/seo";

export default async function HomePage() {
  const [home, navigation, cards, regions, alpha, liveCatalog, collections, news] = await Promise.all([
    getPublishedContent<HomeContent>("home", "main", defaultHome),
    getPublishedContent<NavigationContent>("navigation", "main", defaultNavigation),
    getPublishedContent<CardShowcaseContent>("cards", "home", defaultCardsHome),
    getPublishedContent<RegionShowcaseContent>("regions", "home", defaultRegionsHome),
    getPublishedContent<AlphaLaunchContent>("alpha", "main", defaultAlphaLaunch),
    getPublicCardCatalog({ sort: "power-desc", page: 1, pageSize: 6 }),
    getPublicCollections(),
    getPublishedList<EditorialPayload>("news", publicSections.news.fallback),
  ]);

  const liveCards = liveCatalog.available ? liveCatalog.data.items.slice(0, 6) : [];
  const foundation = collections.available ? collections.collections[0] : undefined;
  const latestNews = news.slice(0, 3);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: "RuneForge",
    url: absolutePortalUrl("/"),
    description: home.hero.description,
    genre: ["Collectible card game", "Strategy"],
    gamePlatform: "Web",
    inLanguage: "pt-BR",
  };

  return (
    <main id="top" className="home-v3">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <header className="nav-shell">
        <a className="brand" href="#top" aria-label="RuneForge início"><span className="brand-mark"><span>RF</span></span><span className="brand-copy"><strong>RuneForge</strong><small>{navigation.brandSubtitle}</small></span></a>
        <nav aria-label="Navegação principal">{navigation.links.map((link) => <a href={link.href} key={`${link.label}-${link.href}`}>{link.label}</a>)}<a href="/cards">Card Explorer</a><a href="/snapshot">Snapshot</a></nav>
        <a className="nav-cta" href={navigation.cta.href} data-analytics="home-primary-nav">{navigation.cta.label}</a>
      </header>

      <section className="hero hero-v3">
        <div className="hero-aurora" aria-hidden="true" /><div className="hero-grid" aria-hidden="true" />
        <div className="hero-copy"><div className="eyebrow"><span /> {home.hero.eyebrow} <span /></div><h1>{home.hero.title}<br/><em>{home.hero.accentTitle}</em></h1><p>{home.hero.description}</p><div className="actions"><a className="primary" href={home.hero.primaryCta.href} data-analytics="home-hero-primary">{home.hero.primaryCta.label}</a><a className="secondary" href="/cards" data-analytics="home-open-explorer">Explorar 446 cartas</a></div><div className="hero-stats">{home.hero.stats.map((stat) => <span key={`${stat.value}-${stat.label}`}><strong>{stat.value}</strong> {stat.label}</span>)}</div></div>
        <div className="hero-command-card"><span className="content-kicker">PORTAL OFICIAL</span><strong>Entre pelo universo, pelas cartas ou pelas regras.</strong><div><Link href="/cards">Card Explorer <span>↗</span></Link><Link href="/lore">Livro I <span>↗</span></Link><Link href="/rules">Como jogar <span>↗</span></Link></div><small>{liveCatalog.available ? `${liveCatalog.data.total} cartas públicas sincronizadas` : "Snapshot certificado disponível"}</small></div>
        <div className="scroll-mark">EXPLORE <span>↓</span></div>
      </section>

      <section className="home-discovery-strip" aria-label="Comece por aqui">
        <Link href="/cards"><small>01 · ARSENAL</small><strong>Descubra sua próxima carta</strong><span>Busca avançada por identidade, custo e mecânica →</span></Link>
        <Link href="/regions"><small>02 · DOUTRINAS</small><strong>Escolha uma região</strong><span>Conheça filosofias, estilos e arsenais →</span></Link>
        <Link href="/rules"><small>03 · CAMPO</small><strong>Aprenda a jogar</strong><span>Timing, prioridade, tipos e fundamentos →</span></Link>
      </section>

      {liveCards.length ? <section className="section home-live-cards"><div className="section-kicker">CARD EXPLORER · DADOS REAIS</div><div className="section-heading"><h2>Cartas que já vivem<br/><em>na Forja.</em></h2><p>Uma janela direta para o catálogo público certificado. Abra qualquer carta para ver identidade, regras, keywords, coleção e cartas relacionadas.</p></div><div className="home-card-rail">{liveCards.map((card) => <Link href={`/cards/${encodeURIComponent(card.defId)}`} key={card.defId} className="home-live-card" data-analytics="home-featured-card"><div>{card.art ? <img src={card.art} alt="" /> : <span>{card.emoji}</span>}<b>{card.cost}</b></div><small>{card.collection.code} · {card.rarity}</small><strong>{card.name}</strong><em>{card.type} · {card.region}</em></Link>)}</div><div className="home-section-action"><Link className="primary" href="/cards">Abrir Card Explorer</Link></div></section> : null}

      <section className="section intro" id="cards"><div className="section-kicker">{home.arsenal.kicker}</div><div className="section-heading"><h2>{home.arsenal.title.split("\n").map((line, index) => <span key={line}>{line}{index < home.arsenal.title.split("\n").length - 1 ? <br/> : null}</span>)}</h2><p>{home.arsenal.description}</p></div><div className="card-showcase">{cards.featured.map((card) => <article className={`featured-card card-${card.variant}`} key={card.title}><div className="card-frame"><span className="mana">{card.mana}</span><div className="card-art"><span>{card.region}</span></div><div className="card-info"><small>{card.meta}</small><h3>{card.title}</h3><p>{card.description}</p><div className="stats"><b>{card.stats[0]}</b><b>{card.stats[1]}</b></div></div></div></article>)}<div className="types-panel"><span>{cards.certifiedTypesLabel}</span><div>{cards.cardTypes.map((type, i) => <p key={type}><b>0{i+1}</b>{type}</p>)}</div></div></div></section>

      {foundation ? <section className="home-foundation"><div className="home-foundation-symbol">{foundation.symbol ? <img src={foundation.symbol} alt="" /> : <span>◆</span>}</div><div><span className="section-kicker">PRIMEIRA COLEÇÃO · {foundation.code}</span><h2>{foundation.name}</h2><p>{foundation.description || "A coleção que estabelece a linguagem mecânica e visual do primeiro ciclo de RuneForge."}</p><div className="home-foundation-facts"><span><strong>{foundation.cardCount}</strong> cartas</span><span><strong>6</strong> regiões</span><span><strong>Alpha</strong> foundation set</span></div></div><Link className="primary" href={`/collections/${encodeURIComponent(foundation.key)}`}>Explorar coleção</Link></section> : null}

      <section className="section regions" id="regions"><div className="section-kicker">{regions.kicker}</div><div className="section-heading"><h2>{regions.title.split("\n").map((line, index) => <span key={line}>{line}{index < regions.title.split("\n").length - 1 ? <br/> : null}</span>)}</h2><p>{regions.description}</p></div><div className="region-grid">{regions.items.map((region, i) => <article className="region-card" key={region.name}><div className="region-number">0{i+1}</div><div className="region-icon"><img src={region.icon} alt="" /></div><h3>{region.name}</h3><p>{region.description}</p><a href={region.href}>Conhecer doutrina <span>↗</span></a></article>)}</div></section>

      <section className="battle-section" id="rules"><div className="battle-overlay" /><div className="battle-copy"><span className="section-kicker">{home.battle.kicker}</span><h2>{home.battle.titleLines.map((line) => <span key={line}>{line}<br/></span>)}<em>{home.battle.accentLine}</em></h2><p>{home.battle.description}</p><div className="battle-points">{home.battle.points.map((point) => <span key={point.number}><b>{point.number}</b> {point.label}</span>)}</div><a className="primary" href={home.battle.cta.href}>{home.battle.cta.label}</a></div><div className="battle-rune" aria-hidden="true">ᛉ</div></section>

      {latestNews.length ? <section className="section home-news"><div className="section-kicker">CRÔNICAS DA FORJA</div><div className="section-heading"><h2>O que está mudando<br/>em RuneForge.</h2><p>Notícias, devlogs e marcos publicados pelo mesmo CMS versionado que alimenta o portal.</p></div><div className="home-news-grid">{latestNews.map((item) => <Link href={`/news/${encodeURIComponent(item.slug)}`} key={item.slug}><small>{item.payload.kicker || "NOTÍCIA"}</small><h3>{item.payload.title}</h3><p>{item.payload.summary}</p><span>Ler registro →</span></Link>)}</div><div className="home-section-action"><Link href="/news">Todas as notícias →</Link></div></section> : null}

      <section className="section alpha" id="alpha"><div className="alpha-panel"><div><span className="live-dot"/> {alpha.home.label}</div><h2>{alpha.home.title}</h2><p>{alpha.home.description}</p><div className="actions"><a className="primary" href="/alpha">{alpha.home.ctaLabel}</a><a className="secondary" href="/roadmap">Ver roadmap</a></div></div></section>

      <footer><div className="footer-brand"><span className="brand-mark small"><span>RF</span></span><div><strong>RuneForge</strong><small>{navigation.footerTagline}</small></div></div><a href="/cards">Card Explorer</a><a href="/snapshot">Snapshot</a><span>{navigation.footerLabel}</span><span>{navigation.copyright}</span></footer>
    </main>
  );
}
