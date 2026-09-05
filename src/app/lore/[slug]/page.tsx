import { PortalSectionArticle } from "@/components/PortalEditorial";

export default function Page({ params }: { params: { slug: string } }) {
  return <PortalSectionArticle section="lore" slug={params.slug} />;
}
