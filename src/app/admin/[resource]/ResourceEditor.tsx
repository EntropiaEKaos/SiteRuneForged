"use client";

import { useEffect, useMemo, useState } from "react";
import type { PortalResourceDefinition } from "@/lib/cms/content-model";
import { defaultCardsHome, defaultHome, defaultNavigation, defaultRegionsHome } from "@/lib/cms/defaults";
import styles from "../editor.module.css";

type CmsVersion = { id: number; version: number; status: string; actor: string; changeNote?: string; createdAt?: string };
type CmsItem = { id: number; slug: string; locale: string; status: string; payload: unknown; seo: unknown; version: number; updatedBy: string; updatedAt: string; publishedAt?: string | null };
type DraftSnapshot = { payload: string; seo: string; changeNote: string; savedAt: string };

const pretty = (value: unknown) => JSON.stringify(value ?? {}, null, 2);

function initialResource(definition: PortalResourceDefinition) {
  switch (definition.key) {
    case "home": return { slug: "main", payload: defaultHome };
    case "navigation": return { slug: "main", payload: defaultNavigation };
    case "cards": return { slug: "home", payload: defaultCardsHome };
    case "regions": return { slug: "home", payload: defaultRegionsHome };
    case "alpha": return { slug: "main", payload: defaultHome.alpha };
    default: return { slug: "main", payload: {} };
  }
}

function previewHref(resource: string, slug: string) {
  if (resource === "home" || resource === "navigation" || resource === "pages" || resource === "media" || resource === "seo" || resource === "promotions") return "/";
  if (resource === "cards") return "/cards";
  if (resource === "collections") return slug && slug !== "main" ? `/collections/${encodeURIComponent(slug)}` : "/collections";
  if (resource === "regions") return "/regions";
  if (resource === "keywords") return slug && slug !== "main" ? `/keywords/${encodeURIComponent(slug)}` : "/keywords";
  if (["rules", "lore", "news", "events", "roadmap"].includes(resource)) return slug && slug !== "main" ? `/${resource}/${encodeURIComponent(slug)}` : `/${resource}`;
  if (resource === "alpha") return "/alpha";
  return "/";
}

function previewFromJson(value: string) {
  try {
    const data = JSON.parse(value) as Record<string, unknown>;
    const hero = data.hero && typeof data.hero === "object" ? data.hero as Record<string, unknown> : undefined;
    return {
      kicker: String(data.kicker ?? hero?.eyebrow ?? "PREVIEW EDITORIAL"),
      title: String(data.title ?? hero?.title ?? "Conteúdo sem título explícito"),
      description: String(data.summary ?? data.description ?? hero?.description ?? "O preview mostra campos editoriais comuns enquanto o JSON continua sendo a fonte universal."),
    };
  } catch {
    return { kicker: "JSON INVÁLIDO", title: "Corrija o payload para visualizar", description: "O rascunho local continua preservado enquanto você corrige a estrutura." };
  }
}

