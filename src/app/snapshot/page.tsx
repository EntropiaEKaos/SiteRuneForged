import Link from "next/link";
import { standaloneKnowledgeSource, standaloneKeywords, standaloneRules, standaloneCollections } from "@/data/knowledge-snapshot";
import { getStandaloneLoreSnapshotInfo } from "@/lib/lore/standalone-lore";

function metric(label: string, value: string | number, href: string, copy: string) {
  return (
    <Link className="content-card" href={href}>
      <div className="content-card-top"><span>SNAPSHOT CERTIFICADO</span><em>↗</em></div>
      <h2>{value}</h2>
      <p><strong>{label}</strong> · {copy}</p>
      <footer>Explorar conteúdo <span>↗</span></footer>
    </Link>
  );
}

export default function SnapshotPage() {
  const keywords = standaloneKeywords();
  const rules = standaloneRules();
  const collections = standaloneCollections();
  const lore = getStandaloneLoreSnapshotInfo();
  const source = standaloneKnowledgeSource.game;

  return (
    <main className="content-shell">
      <header className="content-nav">
        <Link className="content-brand" href="/">
          <span className="content-brand-mark">RF</span>
          <span><strong>RuneForge</strong><small>Snapshot público</small></span>
        </Link>
        <nav aria-label="Snapshot RuneForge">
          <Link href="/cards">Cartas</Link>
          <Link href="/keywords">Keywords</Link>
          <Link href="/rules">Regras</Link>
          <Link href="/collections">Coleções</Link>
          <Link href="/lore">Lore</Link>
        </nav>
        <Link className="content-home-link" href="/">Voltar à Forja</Link>
      </header>

      <section className="content-hero">
        <div className="content-hero-rune" aria-hidden="true">ᚠ</div>
        <div>
          <span className="content-kicker">ARQUIVO STANDALONE · VERCEL</span>
          <h1>Snapshot de Conhecimento RuneForge</h1>
          <p>Uma cópia pública, versionada e rastreável do conteúdo necessário para o portal continuar navegável mesmo quando o runtime do game estiver offline. Quando a API responde, ela continua tendo prioridade.</p>
        </div>
        <div className="content-count"><strong>1.0</strong><span>schema</span></div>
      </section>

      <section className="content-grid" aria-label="Conteúdo preservado no snapshot">
        {metric("Cartas", standaloneKnowledgeSource.cards, "/cards", "catálogo Vanilla completo com filtros e arte local")}
        {metric("Keywords", keywords.length, "/keywords", "vocabulário canônico da engine com uso recalculado pelas cartas")}
        {metric("Contratos de regra", rules.all.length, "/rules", "6 contratos estruturais + 3 especializações semânticas")}
        {metric("Coleções", collections.length, "/collections", "sets derivados do catálogo certificado")}
        {metric("Registros de lore", lore.entries, "/lore", `${lore.book} · ${lore.title} · ${lore.version}`)}
      </section>

      <section className="article" style={{ marginTop: "2rem" }}>
        <header>
          <span className="content-kicker">PROVENIÊNCIA DO GAME</span>
          <h2>Fonte certificada</h2>
          <p>O snapshot técnico deriva do mesmo commit de RuneForgedTCG já usado pelos gates do portal.</p>
        </header>
        <div className="article-body">
          <p><strong>Game SHA:</strong> <code>{source.commitSha}</code></p>
          <p><strong>Release:</strong> {source.release} · <strong>Engine:</strong> {source.engineVersion} · <strong>Ruleset:</strong> {source.rulesetVersion}</p>
          <p><strong>Content version:</strong> {source.contentVersion} · <strong>Catalog revision:</strong> {source.catalogRevision}</p>
          <p><strong>Lore:</strong> {lore.series} · {lore.book} · {lore.title} · {lore.version} · snapshot {lore.snapshotDate}</p>
        </div>
      </section>

      <footer className="content-footer">
        <span>API ao vivo primeiro · snapshot certificado como fallback</span>
        <Link href="/lore">Ler Quando as Runas Sangraram ↗</Link>
      </footer>
    </main>
  );
}
