import Link from "next/link";
import { getPublicCardCatalog, getStandaloneCardSnapshotInfo, type CardCatalogQuery, type CardFacet } from "@/lib/cards/public-catalog";
import { portalMetadata } from "@/lib/portal/seo";

export const metadata = portalMetadata({
  title: "Card Explorer",
  description: "Explore o catálogo público de RuneForge por região, tipo, raridade, keyword, raça, classe e custo de mana.",
  path: "/cards",
});

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
    keyword: scalar(searchParams.keyword),
    race: scalar(searchParams.race),
    class: scalar(searchParams.class),
    minCost: scalar(searchParams.minCost),
    maxCost: scalar(searchParams.maxCost),
    sort: scalar(searchParams.sort) || "name-asc",
    page: scalar(searchParams.page) || "1",
    pageSize: "24",
  };
}

function catalogHref(query: CardCatalogQuery, patch: CardCatalogQuery = {}, view?: string) {
  const params = new URLSearchParams();
  const merged = { ...query, ...patch };
  for (const [key, raw] of Object.entries(merged)) {
    const value = String(raw ?? "").trim();
    if (value && !(key === "page" && value === "1") && key !== "pageSize" && !(key === "sort" && value === "name-asc")) params.set(key, value);
  }
  if (view === "list") params.set("view", "list");
  const search = params.toString();
  return `/cards${search ? `?${search}` : ""}`;
}

function options(facets: CardFacet[] | undefined) {
  return (facets ?? []).map((facet) => (
    <option value={facet.value} key={facet.value}>{facet.label || facet.value} ({facet.count})</option>
  ));
}

function activeFilterLinks(query: CardCatalogQuery, view: string) {
  const labels: Array<[keyof CardCatalogQuery, string]> = [
    ["region", "Região"], ["type", "Tipo"], ["rarity", "Raridade"], ["collection", "Coleção"],
    ["keyword", "Keyword"], ["race", "Raça"], ["class", "Classe"], ["minCost", "Mana ≥"], ["maxCost", "Mana ≤"],
  ];
  return labels.flatMap(([key, label]) => {
    const value = String(query[key] ?? "").trim();
    return value ? [<Link className="catalog-filter-chip" href={catalogHref(query, { [key]: "", page: 1 }, view)} key={String(key)}>{label}: <b>{value}</b><span>×</span></Link>] : [];
  });
}

