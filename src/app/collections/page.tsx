import Link from "next/link";
import { getPublicCollections } from "@/lib/collections/public-collections";

function dateLabel(value?: string | null) {
  if (!value) return "Data não anunciada";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Data não anunciada"
    : new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(date);
}

function lifecycleLabel(value: string) {
  if (value === "active") return "ATIVA";
  if (value === "upcoming") return "EM BREVE";
  if (value === "rotated") return "ROTACIONADA";
  return value.toUpperCase();
}

export default async function CollectionsPage() {
  const state = await getPublicCollections();

  return (
    <main className="collections-shell">
      <header className="catalog-topbar">
        <Link className="content-brand" href="/">
          <span className="content-brand-mark">RF</span>
          <span><strong>RuneForge</strong><small>Arquivo de coleções</small></span>
        </Link>
        <nav aria-label="Coleções">
          <Link href="/cards">Cartas</Link>
          <Link href="/rules">Regras</Link>
          <Link href="/lore">Lore</Link>
        </nav>
        <Link className="content-home-link" href="/">Voltar à Forja</Link>
      </header>

      <section className="collections-hero">
        <div>
          <span className="content-kicker">ARQUIVO DE SETS</span>
          <h1>Coleções de RuneForge</h1>
          <p>Cada coleção publicada aqui vem diretamente do control plane do jogo, com símbolo, lifecycle e contagem real de cartas.</p>
        </div>
        <div className="collections-rune" aria-hidden="true">ᛟ</div>
      </section>

      {!state.available ? (
        <section className="card-catalog-empty">
          <span>ARQUIVO INDISPONÍVEL</span>
          <h2>As coleções não responderam.</h2>
          <p>O portal não mantém uma cópia paralela dos sets. Tente novamente quando a API pública do RuneForge estiver disponível.</p>
          <Link href="/collections">Tentar novamente</Link>
        </section>
      ) : state.collections.length ? (
        <section className="collections-grid" aria-label="Coleções publicadas">
          {state.collections.map((collection, index) => (
            <Link className="collection-card-live" href={`/collections/${encodeURIComponent(collection.key)}`} key={collection.key}>
              <div className="collection-banner">
                {collection.banner ? <img src={collection.banner} alt="" /> : <span>{String(index + 1).padStart(2, "0")}</span>}
                <em>{lifecycleLabel(collection.lifecycle)}</em>
              </div>
              <div className="collection-card-body">
                <div className="collection-symbol">
                  {collection.symbol ? <img src={collection.symbol} alt="" /> : <span>◆</span>}
                </div>
                <div>
                  <small>{collection.code}</small>
                  <h2>{collection.name}</h2>
                  <p>{collection.description || "Coleção publicada no arquivo oficial de RuneForge."}</p>
                </div>
                <dl>
                  <div><dt>Cartas</dt><dd>{collection.cardCount}</dd></div>
                  <div><dt>Lançamento</dt><dd>{dateLabel(collection.releaseDate)}</dd></div>
                </dl>
                <footer>Explorar coleção <span>↗</span></footer>
              </div>
            </Link>
          ))}
        </section>
      ) : (
        <section className="card-catalog-empty">
          <span>SEM COLEÇÕES PUBLICADAS</span>
          <h2>O arquivo ainda está fechado.</h2>
          <p>Assim que um set for publicado pelo control plane, ele aparecerá aqui automaticamente.</p>
          <Link href="/">Voltar à Forja</Link>
        </section>
      )}
    </main>
  );
}
