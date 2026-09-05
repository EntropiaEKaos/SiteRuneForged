import { NextRequest } from "next/server";
import { portalResources } from "@/lib/cms/content-model";

const ADMIN_API_URL = process.env.RUNEFORGE_ADMIN_API_URL ?? process.env.RUNEFORGE_API_URL;
const allowedResources = new Set(portalResources.map((resource) => resource.key));

function unavailable() {
  return Response.json({ ok: false, error: "RuneForge Admin API is not configured" }, { status: 503 });
}

function validPath(parts: string[]) {
  if (!parts.length || !allowedResources.has(parts[0] as never)) return false;
  return parts.every((part) => /^[A-Za-z0-9._-]{1,180}$/.test(part));
}

async function proxy(req: NextRequest, ctx: { params: { path: string[] } }) {
  if (!ADMIN_API_URL) return unavailable();
  const parts = ctx.params.path ?? [];
  if (!validPath(parts)) return Response.json({ ok: false, error: "Invalid portal admin path" }, { status: 400 });

  const cookie = req.headers.get("cookie") ?? "";
  const search = req.nextUrl.search;
  const target = `${ADMIN_API_URL.replace(/\/$/, "")}/api/admin/site/${parts.map(encodeURIComponent).join("/")}${search}`;
  const method = req.method.toUpperCase();
  const body = method === "GET" || method === "HEAD" ? undefined : await req.text();

  const upstream = await fetch(target, {
    method,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...(body ? { "Content-Type": req.headers.get("content-type") ?? "application/json" } : {}),
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body,
  });
  return new Response(await upstream.text(), {
    status: upstream.status,
    headers: { "Content-Type": upstream.headers.get("content-type") ?? "application/json" },
  });
}

export const GET = proxy;
export const PUT = proxy;
export const POST = proxy;
export const DELETE = proxy;
