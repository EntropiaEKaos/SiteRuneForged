import { portalMetadata } from "@/lib/portal/seo";

export const metadata = portalMetadata({ title: "Regiões", description: "Conheça as doutrinas regionais, identidades estratégicas e arsenais de RuneForge.", path: "/regions" });

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
