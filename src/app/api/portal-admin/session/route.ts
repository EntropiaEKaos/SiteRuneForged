import { NextRequest } from "next/server";

const ADMIN_API_URL = process.env.RUNEFORGE_ADMIN_API_URL ?? process.env.RUNEFORGE_API_URL;

function backendUrl(path: string) {
  if (!ADMIN_API_URL) return null;
  return `${ADMIN_API_URL.replace(/\/$/, "")}${path}`;
}

function unavailable() {
  return Response.json({ ok: false, error: "RuneForge Admin API is not configured" }, { status: 503 });
}

async function forwardSession(req: NextRequest, method: "GET" | "DELETE") {
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
    headers: { "Content-Type": upstream.headers.get("content-type") ?? "application/json" },
  });
  const setCookie = upstream.headers.get("set-cookie");
  if (setCookie) response.headers.append("Set-Cookie", setCookie);
  return response;
}

export async function GET(req: NextRequest) {
  return forwardSession(req, "GET");
}

export async function POST(req: NextRequest) {
  const url = backendUrl("/api/admin/login");
  if (!url) return unavailable();
  const body = await req.text();
  if (new TextEncoder().encode(body).byteLength > 16_000) {
    return Response.json({ ok: false, error: "Payload too large" }, { status: 413 });
  }
  const upstream = await fetch(url, {
    method: "POST",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body,
  });
  const responseBody = await upstream.text();
  const response = new Response(responseBody, {
    status: upstream.status,
    headers: { "Content-Type": upstream.headers.get("content-type") ?? "application/json" },
  });
  const setCookie = upstream.headers.get("set-cookie");
  if (setCookie) response.headers.append("Set-Cookie", setCookie);
  return response;
}

export async function DELETE(req: NextRequest) {
  const url = backendUrl("/api/admin/login");
  if (!url) return unavailable();
  const cookie = req.headers.get("cookie") ?? "";
  const upstream = await fetch(url, {
    method: "DELETE",
    cache: "no-store",
    headers: cookie ? { Cookie: cookie } : undefined,
  });
  const body = await upstream.text();
  const response = new Response(body, {
    status: upstream.status,
    headers: { "Content-Type": upstream.headers.get("content-type") ?? "application/json" },
  });
  const setCookie = upstream.headers.get("set-cookie");
  if (setCookie) response.headers.append("Set-Cookie", setCookie);
  return response;
}
