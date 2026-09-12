"use client";

import { useMemo, useState } from "react";
import type { PortalResourceDefinition, PortalResourceKey } from "@/lib/cms/content-model";
import styles from "./admin.module.css";

type GroupKey = "experience" | "knowledge" | "liveops" | "operations";

const groups: Array<{ key: GroupKey; label: string; description: string; resources: PortalResourceKey[] }> = [
  { key: "experience", label: "Experiência", description: "O que o jogador vê primeiro e como navega pelo portal.", resources: ["home", "navigation", "pages", "cards", "collections", "regions"] },
  { key: "knowledge", label: "Conhecimento", description: "Regras, mecânicas, universo e conteúdo editorial de referência.", resources: ["keywords", "rules", "lore", "news"] },
  { key: "liveops", label: "Live Ops", description: "Superfícies temporais e comunicação de operação pública.", resources: ["alpha", "events", "promotions", "roadmap"] },
  { key: "operations", label: "Operação", description: "Mídia e metadados de descoberta do portal.", resources: ["media", "seo"] },
];

export default function AdminResourceDirectory({ resources }: { resources: PortalResourceDefinition[] }) {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLocaleLowerCase("pt-BR");
  const byKey = useMemo(() => new Map(resources.map((resource) => [resource.key, resource])), [resources]);

  const visibleGroups = groups.map((group) => ({
    ...group,
    items: group.resources
      .map((key) => byKey.get(key))
      .filter((resource): resource is PortalResourceDefinition => Boolean(resource))
      .filter((resource) => !normalized || `${resource.label} ${resource.description} ${resource.key}`.toLocaleLowerCase("pt-BR").includes(normalized)),
  })).filter((group) => group.items.length > 0);

  return (
    <section className={styles.directory} aria-label="Diretório de conteúdo">
      <div className={styles.directoryToolbar}>
        <div><span className={styles.kicker}>CENTRAL DE CONTEÚDO</span><h2>Encontre qualquer superfície em segundos.</h2></div>
        <label className={styles.resourceSearch}><span>Buscar recurso</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Home, lore, SEO, eventos…" /></label>
      </div>
      <div className={styles.quickLinks}>
        <a href="/admin/home">Editar Home</a><a href="/admin/news">Publicar notícia</a><a href="/admin/lore">Editar Lore</a><a href="/admin/seo">SEO global</a><a href="/" target="_blank" rel="noreferrer">Abrir portal ↗</a>
      </div>
      {visibleGroups.length ? visibleGroups.map((group) => (
        <section className={styles.resourceGroup} key={group.key}>
          <header><div><span>{group.label}</span><p>{group.description}</p></div><strong>{group.items.length}</strong></header>
          <div className={styles.resourceGrid}>
            {group.items.map((resource) => (
              <article className={styles.resourceCard} key={resource.key}>
                <div className={styles.resourceTop}><span>{resource.key.toUpperCase()}</span><em>EDITOR ATIVO</em></div>
                <h3>{resource.label}</h3><p>{resource.description}</p>
                <div className={styles.roleRow}><small>Editar</small><span>{resource.ownerRoles.join(" · ")}</span></div>
                <div className={styles.roleRow}><small>Publicar</small><span>{resource.publishRoles.join(" · ")}</span></div>
                <a className={styles.editorLink} href={`/admin/${resource.key}`}>Abrir editor <span>→</span></a>
              </article>
            ))}
          </div>
        </section>
      )) : <div className={styles.noResults}>Nenhum recurso corresponde a “{query}”.</div>}
    </section>
  );
}
