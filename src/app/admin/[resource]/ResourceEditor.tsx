"use client";

import { useMemo, useState } from "react";
import type { PortalResourceDefinition } from "@/lib/cms/content-model";
import styles from "../editor.module.css";

type CmsVersion = {
  id: number;
  version: number;
  status: string;
  actor: string;
  changeNote?: string;
  createdAt?: string;
};

type CmsItem = {
  id: number;
  slug: string;
  locale: string;
  status: string;
  payload: unknown;
  seo: unknown;
  version: number;
  updatedBy: string;
  updatedAt: string;
  publishedAt?: string | null;
};

const pretty = (value: unknown) => JSON.stringify(value ?? {}, null, 2);

export default function ResourceEditor({ definition }: { definition: PortalResourceDefinition }) {
  const [slug, setSlug] = useState(definition.key === "home" || definition.key === "navigation" || definition.key === "alpha" ? "main" : "main");
  const [locale, setLocale] = useState("pt-BR");
  const [payload, setPayload] = useState(definition.key === "home" ? pretty({
    eyebrow: "O CAMPO RESPONDE À SUA VONTADE",
    title: "Forje sua lenda.",
    accentTitle: "Quebre o destino.",
    description: "RuneForge é um card game tático onde timing, construção de deck e leitura do adversário importam tanto quanto poder bruto.",
    primaryCta: { label: "Descobrir RuneForge", href: "#cards" },
    secondaryCta: { label: "Aprender a jogar", href: "#rules" },
    alphaLabel: "ALPHA EM CONSTRUÇÃO"
  }) : "{}");
  const [seo, setSeo] = useState("{}");
  const [changeNote, setChangeNote] = useState("");
  const [item, setItem] = useState<CmsItem | null>(null);
  const [versions, setVersions] = useState<CmsVersion[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "error" | "success" | "notice"; text: string } | null>(null);

  const endpoint = useMemo(() => `/api/portal-admin/site/${definition.key}/${encodeURIComponent(slug)}?locale=${encodeURIComponent(locale)}`, [definition.key, slug, locale]);

  function parseJson(value: string, field: string) {
    try {
      const parsed = JSON.parse(value);
      if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") throw new Error();
      return parsed;
    } catch {
      throw new Error(`${field} precisa ser um objeto JSON válido.`);
    }
  }

  async function load() {
    if (!slug.trim()) return setMessage({ kind: "error", text: "Informe um slug." });
    setBusy(true); setMessage(null);
    try {
      const response = await fetch(endpoint, { cache: "no-store" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (response.status === 404) {
          setItem(null); setVersions([]);
          setMessage({ kind: "notice", text: "Registro ainda não existe. Preencha o payload e salve o primeiro rascunho." });
          return;
        }
        if (response.status === 401) throw new Error("Sessão expirada. Entre novamente no Portal Control.");
        throw new Error(data.error || "Falha ao carregar conteúdo.");
      }
      setItem(data.item);
      setVersions(data.versions ?? []);
      setPayload(pretty(data.item.payload));
      setSeo(pretty(data.item.seo));
      setMessage({ kind: "success", text: `Versão ${data.item.version} carregada.` });
    } catch (error) {
      setMessage({ kind: "error", text: error instanceof Error ? error.message : "Falha ao carregar." });
    } finally { setBusy(false); }
  }

  async function save(status: "draft" | "review") {
    setBusy(true); setMessage(null);
    try {
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, payload: parseJson(payload, "Payload"), seo: parseJson(seo, "SEO"), status, changeNote }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Falha ao salvar conteúdo.");
      setItem(data.item);
      setMessage({ kind: "success", text: `${status === "review" ? "Revisão" : "Rascunho"} salva como versão ${data.item.version}.` });
      await load();
    } catch (error) {
      setMessage({ kind: "error", text: error instanceof Error ? error.message : "Falha ao salvar." });
    } finally { setBusy(false); }
  }

  async function transition(action: "publish" | "archive") {
    setBusy(true); setMessage(null);
    try {
      const response = await fetch(`/api/portal-admin/site/${definition.key}/${encodeURIComponent(slug)}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, changeNote }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || `Falha ao executar ${action}.`);
      setMessage({ kind: "success", text: action === "publish" ? `Publicado na versão ${data.item.version}.` : `Arquivado na versão ${data.item.version}.` });
      await load();
    } catch (error) {
      setMessage({ kind: "error", text: error instanceof Error ? error.message : "Falha na transição." });
    } finally { setBusy(false); }
  }

  async function rollback(version: number) {
    if (!confirm(`Restaurar a versão ${version} como um novo rascunho?`)) return;
    setBusy(true); setMessage(null);
    try {
      const response = await fetch(`/api/portal-admin/site/${definition.key}/${encodeURIComponent(slug)}/rollback/${version}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, changeNote: `Rollback solicitado pelo Portal Control para v${version}` }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Falha no rollback.");
      setMessage({ kind: "success", text: `Versão ${version} restaurada como novo rascunho v${data.item.version}.` });
      await load();
    } catch (error) {
      setMessage({ kind: "error", text: error instanceof Error ? error.message : "Falha no rollback." });
    } finally { setBusy(false); }
  }

  return (
    <>
      <section className={styles.panel}>
        <div className={styles.panelTitle}><h2>Conteúdo versionado</h2><span>{definition.key.toUpperCase()}</span></div>
        <div className={styles.fields}>
          <div className={styles.field}><label>Slug</label><input value={slug} onChange={(e) => setSlug(e.target.value)} /></div>
          <div className={styles.field}><label>Locale</label><select value={locale} onChange={(e) => setLocale(e.target.value)}><option>pt-BR</option><option>en-US</option><option>es-ES</option></select></div>
          <div className={`${styles.field} ${styles.full}`}><label>Payload JSON</label><textarea value={payload} onChange={(e) => setPayload(e.target.value)} spellCheck={false} /><div className={styles.jsonHint}>Editor universal: todos os 16 domínios podem ser persistidos agora. Formulários especializados serão adicionados sem alterar este contrato.</div></div>
          <div className={`${styles.field} ${styles.full}`}><label>SEO / Metadata JSON</label><textarea className={styles.small} value={seo} onChange={(e) => setSeo(e.target.value)} spellCheck={false} /></div>
          <div className={`${styles.field} ${styles.full}`}><label>Nota da alteração</label><input value={changeNote} onChange={(e) => setChangeNote(e.target.value)} placeholder="O que mudou nesta versão?" /></div>
        </div>
        {message ? <div className={styles[message.kind]}>{message.text}</div> : null}
        <div className={styles.toolbar}>
          <button className={styles.secondaryButton} disabled={busy} onClick={load}>Carregar</button>
          <button className={styles.secondaryButton} disabled={busy} onClick={() => save("draft")}>Salvar rascunho</button>
          <button className={styles.secondaryButton} disabled={busy} onClick={() => save("review")}>Enviar para revisão</button>
          <button className={styles.primaryButton} disabled={busy || !item} onClick={() => transition("publish")}>Publicar</button>
          <button className={styles.dangerButton} disabled={busy || !item} onClick={() => transition("archive")}>Arquivar</button>
        </div>
      </section>

      <aside className={styles.sideStack}>
        <section className={styles.panel}>
          <div className={styles.panelTitle}><h2>Estado</h2><span>LIVE</span></div>
          {item ? <div className={styles.metadata}>
            <div><small>Status</small><strong>{item.status}</strong></div><div><small>Versão</small><strong>v{item.version}</strong></div>
            <div><small>Atualizado por</small><strong>{item.updatedBy}</strong></div><div><small>Publicado</small><strong>{item.publishedAt ? "sim" : "não"}</strong></div>
          </div> : <p className={styles.empty}>Nenhum registro carregado. Use “Carregar” ou salve o primeiro rascunho.</p>}
        </section>
        <section className={styles.panel}>
          <div className={styles.panelTitle}><h2>Histórico</h2><span>{versions.length} VERSÕES</span></div>
          <div className={styles.history}>
            {versions.length ? versions.map((version) => <article className={styles.version} key={version.id}>
              <div className={styles.versionTop}><strong>v{version.version} · {version.status}</strong><span>{version.actor}</span></div>
              <p>{version.changeNote || "Sem nota editorial."}</p>
              <button disabled={busy} onClick={() => rollback(version.version)}>Restaurar como rascunho →</button>
            </article>) : <p className={styles.empty}>O histórico aparecerá depois do primeiro salvamento.</p>}
          </div>
        </section>
      </aside>
    </>
  );
}
