import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { defaultRegionsHome } from "@/lib/cms/defaults";
import { getPublishedContent } from "@/lib/cms/public-content";
import type { RegionShowcaseContent } from "@/lib/cms/content-model";
import { getPublicCardCatalog } from "@/lib/cards/public-catalog";
import { portalMetadata } from "@/lib/portal/seo";

type Params = { params: Promise<{ region: string }> };

function key(value: string) {
  return value.trim().toLocaleLowerCase("en-US");
}

async function getRegion(regionParam: string) {
  const regions = await getPublishedContent<RegionShowcaseContent>("regions", "home", defaultRegionsHome);
  return regions.items.find((item) => key(item.name) === key(regionParam));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { region: regionParam } = await params;
  const region = await getRegion(regionParam);
  if (!region) return portalMetadata({ title: "Região não encontrada", description: "Esta doutrina regional não está no arquivo público de RuneForge.", path: `/regions/${encodeURIComponent(regionParam)}`, noIndex: true });
  return portalMetadata({ title: region.name, description: region.description, path: `/regions/${encodeURIComponent(key(region.name))}`, image: region.icon || null });
}

function Breakdown({ title, items }: { title: string; items: Array<{ value: string; count: number }> }) {
  const max = Math.max(1, ...items.map((item) => item.count));
  return <section className="identity-breakdown"><span className="content-kicker">{title}</span><div>{items.slice(0, 8).map((item) => <article key={item.value}><header><strong>{item.value}</strong><span>{item.count}</span></header><i><b style={{ width: `${Math.max(8, (item.count / max) * 100)}%` }} /></i></article>)}</div></section>;
}

export default async function RegionDetailPage({ params }: Params) {
  const { region: regionParam } = await params;
  const region = await getRegion(regionParam);
  if (!region) notFound();
  const catalog = await getPublicCardCatalog({ region: region.name, page: 1, pageSize: 24 });
  const breakdown = catalog.available ? catalog.data.breakdown : undefined;

  return (
    <main className="regions-live-shell region-detail-shell">
      <header className="catalog-topbar"><Link className="content-brand" href="/"><span className="content-brand-mark">RF</span><span><strong>RuneForge</strong><small>Doutrinas regionais</small></span></Link><nav><Link href="/cards">Cartas</Link><Link href="/collections">Coleções</Link><Link href="/rules">Regras</Link><Link href="/lore">Lore</Link></nav><Link className="content-home-link" href="/regions">← Regiões</Link></header>
      <section className="region-detail-hero region-identity-hero"><div className="region-detail-glyph">{region.icon ? <img src={region.icon} alt="" /> : <span>◆</span>}</div><div><span className="content-kicker">DOUTRINA REGIONAL</span><h1>{region.name}</h1><p>{region.description}</p><div className="region-detail-actions"><Link href={`/cards?region=${encodeURIComponent(region.name)}`}>Ver todas as cartas</Link><Link href="/rules">Abrir regras</Link><Link href="/lore">Explorar lore</Link></div></div></section>
      {catalog.available ? <section className="region-identity-summary"><div><small>ARSENAL PÚBLICO</small><strong>{catalog.data.total}</strong><span>cartas</span></div><div><small>TIPOS PRESENTES</small><strong>{breakdown?.types.length ?? 0}</strong><span>identidades</span></div><div><small>RARIDADES</small><strong>{breakdown?.rarities.length ?? 0}</strong><span>faixas</span></div><div><small>RAÇAS</small><strong>{breakdown?.races.length ?? 0}</strong><span>no arsenal</span></div></section> : null}
      {breakdown ? <section className="identity-intelligence"><Breakdown title="TIPOS DE CARTA" items={breakdown.types} /><Breakdown title="RARIDADES" items={breakdown.rarities} /><Breakdown title="CURVA DE MANA" items={breakdown.costs.sort((a, b) => Number(a.value) - Number(b.value))} /></section> : null}
      {!catalog.available ? <section className="region-catalog-unavailable"><span>O catálogo de cartas está temporariamente indisponível. A identidade editorial desta região continua publicada pelo Portal CMS.</span><Link href="/cards">Abrir catálogo geral</Link></section> : <section className="region-card-archive"><header><div><span className="content-kicker">ARSENAL REGIONAL</span><h2>{catalog.data.total} cartas públicas</h2></div><Link href={`/cards?region=${encodeURIComponent(region.name)}`}>Filtrar no Explorer →</Link></header>{catalog.data.items.length ? <div className="collection-card-mini-grid">{catalog.data.items.map((card) => <Link href={`/cards/${encodeURIComponent(card.defId)}`} key={card.defId}><div>{card.art ? <img src={card.art} alt="" /> : <span>{card.emoji}</span>}<b>{card.cost}</b></div><small>{card.rarity} · {card.collection.code}</small><strong>{card.name}</strong><em>{card.type}</em></Link>)}</div> : <div className="collection-cards-empty">Nenhuma carta pública encontrada para esta região.</div>}</section>}
    </main>
  );
}
