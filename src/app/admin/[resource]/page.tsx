import { notFound } from "next/navigation";
import { portalResources, type PortalResourceKey } from "@/lib/cms/content-model";
import ResourceEditor from "./ResourceEditor";
import styles from "../editor.module.css";

export default function PortalResourcePage({ params }: { params: { resource: string } }) {
  const definition = portalResources.find((entry) => entry.key === params.resource as PortalResourceKey);
  if (!definition) notFound();

  return (
    <main className={styles.editorShell}>
      <header className={styles.editorTop}>
        <a href="/admin">← Portal Control</a>
        <nav><a href="/admin/login">Trocar operador</a><a href="/">Portal público ↗</a></nav>
      </header>
      <section className={styles.editorHeader}>
        <div><span className={styles.kicker}>EDITOR · {definition.label.toUpperCase()}</span><h1>{definition.label}</h1></div>
        <p>{definition.description} Edição e publicação usam o backend versionado do RuneForge, com RBAC e auditoria.</p>
      </section>
      <section className={styles.editorGrid}><ResourceEditor definition={definition} /></section>
    </main>
  );
}
