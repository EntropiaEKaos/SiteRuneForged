import { portalMetadata } from "@/lib/portal/seo";

export const metadata = portalMetadata({ title: "Regras & Como Jogar", description: "Aprenda fundamentos, timing, prioridade, tipos de carta e contratos certificados da engine de RuneForge.", path: "/rules" });

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
