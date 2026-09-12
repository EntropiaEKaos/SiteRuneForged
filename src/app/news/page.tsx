import { getPortalSectionMetadata, PortalSectionIndex } from "@/components/PortalEditorial";

export const metadata = getPortalSectionMetadata("news");

export default function Page() {
  return <PortalSectionIndex section="news" />;
}
