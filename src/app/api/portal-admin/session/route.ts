import { NextRequest } from "next/server";
import {
  PortalRequestBodyTooLargeError,
  portalMutationOriginAllowed,
  readPortalBoundedText,
} from "@/lib/portal/request-security";

const ADMIN_API_URL = process.env.RUNEFORGE_ADMIN_API_URL ?? process.env.RUNEFORGE_API_URL;
const MAX_PORTAL_LOGIN_BODY_BYTES = 16 * 1024;

function jsonError(error: string, status: number) {
  return Response.json(
    { ok: false, error },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

function backendUrl(path: string) {
  if (!ADMIN_API_URL) return null;
  return `${ADMIN_API_URL.replace(/\/$/, "")}${path}`;
}

function unavailable() {
  return jsonError("RuneForge Admin API is not configured", 503);
}

async function forwardSession(req: NextRequest, method: "GET" | "DELETE") {
  if (method === "DELETE" && !portalMutationOriginAllowed(req)) {
    return jsonError("Cross-origin portal admin mutation rejected", 403);
  }

  const url = backendUrl("/api/admin/session");
  if (!url) return unavailable();

  const cookie = req.headers.get("cookie") ?? "";
  const upstream = await fetch(url, {
    method,
    cache: "no-store",
    headers: cookie ? { Cookie: cookie } : undefined,
  });

  const body = await upstream.text();
  const response = new Response(body, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "application/json",
      "Cache-Control": "no-store",
    },
  });

  const setCookie = upstream.headers.get("set-cookie");
  if (setCookie) response.headers.append("Set-Cookie", setCookie);
  return response;
}

export async function GET(req: NextRequest) {
  return forwardSession(req, "GET");
}

export async function POST(req: NextRequest) {
  if (!portalMutationOriginAllowed(req)) {
    return jsonError("Cross-origin portal admin mutation rejected", 403);
  }

  let body: string;
  try {
    body = await readPortalBoundedText(req, MAX_PORTAL_LOGIN_BODY_BYTES);
  } catch (error) {
    if (error instanceof PortalRequestBodyTooLargeError) {
      return jsonError("Payload too large", 413);
    }
    return jsonError("Invalid login payload", 400);
  }

  const url = backendUrl("/api/admin/login");
  if (!url) return unavailable();

  const upstream = await fetch(url, {
    method: "POST",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body,
  });

  const responseBody = await upstream.text();
  const response = new Response(responseBody, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "application/json",
      "Cache-Control": "no-store",
    },
  });

  const setCookie = upstream.headers.get("set-cookie");
  if (setCookie) response.headers.append("Set-Cookie", setCookie);
  return response;
}

export async function DELETE(req: NextRequest) {
  return forwardSession(req, "DELETE");
}
