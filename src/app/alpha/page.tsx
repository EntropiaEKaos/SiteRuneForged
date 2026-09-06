import Link from "next/link";
import type { Metadata } from "next";
import { defaultAlphaLaunch } from "@/lib/cms/defaults";
import { getPublishedContent } from "@/lib/cms/public-content";
import type { AlphaLaunchContent } from "@/lib/cms/content-model";
import { getPublicAlphaReadiness } from "@/lib/alpha/public-alpha";
import {
  getPublicDeploymentProvenance,
  type DeploymentVerification,
} from "@/lib/alpha/public-deployment";
import { getRuneForgeGameHref } from "@/lib/runeforge-api/public-origin";
import "./alpha-launch.css";

export const metadata: Metadata = {
  title: "Alpha Jogável — RuneForge",
  description: "Consulte o status do Alpha de RuneForge, veja a jornada certificada e entre no jogo.",
};

function stateCopy(state: "ready" | "limited" | "maintenance") {
  if (state === "ready") return { label: "ALPHA ONLINE", detail: "Runtime pronto para a jornada certificada." };
  if (state === "limited") return { label: "ALPHA LIMITADO", detail: "O runtime está disponível, mas a jornada PvE está temporariamente limitada." };
  return { label: "MANUTENÇÃO", detail: "O jogo está temporariamente fechado para manutenção." };
}

function buildVerificationCopy(
  verification: DeploymentVerification,
  versionsAligned: boolean | null,
) {
  if (versionsAligned === false) {
    return {
      label: "VERSÕES DIVERGENTES",
      detail: "Readiness e provenance não concordam sobre o build ativo.",
      tone: "mismatch",
    };
  }

  if (verification === "verified") {
    return {
      label: "BUILD CERTIFICADO",
      detail: "O SHA ao vivo corresponde exatamente ao deploy esperado pelo portal.",
      tone: "verified",
    };
  }
  if (verification === "mismatch") {
    return {
      label: "SHA DIVERGENTE",
      detail: "O backend ativo não corresponde ao build certificado esperado.",
      tone: "mismatch",
    };
  }
  if (verification === "invalid-config") {
    return {
      label: "PIN INVÁLIDO",
      detail: "O SHA esperado configurado no portal não é um commit Git completo.",
      tone: "mismatch",
    };
  }
  if (verification === "unconfigured") {
    return {
      label: "BUILD IDENTIFICADO",
      detail: "O SHA ao vivo está visível, mas este deploy do portal não fixou um SHA esperado.",
      tone: "identified",
    };
  }
  return {
    label: "PROVENANCE INDISPONÍVEL",
    detail: "Não foi possível confirmar a identidade imutável do build agora.",
    tone: "unavailable",
  };
}

function boundaryItems(rankedOperational: boolean) {
  return [
    {
      title: "Ranked público",
      state: rankedOperational ? "Operacional fora do requisito" : "Fora do requisito",
      description: "O Alpha não depende da abertura pública do competitivo.",
    },
    {
      title: "Dinheiro real",
      state: "Fora do requisito",
      description: "Pagamentos com dinheiro real não fazem parte do requisito de lançamento do Alpha.",
    },
    {
      title: "Live Ops em escala",
      state: "Fora do requisito",
      description: "Operações massivas e conteúdo infinito ficam para a fase posterior a jogadores reais.",
    },
  ];
}

