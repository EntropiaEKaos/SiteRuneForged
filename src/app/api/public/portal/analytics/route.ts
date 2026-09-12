import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const allowedTypes = new Set(["page_view", "interaction", "web_vital"]);
const pathPattern = /^\/[A-Za-z0-9/_?=&.%+~-]*$/;
const tokenPattern = /^[A-Za-z0-9_.:+-]{1,120}$/;

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: NextRequest) {
  try {
    const raw = await request.text();
    if (!raw || raw.length > 2048) return new Response(null, { status: 413 });
    const input = JSON.parse(raw) as Record<string, unknown>;
    const type = text(input.type, 32);
    const path = text(input.path, 500);
    if (!allowedTypes.has(type) || !pathPattern.test(path) || path.startsWith("/admin")) {
      return new Response(null, { status: 400 });
    }

    const name = text(input.name, 120);
    const rating = text(input.rating, 24);
    const numeric = typeof input.value === "number" && Number.isFinite(input.value)
      ? Math.max(-1_000_000, Math.min(1_000_000, input.value))
      : undefined;

    if (name && !tokenPattern.test(name)) return new Response(null, { status: 400 });
    if (rating && !tokenPattern.test(rating)) return new Response(null, { status: 400 });

    console.info("[portal-analytics]", JSON.stringify({
      type,
      path,
      ...(name ? { name } : {}),
      ...(numeric !== undefined ? { value: numeric } : {}),
      ...(rating ? { rating } : {}),
      at: new Date().toISOString(),
    }));

    return new Response(null, {
      status: 204,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return new Response(null, { status: 400 });
  }
}
