import type { Metadata } from "next";
import MobileSiteNavigation from "@/components/MobileSiteNavigation";
import PortalAnalytics from "@/components/PortalAnalytics";
import { portalOrigin } from "@/lib/portal/seo";
import "./globals.css";
import "./public-experience.css";

const description = "Portal oficial do RuneForge. Explore cartas, coleções, regiões, regras, mecânicas e as crônicas do jogo.";

export const metadata: Metadata = {
  metadataBase: new URL(portalOrigin()),
  title: { default: "RuneForge — Forge Your Legend", template: "%s · RuneForge" },
  description,
  applicationName: "RuneForge",
  category: "game",
  keywords: ["RuneForge", "card game", "TCG", "jogo de cartas", "Vanilla", "RuneForge Alpha"],
  openGraph: {
    title: "RuneForge — Forge Your Legend",
    description,
    siteName: "RuneForge",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "RuneForge — Forge Your Legend" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "RuneForge — Forge Your Legend",
    description,
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <MobileSiteNavigation />
        <PortalAnalytics />
      </body>
    </html>
  );
}