export default async function AlphaPage() {
  const [copy, readiness, provenance] = await Promise.all([
    getPublishedContent<AlphaLaunchContent>("alpha", "main", defaultAlphaLaunch),
    getPublicAlphaReadiness(),
    getPublicDeploymentProvenance(),
  ]);

  const runtime = readiness.available ? readiness.data : null;
  const deployment = provenance.available ? provenance.data : null;
  const status = runtime ? stateCopy(runtime.state) : null;

  const versionsAligned = runtime && deployment
    ? runtime.release.release === deployment.release
      && runtime.release.engineVersion === deployment.engineVersion
      && runtime.release.rulesetVersion === deployment.rulesetVersion
      && runtime.release.contentVersion === deployment.contentVersion
    : null;

  const pinBlocksLaunch = provenance.verification === "mismatch"
    || provenance.verification === "invalid-config"
    || (provenance.pinConfigured && !provenance.available);
  const provenanceBlocksLaunch = pinBlocksLaunch || versionsAligned === false;
  const playable = Boolean(runtime && runtime.state !== "maintenance" && !provenanceBlocksLaunch);
  const primaryHref = playable && runtime ? getRuneForgeGameHref(runtime.entryRoute) : null;
  const boundaries = boundaryItems(Boolean(runtime?.boundaries.rankedOperational));
  const buildStatus = buildVerificationCopy(provenance.verification, versionsAligned);
  const releaseVersion = runtime?.release.release || deployment?.release || "—";
  const engineVersion = runtime?.release.engineVersion || deployment?.engineVersion || "—";
  const rulesetVersion = runtime?.release.rulesetVersion || deployment?.rulesetVersion || "—";
  const contentVersion = runtime?.release.contentVersion || deployment?.contentVersion || "—";

  return (
    <main className="alpha-launch-shell">
      <header className="catalog-topbar alpha-launch-topbar">
        <Link className="content-brand" href="/">
          <span className="content-brand-mark">RF</span>
          <span><strong>RuneForge</strong><small>Alpha Launch Hub</small></span>
        </Link>
        <nav aria-label="Alpha">
          <Link href="/cards">Cartas</Link>
          <Link href="/keywords">Mecânicas</Link>
          <Link href="/rules">Regras</Link>
          <Link href="/roadmap">Roadmap</Link>
        </nav>
        <Link className="content-home-link" href="/">Voltar ao portal</Link>
      </header>

      <section className="alpha-launch-hero">
        <div className="alpha-launch-grid" aria-hidden="true" />
        <div className="alpha-launch-copy">
          <span className="content-kicker">{copy.eyebrow}</span>
          <h1>{copy.title}</h1>
          <p>{copy.description}</p>

          {runtime && status ? (
            <div className={`alpha-runtime-status alpha-runtime-${runtime.state}`}>
              <span className="alpha-status-light" />
              <div><strong>{status.label}</strong><small>{status.detail}</small></div>
              <em>release {runtime.release.release}</em>
            </div>
          ) : (
            <div className="alpha-runtime-status alpha-runtime-unavailable">
              <span className="alpha-status-light" />
              <div><strong>STATUS INDISPONÍVEL</strong><small>Não foi possível confirmar o runtime agora.</small></div>
              <em>fail-visible</em>
            </div>
          )}

          <div className="alpha-launch-actions">
            {primaryHref ? (
              <a className="primary alpha-play-cta" href={primaryHref}>{copy.playLabel} <span>→</span></a>
            ) : (
              <span className="primary alpha-play-cta alpha-play-disabled" aria-disabled="true">{copy.playLabel} <span>×</span></span>
            )}
            <Link className="secondary" href="/rules">{copy.rulesLabel}</Link>
          </div>

          {!primaryHref && runtime?.state !== "maintenance" ? (
            <p className={`alpha-config-note ${provenanceBlocksLaunch ? "alpha-provenance-block-note" : ""}`}>
              {provenanceBlocksLaunch
                ? "Acesso bloqueado pelo portal até a identidade do build voltar a corresponder ao contrato certificado."
                : "Acesso ao jogo ainda não está configurado neste deploy do portal."}
            </p>
          ) : null}
        </div>

        <div
          className="alpha-release-panel"
          data-deploy-sha={deployment?.commitSha || ""}
          data-deploy-verification={provenance.verification}
        >
          <span className="alpha-release-rune" aria-hidden="true">ᚱ</span>
          <small>BUILD PÚBLICO</small>
          <strong>{releaseVersion}</strong>

          <div className={`alpha-build-verification alpha-build-${buildStatus.tone}`}>
            <span className="alpha-build-light" />
            <div>
              <b>{buildStatus.label}</b>
              <small>{buildStatus.detail}</small>
            </div>
          </div>

          <dl>
            <div><dt>Engine</dt><dd>{engineVersion}</dd></div>
            <div><dt>Ruleset</dt><dd>{rulesetVersion}</dd></div>
            <div><dt>Content</dt><dd>{contentVersion}</dd></div>
            <div><dt>Commit</dt><dd>{deployment?.commitSha || "—"}</dd></div>
            <div><dt>Ambiente</dt><dd>{deployment?.environment || "—"}</dd></div>
            {provenance.verification === "mismatch" && provenance.expectedSha ? (
              <div><dt>Esperado</dt><dd>{provenance.expectedSha}</dd></div>
            ) : null}
          </dl>
        </div>
      </section>

      <section className="alpha-journey-section">
        <header>
          <span className="content-kicker">ESCOPO CERTIFICADO</span>
          <h2>{copy.journeyTitle}</h2>
          <p>{copy.journeyDescription}</p>
        </header>

        {runtime ? (
          <div className="alpha-capability-grid">
            {runtime.capabilities.map((capability, index) => {
              const href = capability.status === "available" && !provenanceBlocksLaunch
                ? getRuneForgeGameHref(capability.route)
                : null;
              return (
                <article className={`alpha-capability-card alpha-capability-${capability.status}`} key={capability.key}>
                  <div className="alpha-capability-number">{String(index + 1).padStart(2, "0")}</div>
                  <span className="alpha-capability-state">
                    <i /> {capability.status === "available" ? "DISPONÍVEL" : "TEMPORARIAMENTE INDISPONÍVEL"}
                  </span>
                  <h3>{capability.label}</h3>
                  {href ? <a href={href}>Abrir no jogo <span>↗</span></a> : <span className="alpha-capability-disabled">Aguardar runtime</span>}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="alpha-readiness-unavailable">
            <strong>Não foi possível carregar a jornada operacional.</strong>
            <p>O portal não mantém uma lista paralela de disponibilidade. Recarregue quando o backend público responder.</p>
          </div>
        )}
      </section>

      <section className="alpha-notes-section">
        <div>
          <span className="content-kicker">ALPHA EXTERNO</span>
          <h2>{copy.notesTitle}</h2>
        </div>
        <ol>
          {copy.notes.map((note, index) => (
            <li key={note}><span>{String(index + 1).padStart(2, "0")}</span><p>{note}</p></li>
          ))}
        </ol>
      </section>

      <section className="alpha-boundary-section">
        <header>
          <span className="content-kicker">DISCIPLINA DE LANÇAMENTO</span>
          <h2>{copy.boundariesTitle}</h2>
          <p>{copy.boundariesDescription}</p>
        </header>
        <div className="alpha-boundary-grid">
          {boundaries.map((item) => (
            <article key={item.title}>
              <span>{item.state}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="alpha-final-cta">
        <div>
          <span className="content-kicker">PRONTO PARA A PRIMEIRA PARTIDA?</span>
          <h2>Forje a primeira decisão.</h2>
          <p>Aprenda as regras, escolha uma doutrina e entre no Nexus quando o runtime estiver disponível.</p>
        </div>
        <div>
          {primaryHref ? <a className="primary" href={primaryHref}>{copy.playLabel}</a> : null}
          <Link className="secondary" href="/cards">Explorar cartas</Link>
        </div>
      </section>
    </main>
  );
}
