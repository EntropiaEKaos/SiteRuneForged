import type { Metadata } from "next";
import MobileSiteNavigation from "@/components/MobileSiteNavigation";
import "./globals.css";
import "./public-experience.css";

export const metadata: Metadata = {
  title: "RuneForge — Forge Your Legend",
  description: "Portal oficial do RuneForge. Explore cartas, coleções, regras, mecânicas e o universo do jogo.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <MobileSiteNavigation />
      </body>
    </html>
  );
}
