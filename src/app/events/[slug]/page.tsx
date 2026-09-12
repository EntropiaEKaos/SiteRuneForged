import { getPortalArticleMetadata, PortalSectionArticle } from "@/components/PortalEditorial";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  return getPortalArticleMetadata("events", slug);
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  return <PortalSectionArticle section="events" slug={slug} />;
}
