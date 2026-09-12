import { portalMetadata } from "@/lib/portal/seo";

export const metadata = portalMetadata({ title: "Coleções", description: "Explore coleções, símbolos, identidades e o arquivo público de sets de RuneForge.", path: "/collections" });

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
