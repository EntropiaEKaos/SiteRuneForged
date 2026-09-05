import { PortalSectionArticle } from "@/components/PortalEditorial";

export default function Page({ params }: { params: { slug: string } }) {
  return <PortalSectionArticle section="news" slug={params.slug} />;
}
