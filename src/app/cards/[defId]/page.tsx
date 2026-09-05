import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicCard } from "@/lib/cards/public-catalog";

export default async function CardDetailPage({ params }: { params: { defId: string } }) {
  const card = await getPublicCard(params.defId);
  if (card === null) notFound();

  if (card === undefined) {
    return (
      <main className="catalog-shell">
        <header className="catalog-topbar"><Link className="content-brand" href="/"><span className="content-brand-mark">RF</span><span><strong>RuneForge</strong><small>Arquivo de cartas</small></span></Link><Link className="content-home-link" href="/cards">← Catálogo</Link></header>
        <section className="card-catalog-empty detail-unavailable"><span>CONEXÃO INDISPONÍVEL</span><h1>Não foi possível abrir esta carta.</h1><p>O portal não armazena uma cópia paralela da definição. Tente novamente quando a API pública estiver disponível.</p><Link href="/cards">Voltar ao catálogo</Link></section>
      </main>
    );
  }

  const keywords = [...card.keywords, ...card.customKeywords];

  return (
    <main className="catalog-shell card-detail-shell">
      <header className="catalog-topbar">
        <Link className="content-brand" href="/"><span className="content-brand-mark">RF</span><span><strong>RuneForge</strong><small>Arquivo de cartas</small></span></Link>
        <nav><Link href="/cards">Catálogo</Link><Link href="/collections">Coleções</Link><Link href="/rules">Regras</Link></nav>
        <Link className="content-home-link" href="/cards">← Catálogo</Link>
      </header>

      <article className="card-detail">
        <div className="card-detail-art">
          <div className="card-detail-frame">
            {card.art ? <img src={card.art} alt={card.name} /> : <div className="card-detail-placeholder"><span>{card.emoji}</span></div>}
            <b className="card-detail-cost">{card.cost}</b>
          </div>
          <div className="card-detail-collection">
            {card.collection.symbol ? <img src={card.collection.symbol} alt="" /> : null}
            <div><small>COLEÇÃO</small><strong>{card.collection.name}</strong><span>{card.collection.code}</span></div>
          </div>
        </div>

        <div className="card-detail-copy">
          <div className="content-kicker">{card.rarity} · {card.regions.join(" / ")}</div>
          <h1>{card.name}</h1>
          <div className="card-detail-type">{card.type}<span>{card.structuralType !== card.type ? `Base: ${card.structuralType}` : card.structuralType}</span></div>
          <p className="card-rules-text">{card.description}</p>
          {card.flavor ? <blockquote>{card.flavor}</blockquote> : null}

          {typeof card.power === "number" && typeof card.health === "number" ? (
            <div className="card-detail-combat"><span><small>PODER</small><strong>{card.power}</strong></span><span><small>VIDA</small><strong>{card.health}</strong></span></div>
          ) : null}

          <dl className="card-detail-data">
            <div><dt>Regiões</dt><dd>{card.regions.join(" · ")}</dd></div>
            <div><dt>Raridade</dt><dd>{card.rarity}</dd></div>
            <div><dt>Raças</dt><dd>{card.races.join(" · ") || "—"}</dd></div>
            <div><dt>Classes</dt><dd>{card.classes.join(" · ") || "—"}</dd></div>
            <div><dt>Papel</dt><dd>{card.strategicRole || "—"}</dd></div>
            <div><dt>Identidade</dt><dd>{card.isChampion ? "Campeão" : card.isLegend ? "Lendária" : "Padrão"}</dd></div>
          </dl>

          <section className="card-detail-keywords">
            <span>KEYWORDS</span>
            <div>{keywords.length ? keywords.map((keyword) => <em key={keyword}>{keyword}</em>) : <small>Sem keywords impressas.</small>}</div>
          </section>

          <footer><code>{card.defId}</code><Link href={`/cards?collection=${encodeURIComponent(card.collection.key)}`}>Ver coleção →</Link></footer>
        </div>
      </article>
    </main>
  );
}
