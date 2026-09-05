import Link from "next/link";
import { defaultRegionsHome } from "@/lib/cms/defaults";
import { getPublishedContent } from "@/lib/cms/public-content";
import type { RegionShowcaseContent } from "@/lib/cms/content-model";
import { getPublicCardCatalog } from "@/lib/cards/public-catalog";

function regionKey(value: string) {
  return value.trim().toLocaleLowerCase("en-US");
}

export default async function RegionsPage() {
  const [regions, catalog] = await Promise.all([
    getPublishedContent<RegionShowcaseContent>("regions", "home", defaultRegionsHome),
    getPublicCardCatalog({ page: 1, pageSize: 1 }),
  ]);

  const counts = new Map(
    catalog.available
      ? catalog.data.facets.regions.map((facet) => [regionKey(facet.value), facet.count])
      : [],
  );

  return (
    <main className="regions-live-shell">
      <header className="catalog-topbar">
        <Link className="content-brand" href="/">
          <span className="content-brand-mark">RF</span>
          <span><strong>RuneForge</strong><small>Doutrinas regionais</small></span>
        </Link>
        <nav aria-label="Regiões">
          <Link href="/cards">Cartas</Link>
          <Link href="/collections">Coleções</Link>
          <Link href="/rules">Regras</Link>
        </nav>
        <Link className="content-home-link" href="/">Voltar à Forja</Link>
      </header>

      <section className="regions-live-hero">
        <div>
          <span className="content-kicker">{regions.kicker}</span>
          <h1>{regions.title.split("\n").map((line) => <span key={line}>{line}<br/></span>)}</h1>
          <p>{regions.description}</p>
        </div>
        <div className="regions-live-orbit" aria-hidden="true"><span>ᚱ</span></div>
      </section>

      <section className="regions-live-grid" aria-label="Regiões de RuneForge">
        {regions.items.map((region, index) => {
          const count = counts.get(regionKey(region.name));
          return (
            <Link className="region-live-card" href={`/regions/${encodeURIComponent(regionKey(region.name))}`} key={region.name}>
              <div className="region-live-index">0{index + 1}</div>
              <div className="region-live-icon">{region.icon ? <img src={region.icon} alt="" /> : <span>◆</span>}</div>
              <div className="region-live-copy">
                <small>REGIÃO {String(index + 1).padStart(2, "0")}</small>
                <h2>{region.name}</h2>
                <p>{region.description}</p>
              </div>
              <div className="region-live-count">
                <strong>{typeof count === "number" ? count : "—"}</strong>
                <span>{typeof count === "number" ? "cartas públicas" : "catálogo offline"}</span>
              </div>
              <footer>Explorar doutrina <span>↗</span></footer>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
