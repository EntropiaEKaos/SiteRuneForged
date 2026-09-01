import { defaultCardsHome, defaultHome, defaultNavigation, defaultRegionsHome } from "@/lib/cms/defaults";
import { getPublishedContent } from "@/lib/cms/public-content";
import type { CardShowcaseContent, HomeContent, NavigationContent, RegionShowcaseContent } from "@/lib/cms/content-model";

export default async function HomePage() {
  const [home, navigation, cards, regions] = await Promise.all([
    getPublishedContent<HomeContent>("home", "main", defaultHome),
    getPublishedContent<NavigationContent>("navigation", "main", defaultNavigation),
    getPublishedContent<CardShowcaseContent>("cards", "home", defaultCardsHome),
    getPublishedContent<RegionShowcaseContent>("regions", "home", defaultRegionsHome),
  ]);

  return (
    <main id="top">
      <header className="nav-shell">
        <a className="brand" href="#top" aria-label="RuneForge início">
          <span className="brand-mark"><span>RF</span></span>
          <span className="brand-copy"><strong>RuneForge</strong><small>{navigation.brandSubtitle}</small></span>
        </a>
        <nav aria-label="Navegação principal">
          {navigation.links.map((link) => <a href={link.href} key={`${link.label}-${link.href}`}>{link.label}</a>)}
        </nav>
        <a className="nav-cta" href={navigation.cta.href}>{navigation.cta.label}</a>
      </header>

      <section className="hero">
        <div className="hero-aurora" aria-hidden="true" />
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-copy">
          <div className="eyebrow"><span /> {home.hero.eyebrow} <span /></div>
          <h1>{home.hero.title}<br/><em>{home.hero.accentTitle}</em></h1>
          <p>{home.hero.description}</p>
          <div className="actions"><a className="primary" href={home.hero.primaryCta.href}>{home.hero.primaryCta.label}</a><a className="secondary" href={home.hero.secondaryCta.href}>{home.hero.secondaryCta.label}</a></div>
          <div className="hero-stats">{home.hero.stats.map((stat) => <span key={`${stat.value}-${stat.label}`}><strong>{stat.value}</strong> {stat.label}</span>)}</div>
        </div>
        <div className="sigil-stage" aria-hidden="true">
          <div className="sigil-orbit orbit-one" /><div className="sigil-orbit orbit-two" />
          <div className="sigil-core"><span>ᚱ</span></div>
          <i className="spark spark-a"/><i className="spark spark-b"/><i className="spark spark-c"/>
        </div>
        <div className="scroll-mark">EXPLORE <span>↓</span></div>
      </section>

      <section className="section intro" id="cards">
        <div className="section-kicker">{home.arsenal.kicker}</div>
        <div className="section-heading"><h2>{home.arsenal.title.split("\n").map((line, index) => <span key={line}>{line}{index < home.arsenal.title.split("\n").length - 1 ? <br/> : null}</span>)}</h2><p>{home.arsenal.description}</p></div>
        <div className="card-showcase">
          {cards.featured.map((card) => <article className={`featured-card card-${card.variant}`} key={card.title}><div className="card-frame"><span className="mana">{card.mana}</span><div className="card-art"><span>{card.region}</span></div><div className="card-info"><small>{card.meta}</small><h3>{card.title}</h3><p>{card.description}</p><div className="stats"><b>{card.stats[0]}</b><b>{card.stats[1]}</b></div></div></div></article>)}
          <div className="types-panel"><span>{cards.certifiedTypesLabel}</span><div>{cards.cardTypes.map((type, i) => <p key={type}><b>0{i+1}</b>{type}</p>)}</div></div>
        </div>
      </section>

      <section className="section regions" id="regions">
        <div className="section-kicker">{regions.kicker}</div>
        <div className="section-heading"><h2>{regions.title.split("\n").map((line, index) => <span key={line}>{line}{index < regions.title.split("\n").length - 1 ? <br/> : null}</span>)}</h2><p>{regions.description}</p></div>
        <div className="region-grid">
          {regions.items.map((region, i) => <article className="region-card" key={region.name}><div className="region-number">0{i+1}</div><div className="region-icon"><img src={region.icon} alt="" /></div><h3>{region.name}</h3><p>{region.description}</p><a href={region.href}>Conhecer doutrina <span>↗</span></a></article>)}
        </div>
      </section>

      <section className="battle-section" id="rules">
        <div className="battle-overlay" />
        <div className="battle-copy"><span className="section-kicker">{home.battle.kicker}</span><h2>{home.battle.titleLines.map((line) => <span key={line}>{line}<br/></span>)}<em>{home.battle.accentLine}</em></h2><p>{home.battle.description}</p><div className="battle-points">{home.battle.points.map((point) => <span key={point.number}><b>{point.number}</b> {point.label}</span>)}</div><a className="primary" href={home.battle.cta.href}>{home.battle.cta.label}</a></div>
        <div className="battle-rune" aria-hidden="true">ᛉ</div>
      </section>

      <section className="section alpha" id="alpha">
        <div className="alpha-panel"><div><span className="live-dot"/> {home.alpha.label}</div><h2>{home.alpha.title}</h2><p>{home.alpha.description}</p><a className="primary" href={home.alpha.cta.href}>{home.alpha.cta.label}</a></div>
      </section>

      <footer><div className="footer-brand"><span className="brand-mark small"><span>RF</span></span><div><strong>RuneForge</strong><small>{navigation.footerTagline}</small></div></div><span>{navigation.footerLabel}</span><span>{navigation.copyright}</span></footer>
    </main>
  );
}
