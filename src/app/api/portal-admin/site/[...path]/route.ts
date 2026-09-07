import { NextRequest } from "next/server";
import { portalResources } from "@/lib/cms/content-model";
import {
  PortalRequestBodyTooLargeError,
  isPortalMutation,
  portalMutationOriginAllowed,
  readPortalBoundedText,
} from "@/lib/portal/request-security";

const ADMIN_API_URL = process.env.RUNEFORGE_ADMIN_API_URL ?? process.env.RUNEFORGE_API_URL;
const allowedResources = new Set(portalResources.map((resource) => resource.key));
const MAX_PORTAL_ADMIN_BODY_BYTES = 512 * 1024;

function jsonError(error: string, status: number, headers: HeadersInit = {}) {
  return Response.json(
    { ok: false, error },
    { status, headers: { "Cache-Control": "no-store", ...headers } },
  );
}

function unavailable() {
  return jsonError("RuneForge Admin API is not configured", 503);
}

function validPath(parts: string[]) {
  if (!parts.length || !allowedResources.has(parts[0] as never)) return false;
  return parts.every((part) => /^[A-Za-z0-9._-]{1,180}$/.test(part));
}

async function proxy(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const method = req.method.toUpperCase();
  const mutation = isPortalMutation(method);

  if (mutation && !portalMutationOriginAllowed(req)) {
    return jsonError("Cross-origin portal admin mutation rejected", 403);
  }

  let body: string | undefined;
  if (mutation) {
    try {
      body = await readPortalBoundedText(req, MAX_PORTAL_ADMIN_BODY_BYTES);
    } catch (error) {
      if (error instanceof PortalRequestBodyTooLargeError) {
        return jsonError("Payload too large", 413);
      }
      return jsonError("Invalid portal admin payload", 400);
    }
  }

  if (!ADMIN_API_URL) return unavailable();

  const { path: parts = [] } = await ctx.params;
  if (!validPath(parts)) return jsonError("Invalid portal admin path", 400);

  const cookie = req.headers.get("cookie") ?? "";
  const search = req.nextUrl.search;
  const target = `${ADMIN_API_URL.replace(/\/$/, "")}/api/admin/site/${parts.map(encodeURIComponent).join("/")}${search}`;

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
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "application/json",
      "Cache-Control": "no-store",
    },
  });
}

export const GET = proxy;
export const PUT = proxy;
export const POST = proxy;
export const DELETE = proxy;