export default async function CardsPage({ searchParams }: { searchParams?: Promise<Search> }) {
  const params = (await searchParams) ?? {};
  const query = queryFrom(params);
  const view = scalar(params.view) === "list" ? "list" : "grid";
  const state = await getPublicCardCatalog(query);
  const snapshot = getStandaloneCardSnapshotInfo();
  const activeFilters = activeFilterLinks(query, view);

  return (
    <main className="catalog-shell">
      <header className="catalog-topbar">
        <Link className="content-brand" href="/"><span className="content-brand-mark">RF</span><span><strong>RuneForge</strong><small>Card Explorer 2.0</small></span></Link>
        <nav aria-label="Catálogo"><Link href="/collections">Coleções</Link><Link href="/regions">Regiões</Link><Link href="/keywords">Mecânicas</Link><Link href="/rules">Regras</Link><Link href="/lore">Lore</Link></nav>
        <Link className="content-home-link" href="/">Voltar à Forja</Link>
      </header>

      <section className="catalog-hero">
        <div><span className="content-kicker">ARQUIVO DA FORJA · EXPLORER 2.0</span><h1>Encontre a carta certa.</h1><p>{state.available && state.source === "api" ? "Catálogo público diretamente do runtime certificado." : "Catálogo Vanilla preservado pelo snapshot certificado enquanto a API pública não responde."} Combine filtros, compartilhe a URL e atravesse o acervo por identidade mecânica.</p></div>
        <div className="catalog-sigil" aria-hidden="true">◆</div>
      </section>

      {!state.available ? (
        <section className="card-catalog-empty"><span>CATÁLOGO INDISPONÍVEL</span><h2>Não foi possível abrir nem a API nem o snapshot local.</h2><p>O deploy está incompleto. O snapshot certificado deve acompanhar o portal.</p><Link href="/cards">Tentar novamente</Link></section>
      ) : (
        <>
          <section className="catalog-explorer-head">
            <div><span className="content-kicker">BUSCA AVANÇADA</span><h2>{state.data.total} cartas encontradas</h2></div>
            <div className="catalog-view-switch" aria-label="Modo de visualização"><Link className={view === "grid" ? "active" : ""} href={catalogHref(query, {}, "grid")}>Grade</Link><Link className={view === "list" ? "active" : ""} href={catalogHref(query, {}, "list")}>Lista</Link></div>
          </section>

          <form className="catalog-filters catalog-filters-advanced" action="/cards" method="get">
            {view === "list" ? <input type="hidden" name="view" value="list" /> : null}
            <label className="catalog-search"><span>Buscar</span><input name="q" defaultValue={String(query.q || "")} placeholder="Nome, texto, keyword, raça…" /></label>
            <label><span>Região</span><select name="region" defaultValue={String(query.region || "")}><option value="">Todas</option>{options(state.data.facets.regions)}</select></label>
            <label><span>Tipo</span><select name="type" defaultValue={String(query.type || "")}><option value="">Todos</option>{options(state.data.facets.types)}</select></label>
            <label><span>Raridade</span><select name="rarity" defaultValue={String(query.rarity || "")}><option value="">Todas</option>{options(state.data.facets.rarities)}</select></label>
            <label><span>Coleção</span><select name="collection" defaultValue={String(query.collection || "")}><option value="">Todas</option>{options(state.data.facets.collections)}</select></label>
            <label><span>Keyword</span><select name="keyword" defaultValue={String(query.keyword || "")}><option value="">Todas</option>{options(state.data.facets.keywords)}</select></label>
            <label><span>Raça</span><select name="race" defaultValue={String(query.race || "")}><option value="">Todas</option>{options(state.data.facets.races)}</select></label>
            <label><span>Classe</span><select name="class" defaultValue={String(query.class || "")}><option value="">Todas</option>{options(state.data.facets.classes)}</select></label>
            <label><span>Mana mínima</span><input inputMode="numeric" min="0" max="99" type="number" name="minCost" defaultValue={String(query.minCost || "")} placeholder="0" /></label>
            <label><span>Mana máxima</span><input inputMode="numeric" min="0" max="99" type="number" name="maxCost" defaultValue={String(query.maxCost || "")} placeholder="∞" /></label>
            <label><span>Ordenar</span><select name="sort" defaultValue={String(query.sort || "name-asc")}><option value="name-asc">Nome A–Z</option><option value="name-desc">Nome Z–A</option><option value="cost-asc">Menor custo</option><option value="cost-desc">Maior custo</option><option value="power-desc">Maior poder</option></select></label>
            <button type="submit" data-analytics="card-explorer-filter">Aplicar filtros</button><Link href="/cards">Limpar tudo</Link>
          </form>

          {activeFilters.length ? <div className="catalog-active-filters"><span>Filtros ativos</span>{activeFilters}</div> : null}

          <section className="catalog-summary catalog-summary-explorer">
            <div><strong>{state.data.total}</strong><span>resultados</span></div>
            <div><strong>{state.data.breakdown?.regions.length ?? 0}</strong><span>regiões no resultado</span></div>
            <div><strong>{state.data.breakdown?.types.length ?? 0}</strong><span>tipos no resultado</span></div>
            <div><span>Catálogo</span><code>{state.data.catalogRevision}</code></div>
            <div className="catalog-source" data-catalog-source={state.source}><span>{state.source === "api" ? "Fonte ao vivo" : "Modo standalone"}</span><code>{state.source === "api" ? "RuneForgedTCG API" : `${snapshot.release} · ${snapshot.commitShort}`}</code></div>
          </section>

          {state.data.items.length ? (
            <section className={`catalog-grid ${view === "list" ? "catalog-grid-list" : ""}`} aria-label="Cartas públicas" data-view={view}>
              {state.data.items.map((card) => (
                <Link className="catalog-card" href={`/cards/${encodeURIComponent(card.defId)}`} key={card.defId} data-analytics="card-open">
                  <div className="catalog-card-art">{card.art ? <img src={card.art} alt="" /> : <span>{card.emoji}</span>}<b>{card.cost}</b></div>
                  <div className="catalog-card-copy"><div className="catalog-card-meta"><span>{card.collection.code}</span><span>{card.rarity}</span></div><h2>{card.name}</h2><p>{card.type} · {card.regions.join(" / ")}</p><div className="catalog-card-traits">{card.races.slice(0, 2).map((race) => <span key={race}>{race}</span>)}{card.classes.slice(0, 2).map((cardClass) => <span key={cardClass}>{cardClass}</span>)}</div><div className="catalog-card-stats"><span>{card.keywords.slice(0, 2).join(" · ") || card.structuralType}</span>{typeof card.power === "number" && typeof card.health === "number" ? <strong>{card.power}/{card.health}</strong> : null}</div></div>
                </Link>
              ))}
            </section>
          ) : (
            <section className="card-catalog-empty"><span>NENHUM RESULTADO</span><h2>Nenhuma carta pública corresponde aos filtros.</h2><p>Altere a busca, expanda a faixa de mana ou limpe os filtros.</p><Link href="/cards">Limpar filtros</Link></section>
          )}

          {state.data.totalPages > 1 ? (
            <nav className="catalog-pagination" aria-label="Paginação"><Link aria-disabled={state.data.page <= 1} href={catalogHref(query, { page: Math.max(1, state.data.page - 1) }, view)}>← Anterior</Link><span>Página {state.data.page} de {state.data.totalPages}</span><Link aria-disabled={state.data.page >= state.data.totalPages} href={catalogHref(query, { page: Math.min(state.data.totalPages, state.data.page + 1) }, view)}>Próxima →</Link></nav>
          ) : null}
        </>
      )}
    </main>
  );
}
