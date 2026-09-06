import { PortalSectionArticle } from "@/components/PortalEditorial";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PortalSectionArticle section="rules" slug={slug} />;
}
