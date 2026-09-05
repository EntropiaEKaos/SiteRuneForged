import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicCardCatalog } from "@/lib/cards/public-catalog";
import { getPublicCollection } from "@/lib/collections/public-collections";

function dateLabel(value?: string | null) {
  if (!value) return "Não anunciada";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Não anunciada"
    : new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(date);
}

function lifecycleLabel(value: string) {
  if (value === "active") return "ATIVA";
  if (value === "upcoming") return "EM BREVE";
  if (value === "rotated") return "ROTACIONADA";
  return value.toUpperCase();
}

export default async function CollectionDetailPage({ params }: { params: { slug: string } }) {
  const collection = await getPublicCollection(params.slug);
  if (collection === null) notFound();

  if (collection === undefined) {
    return (
      <main className="collections-shell">
        <header className="catalog-topbar">
          <Link className="content-brand" href="/"><span className="content-brand-mark">RF</span><span><strong>RuneForge</strong><small>Arquivo de coleções</small></span></Link>
          <Link className="content-home-link" href="/collections">← Coleções</Link>
        </header>
        <section className="card-catalog-empty detail-unavailable">
          <span>ARQUIVO INDISPONÍVEL</span>
          <h1>Não foi possível abrir esta coleção.</h1>
          <p>O portal depende da fonte pública oficial e não usa uma cópia local do set.</p>
          <Link href="/collections">Voltar às coleções</Link>
        </section>
      </main>
    );
  }

  const catalog = await getPublicCardCatalog({ collection: collection.key, page: 1, pageSize: 24 });

  return (
    <main className="collections-shell collection-detail-shell">
      <header className="catalog-topbar">
        <Link className="content-brand" href="/"><span className="content-brand-mark">RF</span><span><strong>RuneForge</strong><small>Arquivo de coleções</small></span></Link>
        <nav><Link href="/cards">Cartas</Link><Link href="/rules">Regras</Link><Link href="/lore">Lore</Link></nav>
        <Link className="content-home-link" href="/collections">← Coleções</Link>
      </header>

      <section className="collection-detail-hero">
        {collection.banner ? <img className="collection-detail-banner" src={collection.banner} alt="" /> : null}
        <div className="collection-detail-shade" />
        <div className="collection-detail-copy">
          <div className="collection-detail-symbol">
            {collection.symbol ? <img src={collection.symbol} alt="" /> : <span>◆</span>}
          </div>
          <div>
            <span className="content-kicker">{collection.code} · {lifecycleLabel(collection.lifecycle)}</span>
            <h1>{collection.name}</h1>
            <p>{collection.description || "Coleção oficial publicada no arquivo de RuneForge."}</p>
          </div>
        </div>
      </section>

      <section className="collection-facts">
        <div><small>CARTAS</small><strong>{collection.cardCount}</strong></div>
        <div><small>LANÇAMENTO</small><strong>{dateLabel(collection.releaseDate)}</strong></div>
        <div><small>ROTAÇÃO</small><strong>{dateLabel(collection.rotationDate)}</strong></div>
        <div><small>ESTADO</small><strong>{lifecycleLabel(collection.lifecycle)}</strong></div>
      </section>

      {!catalog.available ? (
        <section className="collection-cards-unavailable">
          <span>O catálogo de cartas desta coleção está temporariamente indisponível.</span>
          <Link href="/cards">Abrir catálogo geral</Link>
        </section>
      ) : (
        <section className="collection-cards-section">
          <header>
            <div><span className="content-kicker">CARTAS DA COLEÇÃO</span><h2>{catalog.data.total} cartas públicas</h2></div>
            <Link href={`/cards?collection=${encodeURIComponent(collection.key)}`}>Ver catálogo completo →</Link>
          </header>
          {catalog.data.items.length ? (
            <div className="collection-card-mini-grid">
              {catalog.data.items.map((card) => (
                <Link href={`/cards/${encodeURIComponent(card.defId)}`} key={card.defId}>
                  <div>{card.art ? <img src={card.art} alt="" /> : <span>{card.emoji}</span>}<b>{card.cost}</b></div>
                  <small>{card.rarity} · {card.region}</small>
                  <strong>{card.name}</strong>
                  <em>{card.type}</em>
                </Link>
              ))}
            </div>
          ) : (
            <div className="collection-cards-empty">Nenhuma carta pública foi encontrada para esta coleção.</div>
          )}
        </section>
      )}
    </main>
  );
}
