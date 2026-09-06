import { getPortalDeploymentProvenance } from "@/lib/portal/deployment-provenance";

export const dynamic = "force-dynamic";

export async function GET() {
  const portal = getPortalDeploymentProvenance();

  if (!portal) {
    return Response.json(
      { ok: false, error: "Portal deployment provenance unavailable" },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store",
          "Retry-After": "5",
        },
      },
    );
  }

  return Response.json(
    { ok: true, portal },
    { headers: { "Cache-Control": "no-store" } },
  );
}
