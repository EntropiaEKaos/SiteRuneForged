import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicCardCatalog } from "@/lib/cards/public-catalog";
import { getPublicCollection } from "@/lib/collections/public-collections";
import { portalMetadata } from "@/lib/portal/seo";

type Params = { params: Promise<{ slug: string }> };

function dateLabel(value?: string | null) {
  if (!value) return "Não anunciada";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Não anunciada" : new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(date);
}

function lifecycleLabel(value: string) {
  if (value === "active") return "ATIVA";
  if (value === "upcoming") return "EM BREVE";
  if (value === "rotated") return "ROTACIONADA";
  return value.toUpperCase();
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getPublicCollection(slug);
  if (!collection) return portalMetadata({ title: "Coleção indisponível", description: "Coleção não disponível no arquivo público de RuneForge.", path: `/collections/${encodeURIComponent(slug)}`, noIndex: true });
  return portalMetadata({ title: collection.name, description: `${collection.name} (${collection.code}) — ${collection.cardCount} cartas públicas. ${collection.description || "Coleção oficial de RuneForge."}`.slice(0, 180), path: `/collections/${encodeURIComponent(collection.key)}`, image: collection.banner || collection.symbol || null });
}

function Breakdown({ title, items }: { title: string; items: Array<{ value: string; count: number }> }) {
  const max = Math.max(1, ...items.map((item) => item.count));
  return <section className="identity-breakdown"><span className="content-kicker">{title}</span><div>{items.slice(0, 8).map((item) => <article key={item.value}><header><strong>{item.value}</strong><span>{item.count}</span></header><i><b style={{ width: `${Math.max(8, (item.count / max) * 100)}%` }} /></i></article>)}</div></section>;
}

export default async function CollectionDetailPage({ params }: Params) {
  const { slug } = await params;
  const collection = await getPublicCollection(slug);
  if (collection === null) notFound();
  if (collection === undefined) return <main className="collections-shell"><header className="catalog-topbar"><Link className="content-brand" href="/"><span className="content-brand-mark">RF</span><span><strong>RuneForge</strong><small>Arquivo de coleções</small></span></Link><Link className="content-home-link" href="/collections">← Coleções</Link></header><section className="card-catalog-empty detail-unavailable"><span>ARQUIVO INDISPONÍVEL</span><h1>Não foi possível abrir esta coleção.</h1><p>O portal depende da fonte pública oficial e do snapshot certificado.</p><Link href="/collections">Voltar às coleções</Link></section></main>;

  const catalog = await getPublicCardCatalog({ collection: collection.key, page: 1, pageSize: 24 });
  const breakdown = catalog.available ? catalog.data.breakdown : undefined;

  return (
    <main className="collections-shell collection-detail-shell">
      <header className="catalog-topbar"><Link className="content-brand" href="/"><span className="content-brand-mark">RF</span><span><strong>RuneForge</strong><small>Arquivo de coleções</small></span></Link><nav><Link href="/cards">Cartas</Link><Link href="/regions">Regiões</Link><Link href="/rules">Regras</Link><Link href="/lore">Lore</Link></nav><Link className="content-home-link" href="/collections">← Coleções</Link></header>
      <section className="collection-detail-hero collection-identity-hero">{collection.banner ? <img className="collection-detail-banner" src={collection.banner} alt="" /> : null}<div className="collection-detail-shade" /><div className="collection-detail-copy"><div className="collection-detail-symbol">{collection.symbol ? <img src={collection.symbol} alt="" /> : <span>◆</span>}</div><div><span className="content-kicker">{collection.code} · {lifecycleLabel(collection.lifecycle)}</span><h1>{collection.name}</h1><p>{collection.description || "Coleção oficial publicada no arquivo de RuneForge."}</p><div className="collection-identity-actions"><Link href={`/cards?collection=${encodeURIComponent(collection.key)}`}>Explorar todas as cartas</Link><Link href="/regions">Ver regiões</Link></div></div></div></section>
      <section className="collection-facts"><div><small>CARTAS</small><strong>{collection.cardCount}</strong></div><div><small>LANÇAMENTO</small><strong>{dateLabel(collection.releaseDate)}</strong></div><div><small>ROTAÇÃO</small><strong>{dateLabel(collection.rotationDate)}</strong></div><div><small>ESTADO</small><strong>{lifecycleLabel(collection.lifecycle)}</strong></div></section>
      {breakdown ? <section className="identity-intelligence"><Breakdown title="DISTRIBUIÇÃO POR REGIÃO" items={breakdown.regions} /><Breakdown title="DISTRIBUIÇÃO POR RARIDADE" items={breakdown.rarities} /><Breakdown title="CURVA DE MANA" items={breakdown.costs.sort((a, b) => Number(a.value) - Number(b.value))} /></section> : null}
      {!catalog.available ? <section className="collection-cards-unavailable"><span>O catálogo de cartas desta coleção está temporariamente indisponível.</span><Link href="/cards">Abrir catálogo geral</Link></section> : <section className="collection-cards-section"><header><div><span className="content-kicker">CARTAS DA COLEÇÃO</span><h2>{catalog.data.total} cartas públicas</h2></div><Link href={`/cards?collection=${encodeURIComponent(collection.key)}`}>Ver no Explorer →</Link></header>{catalog.data.items.length ? <div className="collection-card-mini-grid">{catalog.data.items.map((card) => <Link href={`/cards/${encodeURIComponent(card.defId)}`} key={card.defId}><div>{card.art ? <img src={card.art} alt="" /> : <span>{card.emoji}</span>}<b>{card.cost}</b></div><small>{card.rarity} · {card.region}</small><strong>{card.name}</strong><em>{card.type}</em></Link>)}</div> : <div className="collection-cards-empty">Nenhuma carta pública foi encontrada para esta coleção.</div>}</section>}
    </main>
  );
}
