const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export class PortalRequestBodyTooLargeError extends Error {
  readonly code = "PORTAL_REQUEST_BODY_TOO_LARGE";

  constructor(readonly maxBytes: number) {
    super(`Portal request body exceeds ${maxBytes} bytes`);
    this.name = "PortalRequestBodyTooLargeError";
  }
}

export function isPortalMutation(method: string): boolean {
  return !SAFE_METHODS.has(method.toUpperCase());
}

/**
 * Same-origin browser boundary for Portal Control mutations.
 *
 * Admin cookies are HttpOnly and SameSite=Lax, but the BFF still validates the
 * browser origin before forwarding any privileged mutation to RuneForgedTCG.
 * Missing Origin is accepted only when Fetch Metadata explicitly identifies a
 * same-origin/non-navigation context.
 */
export function portalMutationOriginAllowed(request: Request): boolean {
  if (!isPortalMutation(request.method)) return true;

  const origin = request.headers.get("origin")?.trim() || "";
  const fetchSite = request.headers.get("sec-fetch-site")?.trim().toLowerCase() || "";

  if (!origin) return fetchSite === "same-origin" || fetchSite === "none";

  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

/**
 * Reads the actual request stream with a hard byte ceiling.
 *
 * Content-Length is only an early rejection optimization. The streamed byte
 * count remains authoritative so chunked/unknown-length requests cannot bypass
 * the Portal BFF limit.
 */
export async function readPortalBoundedText(request: Request, maxBytes: number): Promise<string> {
  if (!Number.isSafeInteger(maxBytes) || maxBytes < 1) {
    throw new TypeError("maxBytes must be a positive safe integer");
  }

  const declaredRaw = request.headers.get("content-length");
  if (declaredRaw) {
    const declared = Number(declaredRaw);
    if (Number.isFinite(declared) && declared > maxBytes) {
      throw new PortalRequestBodyTooLargeError(maxBytes);
    }
  }

  if (!request.body) return "";

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;

      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel().catch(() => undefined);
        throw new PortalRequestBodyTooLargeError(maxBytes);
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(bytes);
}
