import { portalResources } from "@/lib/cms/content-model";
import styles from "./admin.module.css";

const workflow = [
  ["01", "Rascunho", "Edite sem alterar o portal público."],
  ["02", "Revisão", "Conteúdo pronto para validação editorial e QA."],
  ["03", "Publicação", "Publisher/Admin libera a versão certificada."],
  ["04", "Histórico", "Versões permanecem auditáveis e reversíveis."],
];

export default function PortalAdminPage() {
  return (
    <main className={styles.shell}>
      <aside className={styles.sidebar}>
        <a className={styles.brand} href="/" aria-label="Voltar ao portal RuneForge">
          <span className={styles.mark}>RF</span>
          <span><strong>RuneForge</strong><small>Portal Control</small></span>
        </a>
        <nav className={styles.nav} aria-label="Administração do portal">
          <a className={styles.active} href="#overview">Visão geral</a>
          <a href="#content">Conteúdo</a>
          <a href="#publishing">Publicação</a>
          <a href="#security">Acesso & segurança</a>
        </nav>
        <div className={styles.sidebarFoot}>
          <span>CONTROL PLANE</span>
          <p>UI separada do portal público e integrada ao modelo de autenticação, MFA e roles do RuneForge.</p>
        </div>
      </aside>

      <section className={styles.workspace}>
        <header className={styles.topbar}>
          <div><span className={styles.kicker}>ADMINISTRAÇÃO DO PORTAL</span><h1>Controle total. Publicação segura.</h1></div>
          <div className={styles.operator}><span className={styles.statusDot}/><div><strong>CMS 2.1 integrado</strong><small>Autoridade versionada no RuneForgedTCG · PR #137</small></div><a className={styles.operatorLink} href="/admin/login">Entrar</a></div>
        </header>

        <section id="overview" className={styles.overview}>
          <article><span>RECURSOS</span><strong>{portalResources.length}</strong><p>domínios com editor operacional</p></article>
          <article><span>WORKFLOW</span><strong>4</strong><p>estágios até a publicação auditável</p></article>
          <article><span>SEGURANÇA</span><strong>5</strong><p>roles compartilhados com RuneForge</p></article>
          <article><span>BACKEND</span><strong>2.1</strong><p>CMS versionado + continuidade pública</p></article>
        </section>

        <section id="content" className={styles.section}>
          <div className={styles.sectionHead}><div><span className={styles.kicker}>CONTEÚDO</span><h2>Tudo que aparece no portal terá dono.</h2></div><p>Os 16 domínios já possuem editor versionado. O backend decide quem pode editar e publicar; o browser nunca recebe credenciais privilegiadas.</p></div>
          <div className={styles.resourceGrid}>
            {portalResources.map((resource, index) => (
              <article className={styles.resourceCard} key={resource.key}>
                <div className={styles.resourceTop}><span>{String(index + 1).padStart(2, "0")}</span><em>EDITOR ATIVO</em></div>
                <h3>{resource.label}</h3>
                <p>{resource.description}</p>
                <div className={styles.roleRow}><small>Editar</small><span>{resource.ownerRoles.join(" · ")}</span></div>
                <div className={styles.roleRow}><small>Publicar</small><span>{resource.publishRoles.join(" · ")}</span></div>
                <a className={styles.editorLink} href={`/admin/${resource.key}`}>Abrir editor <span>→</span></a>
              </article>
            ))}
          </div>
        </section>

        <section id="publishing" className={styles.section}>
          <div className={styles.sectionHead}><div><span className={styles.kicker}>PIPELINE EDITORIAL</span><h2>Editar não significa publicar.</h2></div><p>Produção fica protegida por papéis, validação e histórico. Cada mudança gera uma nova versão e uma entrada de auditoria no control plane.</p></div>
          <div className={styles.workflow}>
            {workflow.map(([number, title, text]) => <article key={title}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </section>

        <section id="security" className={styles.security}>
          <div><span className={styles.kicker}>SEGURANÇA</span><h2>Um único sistema de operadores.</h2><p>Não haverá uma segunda base de usuários administrativos. O Portal Control trabalha com os papéis <b>admin</b>, <b>designer</b>, <b>qa</b>, <b>liveops</b> e <b>publisher</b> já usados pelo RuneForge, preservando MFA, sessão HttpOnly e auditoria no control plane.</p></div>
          <div className={styles.securityStack}><span>ADMIN</span><span>DESIGNER</span><span>QA</span><span>LIVEOPS</span><span>PUBLISHER</span></div>
        </section>

        <footer className={styles.footer}><span>RuneForge Portal Control · CMS 2.1</span><a href="/">Ver portal público ↗</a></footer>
      </section>
    </main>
  );
}
