"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type NavItem = {
  href: string;
  label: string;
  icon: string;
  description?: string;
};

const dockItems: NavItem[] = [
  { href: "/", label: "Início", icon: "◆" },
  { href: "/cards", label: "Cartas", icon: "▧" },
  { href: "/lore", label: "Lore", icon: "ᚱ" },
];

const exploreItems: NavItem[] = [
  { href: "/cards", label: "Cartas", icon: "▧", description: "Catálogo público" },
  { href: "/collections", label: "Coleções", icon: "◫", description: "Sets e lançamentos" },
  { href: "/regions", label: "Regiões", icon: "✦", description: "Doutrinas da Forja" },
  { href: "/keywords", label: "Mecânicas", icon: "⌘", description: "Keywords certificadas" },
];

const knowledgeItems: NavItem[] = [
  { href: "/rules", label: "Regras", icon: "☷", description: "Como jogar" },
  { href: "/lore", label: "Lore", icon: "ᚱ", description: "Livro I" },
  { href: "/news", label: "Notícias", icon: "◇", description: "Novidades da Forja" },
  { href: "/snapshot", label: "Snapshot", icon: "◎", description: "Proveniência pública" },
];

const projectItems: NavItem[] = [
  { href: "/events", label: "Eventos", icon: "◈", description: "Atividades e anúncios" },
  { href: "/roadmap", label: "Roadmap", icon: "↗", description: "Próximos marcos" },
  { href: "/alpha", label: "Alpha", icon: "⚔", description: "Status e acesso" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SheetSection({ title, items, pathname, onNavigate }: {
  title: string;
  items: NavItem[];
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <section className="mobile-nav-section" aria-label={title}>
      <span className="mobile-nav-section-title">{title}</span>
      <div className="mobile-nav-grid">
        {items.map((item) => (
          <Link
            className={isActive(pathname, item.href) ? "mobile-nav-card is-active" : "mobile-nav-card"}
            href={item.href}
            key={item.href}
            onClick={onNavigate}
          >
            <span className="mobile-nav-card-icon" aria-hidden="true">{item.icon}</span>
            <span className="mobile-nav-card-copy">
              <strong>{item.label}</strong>
              <small>{item.description}</small>
            </span>
            <span className="mobile-nav-card-arrow" aria-hidden="true">›</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function MobileSiteNavigation() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <nav className="mobile-site-nav" aria-label="Navegação mobile principal">
        {dockItems.map((item) => (
          <Link
            className={isActive(pathname, item.href) ? "mobile-dock-item is-active" : "mobile-dock-item"}
            href={item.href}
            key={item.href}
          >
            <span aria-hidden="true">{item.icon}</span>
            <small>{item.label}</small>
          </Link>
        ))}
        <button
          aria-controls="mobile-site-menu"
          aria-expanded={open}
          className={open ? "mobile-dock-item mobile-menu-trigger is-active" : "mobile-dock-item mobile-menu-trigger"}
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          <span aria-hidden="true">☰</span>
          <small>Menu</small>
        </button>
      </nav>

      {open ? (
        <div className="mobile-menu-layer">
          <button className="mobile-menu-backdrop" aria-label="Fechar menu" onClick={() => setOpen(false)} type="button" />
          <div className="mobile-menu-sheet" id="mobile-site-menu" role="dialog" aria-modal="true" aria-label="Menu do RuneForge">
            <header className="mobile-menu-header">
              <Link className="mobile-menu-brand" href="/" onClick={() => setOpen(false)}>
                <span className="mobile-menu-brand-mark">RF</span>
                <span><strong>RuneForge</strong><small>Portal oficial</small></span>
              </Link>
              <button className="mobile-menu-close" aria-label="Fechar menu" onClick={() => setOpen(false)} type="button">×</button>
            </header>

            <div className="mobile-menu-scroll">
              <SheetSection title="Explorar o jogo" items={exploreItems} pathname={pathname} onNavigate={() => setOpen(false)} />
              <SheetSection title="Conhecimento" items={knowledgeItems} pathname={pathname} onNavigate={() => setOpen(false)} />
              <SheetSection title="Projeto" items={projectItems} pathname={pathname} onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
