import { getPortalSectionMetadata, PortalSectionIndex } from "@/components/PortalEditorial";

export const metadata = getPortalSectionMetadata("events");

export default function Page() {
  return <PortalSectionIndex section="events" />;
}
