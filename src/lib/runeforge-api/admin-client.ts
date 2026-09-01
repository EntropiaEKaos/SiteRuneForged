import "server-only";

import { RuneForgeApiError } from "./client";

const ADMIN_API_URL = process.env.RUNEFORGE_ADMIN_API_URL ?? process.env.RUNEFORGE_API_URL;

export interface AdminRequestOptions extends RequestInit {
  cookieHeader?: string;
}

/**
 * Server-only bridge for RuneForge admin APIs.
 *
 * The control plane authenticates operators with the `rf_admin_session`
 * HttpOnly cookie. The browser never receives a backend token from here;
 * a same-origin Portal BFF forwards the verified session cookie.
 */
export async function adminApi<T>(path: string, options: AdminRequestOptions = {}): Promise<T> {
  if (!ADMIN_API_URL) {
    throw new RuneForgeApiError(500, "RUNEFORGE_ADMIN_API_URL is not configured");
  }

  const { cookieHeader, headers, ...requestOptions } = options;
  const response = await fetch(`${ADMIN_API_URL.replace(/\/$/, "")}${path}`, {
    ...requestOptions,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    throw new RuneForgeApiError(response.status, `RuneForge Admin API request failed: ${path}`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const portalAdminApi = {
  list: <T>(resource: string, cookieHeader?: string) => adminApi<T>(`/api/admin/site/${resource}`, { cookieHeader }),
  get: <T>(resource: string, slug: string, cookieHeader?: string) => adminApi<T>(`/api/admin/site/${resource}/${encodeURIComponent(slug)}`, { cookieHeader }),
  save: <T>(resource: string, slug: string, payload: unknown, cookieHeader?: string) => adminApi<T>(`/api/admin/site/${resource}/${encodeURIComponent(slug)}`, { method: "PUT", body: JSON.stringify(payload), cookieHeader }),
  publish: <T>(resource: string, slug: string, cookieHeader?: string) => adminApi<T>(`/api/admin/site/${resource}/${encodeURIComponent(slug)}/publish`, { method: "POST", cookieHeader }),
};