export default function ResourceEditor({ definition }: { definition: PortalResourceDefinition }) {
  const initial = useMemo(() => initialResource(definition), [definition]);
  const [slug, setSlug] = useState(initial.slug);
  const [locale, setLocale] = useState("pt-BR");
  const [payload, setPayload] = useState(pretty(initial.payload));
  const [seo, setSeo] = useState("{}");
  const [changeNote, setChangeNote] = useState("");
  const [item, setItem] = useState<CmsItem | null>(null);
  const [versions, setVersions] = useState<CmsVersion[]>([]);
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [localDraft, setLocalDraft] = useState<DraftSnapshot | null>(null);
  const [message, setMessage] = useState<{ kind: "error" | "success" | "notice"; text: string } | null>(null);
  const [conflictVersion, setConflictVersion] = useState<number | null>(null);

  const endpoint = useMemo(() => `/api/portal-admin/site/${definition.key}/${encodeURIComponent(slug)}?locale=${encodeURIComponent(locale)}`, [definition.key, slug, locale]);
  const expectedVersion = item?.version ?? 0;
  const draftKey = `runeforge.portal.draft.${definition.key}.${locale}.${slug}`;
  const preview = useMemo(() => previewFromJson(payload), [payload]);
  const publicHref = previewHref(definition.key, slug);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(draftKey);
      setLocalDraft(raw ? JSON.parse(raw) as DraftSnapshot : null);
    } catch { setLocalDraft(null); }
  }, [draftKey]);

  useEffect(() => {
    if (!dirty) return;
    const timer = window.setTimeout(() => {
      const snapshot: DraftSnapshot = { payload, seo, changeNote, savedAt: new Date().toISOString() };
      localStorage.setItem(draftKey, JSON.stringify(snapshot));
      setLocalDraft(snapshot);
    }, 650);
    return () => window.clearTimeout(timer);
  }, [changeNote, dirty, draftKey, payload, seo]);

  useEffect(() => {
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [dirty]);

  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === "s") {
        event.preventDefault();
        if (!busy && conflictVersion === null) void save("draft");
      }
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  });

  function mutationError(response: Response, data: { error?: string; currentVersion?: number }, fallback: string) {
    if (response.status === 409) {
      const currentVersion = Number(data.currentVersion ?? 0);
      setConflictVersion(currentVersion);
      return new Error(`Conflito de versão: editor v${expectedVersion}, servidor v${currentVersion}. Seu JSON local foi preservado.`);
    }
    return new Error(data.error || fallback);
  }

  function parseJson(value: string, field: string) {
    try {
      const parsed = JSON.parse(value);
      if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") throw new Error();
      return parsed;
    } catch { throw new Error(`${field} precisa ser um objeto JSON válido.`); }
  }

  function markDirty(setter: (value: string) => void, value: string) {
    setter(value); setDirty(true);
  }

  function restoreLocalDraft() {
    if (!localDraft) return;
    setPayload(localDraft.payload); setSeo(localDraft.seo); setChangeNote(localDraft.changeNote); setDirty(true);
    setMessage({ kind: "notice", text: `Rascunho local restaurado de ${new Date(localDraft.savedAt).toLocaleString("pt-BR")}.` });
  }

  function clearLocalDraft() {
    localStorage.removeItem(draftKey); setLocalDraft(null);
  }

  async function load() {
    if (!slug.trim()) return setMessage({ kind: "error", text: "Informe um slug." });
    if (dirty && !confirm("Carregar do servidor e substituir o conteúdo atual do editor? O rascunho local continuará disponível.")) return;
    setBusy(true); setMessage(null);
    try {
      const response = await fetch(endpoint, { cache: "no-store" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (response.status === 404) { setItem(null); setVersions([]); setConflictVersion(null); setDirty(false); setMessage({ kind: "notice", text: "Registro ainda não existe. Salve o primeiro rascunho quando estiver pronto." }); return; }
        if (response.status === 401) throw new Error("Sessão expirada. Entre novamente no Portal Control.");
        throw new Error(data.error || "Falha ao carregar conteúdo.");
      }
      setItem(data.item); setVersions(data.versions ?? []); setConflictVersion(null); setPayload(pretty(data.item.payload)); setSeo(pretty(data.item.seo)); setDirty(false);
      setMessage({ kind: "success", text: `Versão ${data.item.version} carregada.` });
    } catch (error) { setMessage({ kind: "error", text: error instanceof Error ? error.message : "Falha ao carregar." }); }
    finally { setBusy(false); }
  }

  async function save(status: "draft" | "review") {
    setBusy(true); setMessage(null);
    try {
      const response = await fetch(endpoint, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ locale, expectedVersion, payload: parseJson(payload, "Payload"), seo: parseJson(seo, "SEO"), status, changeNote }) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw mutationError(response, data, "Falha ao salvar conteúdo.");
      setItem(data.item); setConflictVersion(null); setDirty(false); clearLocalDraft();
      setMessage({ kind: "success", text: `${status === "review" ? "Revisão" : "Rascunho"} salva como versão ${data.item.version}.` });
      await refreshHistory(data.item);
    } catch (error) { setMessage({ kind: "error", text: error instanceof Error ? error.message : "Falha ao salvar." }); }
    finally { setBusy(false); }
  }

  async function refreshHistory(currentItem?: CmsItem) {
    const response = await fetch(endpoint, { cache: "no-store" });
    if (!response.ok) return;
    const data = await response.json().catch(() => ({}));
    setItem(data.item ?? currentItem ?? null); setVersions(data.versions ?? []);
  }

  async function transition(action: "publish" | "archive") {
    const verb = action === "publish" ? "publicar esta versão no portal" : "arquivar este conteúdo público";
    if (!confirm(`Confirma que deseja ${verb}?`)) return;
    setBusy(true); setMessage(null);
    try {
      const response = await fetch(`/api/portal-admin/site/${definition.key}/${encodeURIComponent(slug)}/${action}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ locale, expectedVersion, changeNote }) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw mutationError(response, data, `Falha ao executar ${action}.`);
      setConflictVersion(null); setDirty(false); clearLocalDraft();
      setMessage({ kind: "success", text: action === "publish" ? `Publicado na versão ${data.item.version}.` : `Arquivado na versão ${data.item.version}.` });
      await refreshHistory(data.item);
    } catch (error) { setMessage({ kind: "error", text: error instanceof Error ? error.message : "Falha na transição." }); }
    finally { setBusy(false); }
  }

  async function rollback(version: number) {
    if (!confirm(`Restaurar a versão ${version} como um novo rascunho?`)) return;
    setBusy(true); setMessage(null);
    try {
      const response = await fetch(`/api/portal-admin/site/${definition.key}/${encodeURIComponent(slug)}/rollback/${version}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ locale, expectedVersion, changeNote: `Rollback solicitado pelo Portal Control para v${version}` }) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw mutationError(response, data, "Falha no rollback.");
      setConflictVersion(null); setDirty(false); clearLocalDraft();
      setMessage({ kind: "success", text: `Versão ${version} restaurada como novo rascunho v${data.item.version}.` });
      await refreshHistory(data.item);
    } catch (error) { setMessage({ kind: "error", text: error instanceof Error ? error.message : "Falha no rollback." }); }
    finally { setBusy(false); }
  }

  return (
    <>
      <section className={styles.panel}>
        <div className={styles.panelTitle}><h2>Conteúdo versionado</h2><div className={styles.editorState}><span>{definition.key.toUpperCase()}</span><em className={dirty ? styles.dirty : styles.clean}>{dirty ? "NÃO SALVO" : "SINCRONIZADO"}</em></div></div>
        {localDraft ? <div className={styles.localDraft}><div><strong>Rascunho local disponível</strong><span>{new Date(localDraft.savedAt).toLocaleString("pt-BR")}</span></div><button type="button" onClick={restoreLocalDraft}>Restaurar</button><button type="button" onClick={clearLocalDraft}>Descartar</button></div> : null}
        <div className={styles.fields}>
          <div className={styles.field}><label>Slug</label><input value={slug} onChange={(e) => setSlug(e.target.value)} /></div>
          <div className={styles.field}><label>Locale</label><select value={locale} onChange={(e) => setLocale(e.target.value)}><option>pt-BR</option><option>en-US</option><option>es-ES</option></select></div>
          <div className={`${styles.field} ${styles.full}`}><label>Payload JSON</label><textarea value={payload} onChange={(e) => markDirty(setPayload, e.target.value)} spellCheck={false} /><div className={styles.jsonHint}>Autosave local ativo · Ctrl/Cmd+S salva rascunho no CMS · publicação continua explícita.</div></div>
          <div className={`${styles.field} ${styles.full}`}><label>SEO / Metadata JSON</label><textarea className={styles.small} value={seo} onChange={(e) => markDirty(setSeo, e.target.value)} spellCheck={false} /></div>
          <div className={`${styles.field} ${styles.full}`}><label>Nota da alteração</label><input value={changeNote} onChange={(e) => markDirty(setChangeNote, e.target.value)} placeholder="O que mudou nesta versão?" /></div>
        </div>
        {message ? <div className={styles[message.kind]}>{message.text}</div> : null}
        {conflictVersion !== null ? <div className={styles.notice}>Conflito ativo com v{conflictVersion}. O conteúdo local não foi descartado.</div> : null}
        <div className={styles.toolbar}><button className={styles.secondaryButton} disabled={busy} onClick={load}>Carregar</button><button className={styles.secondaryButton} disabled={busy || conflictVersion !== null} onClick={() => save("draft")}>Salvar rascunho</button><button className={styles.secondaryButton} disabled={busy || conflictVersion !== null} onClick={() => save("review")}>Enviar para revisão</button><button className={styles.primaryButton} disabled={busy || !item || conflictVersion !== null} onClick={() => transition("publish")}>Publicar</button><button className={styles.dangerButton} disabled={busy || !item || conflictVersion !== null} onClick={() => transition("archive")}>Arquivar</button></div>
      </section>

      <aside className={styles.sideStack}>
        <section className={`${styles.panel} ${styles.previewPanel}`}><div className={styles.panelTitle}><h2>Preview</h2><a href={publicHref} target="_blank" rel="noreferrer">Abrir público ↗</a></div><div className={styles.editorPreview}><small>{preview.kicker}</small><h3>{preview.title}</h3><p>{preview.description}</p><code>{publicHref}</code></div></section>
        <section className={styles.panel}><div className={styles.panelTitle}><h2>Estado</h2><span>LIVE</span></div>{item ? <div className={styles.metadata}><div><small>Status</small><strong>{item.status}</strong></div><div><small>Versão</small><strong>v{item.version}</strong></div><div><small>Atualizado por</small><strong>{item.updatedBy}</strong></div><div><small>Publicado</small><strong>{item.publishedAt ? "sim" : "não"}</strong></div></div> : <p className={styles.empty}>Nenhum registro carregado.</p>}</section>
        <section className={styles.panel}><div className={styles.panelTitle}><h2>Histórico</h2><span>{versions.length} VERSÕES</span></div><div className={styles.history}>{versions.length ? versions.map((version) => <article className={styles.version} key={version.id}><div className={styles.versionTop}><strong>v{version.version} · {version.status}</strong><span>{version.actor}</span></div><p>{version.changeNote || "Sem nota editorial."}</p><button disabled={busy || conflictVersion !== null} onClick={() => rollback(version.version)}>Restaurar como rascunho →</button></article>) : <p className={styles.empty}>O histórico aparecerá depois do primeiro salvamento.</p>}</div></section>
      </aside>
    </>
  );
}
