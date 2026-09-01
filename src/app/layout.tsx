import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RuneForge — Forge Your Legend",
  description: "Portal oficial do RuneForge. Explore cartas, coleções, regras, mecânicas e o universo do jogo.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
