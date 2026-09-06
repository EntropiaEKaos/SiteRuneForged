import Link from "next/link";
import { getPublicKeywords } from "@/lib/keywords/public-keywords";

const domainLabel: Record<string, string> = {
  attack: "Ataque",
  blocking: "Bloqueio",
  strike: "Golpe",
  damage: "Dano",
  round: "Rodada",
  targeting: "Alvo",
  death: "Morte",
};

export default async function KeywordsPage() {
  const state = await getPublicKeywords();

  return (
    <main className="keywords-shell">
      <header className="catalog-topbar">
        <Link className="content-brand" href="/">
          <span className="content-brand-mark">RF</span>
          <span><strong>RuneForge</strong><small>Codex de mecânicas</small></span>
        </Link>
        <nav aria-label="Mecânicas">
          <Link href="/cards">Cartas</Link>
          <Link href="/regions">Regiões</Link>
          <Link href="/rules">Regras</Link>
        </nav>
        <Link className="content-home-link" href="/">Voltar à Forja</Link>
      </header>

      <section className="keywords-hero">
        <div>
          <span className="content-kicker">LINGUAGEM DA BATALHA</span>
          <h1>Keywords & Mecânicas</h1>
          <p>O glossário é lido diretamente dos contratos públicos do RuneForge. Keywords canônicas vêm da engine; mecânicas customizadas aparecem somente depois de publicadas pelo Content Pipeline.</p>
        </div>
        <div className="keywords-glyph" aria-hidden="true">✦</div>
      </section>

      {!state.available ? (
        <section className="card-catalog-empty">
          <span>CODEX INDISPONÍVEL</span>
          <h2>As mecânicas não responderam.</h2>
          <p>O portal não mantém uma segunda definição das keywords. Tente novamente quando a API pública do RuneForge estiver disponível.</p>
          <Link href="/keywords">Tentar novamente</Link>
        </section>
      ) : state.items.length ? (
        <>
          <section className="keywords-summary">
            <div><strong>{state.items.filter((item) => item.source === "canonical").length}</strong><span>canônicas</span></div>
            <div><strong>{state.items.filter((item) => item.source === "custom").length}</strong><span>custom publicadas</span></div>
            <div><strong>{state.items.reduce((sum, item) => sum + item.cardCount, 0)}</strong><span>usos em cartas</span></div>
          </section>
          <section className="keywords-grid" aria-label="Glossário público">
            {state.items.map((keyword, index) => (
              <Link className="keyword-card" href={`/keywords/${encodeURIComponent(keyword.key)}`} key={keyword.key}>
                <div className="keyword-card-head">
                  <span>{keyword.icon || "✦"}</span>
                  <small>{String(index + 1).padStart(2, "0")}</small>
                </div>
                <div className="keyword-source">{keyword.source === "canonical" ? "ENGINE CANÔNICA" : "CONTENT PIPELINE"}</div>
                <h2>{keyword.name}</h2>
                <p>{keyword.description || "Mecânica publicada sem descrição adicional."}</p>
                <div className="keyword-domains">
                  {keyword.runtimeDomains.length
                    ? keyword.runtimeDomains.map((domain) => <em key={domain}>{domainLabel[domain] || domain}</em>)
                    : keyword.timing ? <em>{keyword.timing}</em> : <em>Mecânica custom</em>}
                </div>
                <footer>
                  <span>{keyword.cardCount} carta{keyword.cardCount === 1 ? "" : "s"}</span>
                  <b>Ver regra ↗</b>
                </footer>
              </Link>
            ))}
          </section>
        </>
      ) : (
        <section className="card-catalog-empty">
          <span>CODEX VAZIO</span>
          <h2>Nenhuma mecânica pública foi encontrada.</h2>
          <p>O glossário aparecerá automaticamente quando os contratos públicos estiverem disponíveis.</p>
          <Link href="/">Voltar à Forja</Link>
        </section>
      )}
    </main>
  );
}
