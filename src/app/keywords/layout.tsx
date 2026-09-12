import { portalMetadata } from "@/lib/portal/seo";

export const metadata = portalMetadata({ title: "Mecânicas & Keywords", description: "Consulte o glossário público de keywords e mecânicas certificadas de RuneForge.", path: "/keywords" });

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
