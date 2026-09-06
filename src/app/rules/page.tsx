import Link from "next/link";
import { getPublishedList } from "@/lib/cms/public-content";
import { publicSections, type EditorialPayload } from "@/lib/cms/public-sections";
import { getPublicRulesContracts, type PublicCardRuleContract } from "@/lib/rules/public-rules";

function formatPublishedAt(value?: string | null) {
  if (!value) return "Conteúdo base";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Publicado";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(date);
}

function timingLabel(value: PublicCardRuleContract["timing"]) {
  if (value === "main-only") return "Somente fase principal";
  if (value === "reaction-only") return "Somente reação";
  if (value === "speed-based") return "Velocidade da carta";
  return "Campo de batalha";
}

function manaLabel(value: PublicCardRuleContract["mana"]) {
  return value === "spell" ? "Spell mana" : "Mana regular";
}

function contractCard(contract: PublicCardRuleContract, emphasis = false) {
  return (
    <article className={emphasis ? "rule-contract-card rule-contract-card-featured" : "rule-contract-card"} key={`${contract.kind}:${contract.key}`}>
      <div className="rule-contract-head">
        <span>{contract.icon}</span>
        <em>{contract.kind === "semantic" ? "ESPECIALIZAÇÃO CERTIFICADA" : "CONTRATO ESTRUTURAL"}</em>
      </div>
      <h3>{contract.name}</h3>
      <p>{contract.description}</p>
      <dl>
        <div><dt>Timing</dt><dd>{timingLabel(contract.timing)}</dd></div>
        <div><dt>Recurso</dt><dd>{manaLabel(contract.mana)}</dd></div>
        <div><dt>Zona</dt><dd>{contract.zone}</dd></div>
        <div><dt>Spell cast</dt><dd>{contract.countsAsSpellCast ? "Conta" : "Não conta"}</dd></div>
      </dl>
      <footer>
        <span>{contract.cardCount} carta{contract.cardCount === 1 ? "" : "s"} públicas</span>
        <Link href={`/cards?type=${encodeURIComponent(contract.kind === "semantic" ? contract.name : contract.key)}`}>Explorar cartas ↗</Link>
      </footer>
    </article>
  );
}

export default async function RulesPage() {
  const config = publicSections.rules;
  const [contracts, articles] = await Promise.all([
    getPublicRulesContracts(),
    getPublishedList<EditorialPayload>(config.resource, config.fallback),
  ]);

  return (
    <main className="rules-intelligence-shell">
      <header className="catalog-topbar">
        <Link className="content-brand" href="/">
          <span className="content-brand-mark">RF</span>
          <span><strong>RuneForge</strong><small>Códice de batalha</small></span>
        </Link>
        <nav aria-label="Regras">
          <Link href="/cards">Cartas</Link>
          <Link href="/keywords">Mecânicas</Link>
          <Link href="/regions">Regiões</Link>
          <Link href="/collections">Coleções</Link>
        </nav>
        <Link className="content-home-link" href="/">Voltar à Forja</Link>
      </header>

      <section className="rules-intelligence-hero">
        <div>
          <span className="content-kicker">{config.kicker}</span>
          <h1>{config.title}</h1>
          <p>{config.description}</p>
          <div className="rules-authority-note">
            <strong>DUAS CAMADAS, UMA REGRA</strong>
            <span>Timing, mana e estrutura vêm da engine. Tutoriais e explicações são publicados pelo Portal CMS.</span>
          </div>
        </div>
        <div className="rules-intelligence-rune" aria-hidden="true">ᚱ</div>
      </section>

      {!contracts.available ? (
        <section className="rules-contract-unavailable">
          <div><span>CONTRATOS DA ENGINE INDISPONÍVEIS</span><h2>As regras editoriais continuam acessíveis.</h2><p>O portal não substitui timing, mana ou tipos por uma cópia local quando a API da engine está indisponível.</p></div>
          <Link href="/rules">Tentar novamente</Link>
        </section>
      ) : (
        <>
          <section className="rules-contract-section rules-semantic-section">
            <header>
              <div><span className="content-kicker">REGRAS DE GAMEPLAY CERTIFICADAS</span><h2>Especializações semânticas</h2></div>
              <p>Estrutura, Ritual e Armadilha mantêm base estrutural estável, mas possuem contratos próprios de timing e recurso.</p>
            </header>
            <div className="rules-semantic-grid">
              {contracts.data.semantic.map((contract) => contractCard(contract, true))}
            </div>
          </section>

          <section className="rules-contract-section">
            <header>
              <div><span className="content-kicker">FUNDAÇÃO DA ENGINE</span><h2>Seis contratos estruturais</h2></div>
              <p>Esses contratos são a base de armazenamento e execução. Especializações podem refinar o comportamento sem alterar essa fundação.</p>
            </header>
            <div className="rules-structural-grid">
              {contracts.data.structural.map((contract) => contractCard(contract))}
            </div>
          </section>
        </>
      )}

      <section className="rules-editorial-section">
        <header>
          <div><span className="content-kicker">GUIAS & APRENDIZADO</span><h2>Como jogar</h2></div>
          <p>Conteúdo editorial versionado pelo Portal CMS: fundamentos, prioridade, stack e guias que podem evoluir sem alterar os contratos da engine.</p>
        </header>
        <div className="content-grid rules-editorial-grid">
          {articles.map((item, index) => (
            <article className="content-card" key={item.slug}>
              <div className="content-card-top">
                <span>{item.payload.kicker || config.kicker}</span>
                <em>{item.payload.badge || String(index + 1).padStart(2, "0")}</em>
              </div>
              <h2>{item.payload.title || item.slug}</h2>
              <p>{item.payload.summary}</p>
              <div className="content-card-meta"><span>{formatPublishedAt(item.publishedAt)}</span><span>v{item.version}</span></div>
              <Link href={`/rules/${item.slug}`}>Abrir guia <span>↗</span></Link>
            </article>
          ))}
        </div>
      </section>

      <footer className="content-footer">
        <span>RuneForge · contratos da engine + conteúdo Portal CMS</span>
        <Link href="/keywords">Explorar mecânicas ↗</Link>
      </footer>
    </main>
  );
}
