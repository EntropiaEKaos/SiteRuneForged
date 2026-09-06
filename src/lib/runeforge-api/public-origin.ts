import "server-only";

function configuredOrigin(): string | null {
  const raw = process.env.RUNEFORGE_GAME_URL?.trim() || process.env.RUNEFORGE_API_URL?.trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.origin;
  } catch {
    return null;
  }
}

export function getRuneForgeGameHref(path = "/play"): string | null {
  const origin = configuredOrigin();
  if (!origin) return null;
  const safePath = path.startsWith("/") ? path : "/play";
  return new URL(safePath, origin).toString();
}
