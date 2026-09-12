import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ShareCardButton from "@/components/ShareCardButton";
import { getPublicCardCatalog, getPublicCardState, getStandaloneCardSnapshotInfo } from "@/lib/cards/public-catalog";
import { portalMetadata } from "@/lib/portal/seo";

type Params = { params: Promise<{ defId: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { defId } = await params;
  const state = await getPublicCardState(defId);
  const card = state.item;
  if (!card) return portalMetadata({ title: "Carta indisponível", description: "Esta carta não está disponível no arquivo público de RuneForge.", path: `/cards/${encodeURIComponent(defId)}`, noIndex: true });
  return portalMetadata({
    title: card.name,
    description: `${card.type} de ${card.regions.join(" / ")} · ${card.rarity}. ${card.description}`.slice(0, 180),
    path: `/cards/${encodeURIComponent(card.defId)}`,
    image: card.art || null,
  });
}

export default async function CardDetailPage({ params }: Params) {
  const { defId } = await params;
  const state = await getPublicCardState(defId);
  const card = state.item;
  const snapshot = getStandaloneCardSnapshotInfo();
  if (card === null) notFound();

  if (card === undefined) {
    return <main className="catalog-shell"><header className="catalog-topbar"><Link className="content-brand" href="/"><span className="content-brand-mark">RF</span><span><strong>RuneForge</strong><small>Arquivo de cartas</small></span></Link><Link className="content-home-link" href="/cards">← Catálogo</Link></header><section className="card-catalog-empty detail-unavailable"><span>CATÁLOGO INDISPONÍVEL</span><h1>Não foi possível abrir esta carta.</h1><p>Nem a API pública nem o snapshot standalone contêm uma definição utilizável.</p><Link href="/cards">Voltar ao catálogo</Link></section></main>;
  }

  const keywords = [...new Set([...card.keywords, ...card.customKeywords])];
  const relatedState = await getPublicCardCatalog({ region: card.region, sort: "power-desc", page: 1, pageSize: 6 });
  const related = relatedState.available ? relatedState.data.items.filter((item) => item.defId !== card.defId).slice(0, 4) : [];

  return (
    <main className="catalog-shell card-detail-shell">
      <header className="catalog-topbar"><Link className="content-brand" href="/"><span className="content-brand-mark">RF</span><span><strong>RuneForge</strong><small>Arquivo de cartas</small></span></Link><nav><Link href="/cards">Catálogo</Link><Link href="/collections">Coleções</Link><Link href="/regions">Regiões</Link><Link href="/keywords">Mecânicas</Link><Link href="/rules">Regras</Link></nav><Link className="content-home-link" href="/cards">← Catálogo</Link></header>

      <article className="card-detail">
        <div className="card-detail-art"><div className="card-detail-frame">{card.art ? <img src={card.art} alt={card.name} /> : <div className="card-detail-placeholder"><span>{card.emoji}</span></div>}<b className="card-detail-cost">{card.cost}</b></div><div className="card-detail-collection">{card.collection.symbol ? <img src={card.collection.symbol} alt="" /> : null}<div><small>COLEÇÃO</small><strong>{card.collection.name}</strong><span>{card.collection.code}</span></div></div></div>
        <div className="card-detail-copy">
          <div className="content-kicker">{card.rarity} · {card.regions.join(" / ")}</div>
          <div className="card-detail-source" data-card-source={state.source}>{state.source === "api" ? "API AO VIVO" : `SNAPSHOT CERTIFICADO · ${snapshot.commitShort}`}</div>
          <h1>{card.name}</h1>
          <div className="card-detail-type">{card.type}<span>{card.structuralType !== card.type ? `Base: ${card.structuralType}` : card.structuralType}</span></div>
          <p className="card-rules-text">{card.description}</p>
          {card.flavor ? <blockquote>{card.flavor}</blockquote> : null}
          {typeof card.power === "number" && typeof card.health === "number" ? <div className="card-detail-combat"><span><small>PODER</small><strong>{card.power}</strong></span><span><small>VIDA</small><strong>{card.health}</strong></span></div> : null}
          <dl className="card-detail-data"><div><dt>Regiões</dt><dd>{card.regions.join(" · ")}</dd></div><div><dt>Raridade</dt><dd>{card.rarity}</dd></div><div><dt>Raças</dt><dd>{card.races.join(" · ") || "—"}</dd></div><div><dt>Classes</dt><dd>{card.classes.join(" · ") || "—"}</dd></div><div><dt>Papel</dt><dd>{card.strategicRole || "—"}</dd></div><div><dt>Identidade</dt><dd>{card.isChampion ? "Campeão" : card.isLegend ? "Lendária" : "Padrão"}</dd></div></dl>
          <section className="card-detail-keywords"><span>KEYWORDS</span><div>{keywords.length ? keywords.map((keyword) => <Link className="card-keyword-link" href={`/keywords/${encodeURIComponent(keyword)}`} key={keyword}>{keyword}</Link>) : <small>Sem keywords impressas.</small>}</div></section>
          <div className="card-detail-actions"><ShareCardButton title={card.name} /><Link href={`/cards?region=${encodeURIComponent(card.region)}`}>Mais de {card.region}</Link></div>
          <footer><code>{card.defId}</code><Link href={`/cards?collection=${encodeURIComponent(card.collection.key)}`}>Ver coleção →</Link></footer>
        </div>
      </article>

      {related.length ? <section className="card-related"><header><div><span className="content-kicker">CONTINUE EXPLORANDO</span><h2>Outras cartas de {card.region}</h2></div><Link href={`/cards?region=${encodeURIComponent(card.region)}`}>Ver região completa →</Link></header><div className="collection-card-mini-grid">{related.map((item) => <Link href={`/cards/${encodeURIComponent(item.defId)}`} key={item.defId}><div>{item.art ? <img src={item.art} alt="" /> : <span>{item.emoji}</span>}<b>{item.cost}</b></div><small>{item.rarity} · {item.collection.code}</small><strong>{item.name}</strong><em>{item.type}</em></Link>)}</div></section> : null}
    </main>
  );
}
