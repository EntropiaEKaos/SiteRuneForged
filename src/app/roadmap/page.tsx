import { getPortalSectionMetadata, PortalSectionIndex } from "@/components/PortalEditorial";

export const metadata = getPortalSectionMetadata("roadmap");

export default function Page() {
  return <PortalSectionIndex section="roadmap" />;
}
