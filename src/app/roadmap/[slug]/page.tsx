import { PortalSectionArticle } from "@/components/PortalEditorial";

export default function Page({ params }: { params: { slug: string } }) {
  return <PortalSectionArticle section="roadmap" slug={params.slug} />;
}
