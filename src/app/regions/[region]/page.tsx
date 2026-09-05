import Link from "next/link";
import { notFound } from "next/navigation";
import { defaultRegionsHome } from "@/lib/cms/defaults";
import { getPublishedContent } from "@/lib/cms/public-content";
import type { RegionShowcaseContent } from "@/lib/cms/content-model";
import { getPublicCardCatalog } from "@/lib/cards/public-catalog";

function key(value: string) {
  return value.trim().toLocaleLowerCase("en-US");
}

export default async function RegionDetailPage({ params }: { params: { region: string } }) {
  const regions = await getPublishedContent<RegionShowcaseContent>("regions", "home", defaultRegionsHome);
  const region = regions.items.find((item) => key(item.name) === key(params.region));
  if (!region) notFound();

  const catalog = await getPublicCardCatalog({ region: region.name, page: 1, pageSize: 24 });

  return (
    <main className="regions-live-shell region-detail-shell">
      <header className="catalog-topbar">
        <Link className="content-brand" href="/"><span className="content-brand-mark">RF</span><span><strong>RuneForge</strong><small>Doutrinas regionais</small></span></Link>
        <nav><Link href="/cards">Cartas</Link><Link href="/collections">Coleções</Link><Link href="/rules">Regras</Link></nav>
        <Link className="content-home-link" href="/regions">← Regiões</Link>
      </header>

      <section className="region-detail-hero">
        <div className="region-detail-glyph">{region.icon ? <img src={region.icon} alt="" /> : <span>◆</span>}</div>
        <div>
          <span className="content-kicker">DOUTRINA REGIONAL</span>
          <h1>{region.name}</h1>
          <p>{region.description}</p>
          <div className="region-detail-actions">
            <Link href={`/cards?region=${encodeURIComponent(region.name)}`}>Ver todas as cartas</Link>
            <Link href="/rules">Abrir regras</Link>
          </div>
        </div>
      </section>

      {!catalog.available ? (
        <section className="region-catalog-unavailable">
          <span>O catálogo de cartas está temporariamente indisponível. A identidade editorial desta região continua publicada pelo Portal CMS.</span>
          <Link href="/cards">Abrir catálogo geral</Link>
        </section>
      ) : (
        <section className="region-card-archive">
          <header>
            <div><span className="content-kicker">ARSENAL REGIONAL</span><h2>{catalog.data.total} cartas públicas</h2></div>
            <Link href={`/cards?region=${encodeURIComponent(region.name)}`}>Filtrar catálogo completo →</Link>
          </header>
          {catalog.data.items.length ? (
            <div className="collection-card-mini-grid">
              {catalog.data.items.map((card) => (
                <Link href={`/cards/${encodeURIComponent(card.defId)}`} key={card.defId}>
                  <div>{card.art ? <img src={card.art} alt="" /> : <span>{card.emoji}</span>}<b>{card.cost}</b></div>
                  <small>{card.rarity} · {card.collection.code}</small>
                  <strong>{card.name}</strong>
                  <em>{card.type}</em>
                </Link>
              ))}
            </div>
          ) : <div className="collection-cards-empty">Nenhuma carta pública encontrada para esta região.</div>}
        </section>
      )}
    </main>
  );
}
