import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicKeyword } from "@/lib/keywords/public-keywords";
import { getPublicCardCatalog } from "@/lib/cards/public-catalog";

const domainLabel: Record<string, string> = {
  attack: "Ataque",
  blocking: "Bloqueio",
  strike: "Golpe",
  damage: "Dano",
  round: "Rodada",
  targeting: "Alvo",
  death: "Morte",
};

export default async function KeywordDetailPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const keyword = await getPublicKeyword(key);
  if (keyword === null) notFound();

  if (keyword === undefined) {
    return (
      <main className="keywords-shell">
        <header className="catalog-topbar">
          <Link className="content-brand" href="/"><span className="content-brand-mark">RF</span><span><strong>RuneForge</strong><small>Codex de mecânicas</small></span></Link>
          <Link className="content-home-link" href="/keywords">← Mecânicas</Link>
        </header>
        <section className="card-catalog-empty detail-unavailable">
          <span>CODEX INDISPONÍVEL</span>
          <h1>Não foi possível abrir esta mecânica.</h1>
          <p>A definição pública continua pertencendo ao RuneForgedTCG; o portal não substitui esse contrato por uma cópia local.</p>
          <Link href="/keywords">Voltar ao glossário</Link>
        </section>
      </main>
    );
  }

  const cards = await getPublicCardCatalog({ keyword: keyword.key, page: 1, pageSize: 24 });

  return (
    <main className="keywords-shell keyword-detail-shell">
      <header className="catalog-topbar">
        <Link className="content-brand" href="/"><span className="content-brand-mark">RF</span><span><strong>RuneForge</strong><small>Codex de mecânicas</small></span></Link>
        <nav><Link href="/cards">Cartas</Link><Link href="/regions">Regiões</Link><Link href="/rules">Regras</Link></nav>
        <Link className="content-home-link" href="/keywords">← Mecânicas</Link>
      </header>

      <section className="keyword-detail-hero">
        <div className="keyword-detail-icon">{keyword.icon || "✦"}</div>
        <div>
          <span className="content-kicker">{keyword.source === "canonical" ? "CONTRATO DA ENGINE" : "MECÂNICA PUBLICADA"}</span>
          <h1>{keyword.name}</h1>
          <p>{keyword.description}</p>
          <div className="keyword-detail-tags">
            {keyword.runtimeDomains.map((domain) => <span key={domain}>{domainLabel[domain] || domain}</span>)}
            {keyword.timing ? <span>Timing: {keyword.timing}</span> : null}
            <span>{keyword.grantable ? "Pode ser concedida" : "Não transferível"}</span>
          </div>
        </div>
      </section>

      <section className="keyword-facts">
        <div><small>CHAVE</small><strong>{keyword.key}</strong></div>
        <div><small>FONTE</small><strong>{keyword.source === "canonical" ? "Engine" : "Content Pipeline"}</strong></div>
        <div><small>CARTAS</small><strong>{keyword.cardCount}</strong></div>
        <div><small>CONTRATO</small><strong>{keyword.engineKeyword || keyword.timing || "Custom"}</strong></div>
      </section>

      {!cards.available ? (
        <section className="region-catalog-unavailable">
          <span>O catálogo de cartas está temporariamente indisponível. A definição da mecânica continua pública acima.</span>
          <Link href="/cards">Abrir catálogo geral</Link>
        </section>
      ) : (
        <section className="keyword-card-archive">
          <header>
            <div><span className="content-kicker">CARTAS COM ESTA MECÂNICA</span><h2>{cards.data.total} cartas públicas</h2></div>
            <Link href={`/cards?keyword=${encodeURIComponent(keyword.key)}`}>Filtrar catálogo completo →</Link>
          </header>
          {cards.data.items.length ? (
            <div className="collection-card-mini-grid">
              {cards.data.items.map((card) => (
                <Link href={`/cards/${encodeURIComponent(card.defId)}`} key={card.defId}>
                  <div>{card.art ? <img src={card.art} alt="" /> : <span>{card.emoji}</span>}<b>{card.cost}</b></div>
                  <small>{card.rarity} · {card.region}</small>
                  <strong>{card.name}</strong>
                  <em>{card.type}</em>
                </Link>
              ))}
            </div>
          ) : <div className="collection-cards-empty">Nenhuma carta pública usa esta mecânica atualmente.</div>}
        </section>
      )}
    </main>
  );
}
