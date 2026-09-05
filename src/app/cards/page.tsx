import Link from "next/link";
import { getPublicCardCatalog, type CardCatalogQuery, type CardFacet } from "@/lib/cards/public-catalog";

type Search = Record<string, string | string[] | undefined>;

function scalar(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function queryFrom(searchParams: Search): CardCatalogQuery {
  return {
    q: scalar(searchParams.q),
    region: scalar(searchParams.region),
    type: scalar(searchParams.type),
    rarity: scalar(searchParams.rarity),
    collection: scalar(searchParams.collection),
    page: scalar(searchParams.page) || "1",
    pageSize: "24",
  };
}

function catalogHref(query: CardCatalogQuery, patch: CardCatalogQuery) {
  const params = new URLSearchParams();
  const merged = { ...query, ...patch };
  for (const [key, raw] of Object.entries(merged)) {
    const value = String(raw ?? "").trim();
    if (value && !(key === "page" && value === "1") && key !== "pageSize") params.set(key, value);
  }
  const search = params.toString();
  return `/cards${search ? `?${search}` : ""}`;
}

function options(facets: CardFacet[]) {
  return facets.map((facet) => (
    <option value={facet.value} key={facet.value}>
      {facet.label || facet.value} ({facet.count})
    </option>
  ));
}

export default async function CardsPage({ searchParams = {} }: { searchParams?: Search }) {
  const query = queryFrom(searchParams);
  const state = await getPublicCardCatalog(query);

  return (
    <main className="catalog-shell">
      <header className="catalog-topbar">
        <Link className="content-brand" href="/">
          <span className="content-brand-mark">RF</span>
          <span><strong>RuneForge</strong><small>Arquivo de cartas</small></span>
        </Link>
        <nav aria-label="Catálogo">
          <Link href="/collections">Coleções</Link>
          <Link href="/rules">Regras</Link>
          <Link href="/lore">Lore</Link>
        </nav>
        <Link className="content-home-link" href="/">Voltar à Forja</Link>
      </header>

      <section className="catalog-hero">
        <div>
          <span className="content-kicker">ARQUIVO DA FORJA</span>
          <h1>Catálogo de cartas</h1>
          <p>Explore o catálogo público diretamente da fonte de verdade do jogo. Filtros e detalhes refletem apenas cartas colecionáveis com identidade pública.</p>
        </div>
        <div className="catalog-sigil" aria-hidden="true">◆</div>
      </section>

      {!state.available ? (
        <section className="card-catalog-empty">
          <span>CONEXÃO INDISPONÍVEL</span>
          <h2>O arquivo de cartas não respondeu.</h2>
          <p>O portal não mantém uma cópia paralela do catálogo. Tente novamente quando a API pública do RuneForge estiver disponível.</p>
          <Link href="/cards">Tentar novamente</Link>
        </section>
      ) : (
        <>
          <form className="catalog-filters" action="/cards" method="get">
            <label className="catalog-search">
              <span>Buscar</span>
              <input name="q" defaultValue={String(query.q || "")} placeholder="Nome, texto, keyword, raça…" />
            </label>
            <label>
              <span>Região</span>
              <select name="region" defaultValue={String(query.region || "")}>
                <option value="">Todas</option>
                {options(state.data.facets.regions)}
              </select>
            </label>
            <label>
              <span>Tipo</span>
              <select name="type" defaultValue={String(query.type || "")}>
                <option value="">Todos</option>
                {options(state.data.facets.types)}
              </select>
            </label>
            <label>
              <span>Raridade</span>
              <select name="rarity" defaultValue={String(query.rarity || "")}>
                <option value="">Todas</option>
                {options(state.data.facets.rarities)}
              </select>
            </label>
            <label>
              <span>Coleção</span>
              <select name="collection" defaultValue={String(query.collection || "")}>
                <option value="">Todas</option>
                {options(state.data.facets.collections)}
              </select>
            </label>
            <button type="submit">Filtrar</button>
            <Link href="/cards">Limpar</Link>
          </form>

          <section className="catalog-summary">
            <div><strong>{state.data.total}</strong><span>cartas encontradas</span></div>
            <div><span>Catálogo</span><code>{state.data.catalogRevision}</code></div>
          </section>

          {state.data.items.length ? (
            <section className="catalog-grid" aria-label="Cartas públicas">
              {state.data.items.map((card) => (
                <Link className="catalog-card" href={`/cards/${encodeURIComponent(card.defId)}`} key={card.defId}>
                  <div className="catalog-card-art">
                    {card.art ? <img src={card.art} alt="" /> : <span>{card.emoji}</span>}
                    <b>{card.cost}</b>
                  </div>
                  <div className="catalog-card-copy">
                    <div className="catalog-card-meta"><span>{card.collection.code}</span><span>{card.rarity}</span></div>
                    <h2>{card.name}</h2>
                    <p>{card.type} · {card.regions.join(" / ")}</p>
                    <div className="catalog-card-stats">
                      <span>{card.keywords.slice(0, 2).join(" · ") || card.structuralType}</span>
                      {typeof card.power === "number" && typeof card.health === "number" ? <strong>{card.power}/{card.health}</strong> : null}
                    </div>
                  </div>
                </Link>
              ))}
            </section>
          ) : (
            <section className="card-catalog-empty">
              <span>NENHUM RESULTADO</span>
              <h2>Nenhuma carta pública corresponde aos filtros.</h2>
              <p>Altere a busca ou limpe os filtros. Conteúdo arquivado ou não publicado não aparece aqui.</p>
              <Link href="/cards">Limpar filtros</Link>
            </section>
          )}

          {state.data.totalPages > 1 ? (
            <nav className="catalog-pagination" aria-label="Paginação">
              <Link aria-disabled={state.data.page <= 1} href={catalogHref(query, { page: Math.max(1, state.data.page - 1) })}>← Anterior</Link>
              <span>Página {state.data.page} de {state.data.totalPages}</span>
              <Link aria-disabled={state.data.page >= state.data.totalPages} href={catalogHref(query, { page: Math.min(state.data.totalPages, state.data.page + 1) })}>Próxima →</Link>
            </nav>
          ) : null}
        </>
      )}
    </main>
  );
}
