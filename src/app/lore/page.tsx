import { getPortalSectionMetadata, PortalSectionIndex } from "@/components/PortalEditorial";

export const metadata = getPortalSectionMetadata("lore");

export default function Page() {
  return <PortalSectionIndex section="lore" />;
}
