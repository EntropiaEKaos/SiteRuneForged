import AdminResourceDirectory from "./AdminResourceDirectory";
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
        <a className={styles.brand} href="/" aria-label="Voltar ao portal RuneForge"><span className={styles.mark}>RF</span><span><strong>RuneForge</strong><small>Portal Control 2.0</small></span></a>
        <nav className={styles.nav} aria-label="Administração do portal"><a className={styles.active} href="#overview">Visão geral</a><a href="#content">Conteúdo</a><a href="#publishing">Publicação</a><a href="#security">Acesso & segurança</a></nav>
        <div className={styles.sidebarFoot}><span>CONTROL PLANE</span><p>UI separada do portal público, integrada a autenticação, MFA, roles, versionamento e auditoria do RuneForge.</p></div>
      </aside>

      <section className={styles.workspace}>
        <header className={styles.topbar}>
          <div><span className={styles.kicker}>PORTAL ADMIN UX 2.0</span><h1>Controle total.<br/>Publique o universo.</h1><p>Conteúdo, navegação, lore, campanhas e descoberta reunidos em uma central editorial com versionamento seguro.</p></div>
          <div className={styles.operator}><span className={styles.statusDot}/><div><strong>CMS 2.1 integrado</strong><small>16 domínios · versionamento · rollback · roles</small></div><a className={styles.operatorLink} href="/admin/login">Entrar</a></div>
        </header>

        <section id="overview" className={styles.overview}>
          <article><span>RECURSOS</span><strong>{portalResources.length}</strong><p>domínios administráveis</p></article>
          <article><span>WORKFLOW</span><strong>4</strong><p>estágios auditáveis</p></article>
          <article><span>ROLES</span><strong>5</strong><p>papéis compartilhados</p></article>
          <article><span>BACKEND</span><strong>2.1</strong><p>CMS + continuidade pública</p></article>
        </section>

        <section id="content" className={styles.section}><AdminResourceDirectory resources={portalResources} /></section>

        <section id="publishing" className={styles.section}>
          <div className={styles.sectionHead}><div><span className={styles.kicker}>PIPELINE EDITORIAL</span><h2>Editar não significa publicar.</h2></div><p>Produção continua protegida por papéis, validação e histórico. Cada mudança gera versão e trilha auditável.</p></div>
          <div className={styles.workflow}>{workflow.map(([number, title, text]) => <article key={title}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
        </section>

        <section id="security" className={styles.security}>
          <div><span className={styles.kicker}>SEGURANÇA</span><h2>Um único sistema de operadores.</h2><p>O Portal Control usa os papéis <b>admin</b>, <b>designer</b>, <b>qa</b>, <b>liveops</b> e <b>publisher</b> do RuneForge, preservando MFA, sessão HttpOnly e auditoria. Nenhuma credencial administrativa é entregue ao browser.</p></div>
          <div className={styles.securityStack}><span>ADMIN</span><span>DESIGNER</span><span>QA</span><span>LIVEOPS</span><span>PUBLISHER</span></div>
        </section>

        <footer className={styles.footer}><span>RuneForge Portal Control · UX 2.0 · CMS 2.1</span><a href="/" target="_blank" rel="noreferrer">Ver portal público ↗</a></footer>
      </section>
    </main>
  );
}
