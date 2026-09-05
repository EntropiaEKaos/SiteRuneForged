import "server-only";

import { RuneForgeApiError } from "./client";

const ADMIN_API_URL = process.env.RUNEFORGE_ADMIN_API_URL ?? process.env.RUNEFORGE_API_URL;

export interface AdminRequestOptions extends RequestInit {
  cookieHeader?: string;
}

export type SiteLifecycleRequest = {
  locale: string;
  expectedVersion: number;
  changeNote?: string;
};

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
  list: <T>(resource: string, locale = "pt-BR", cookieHeader?: string) =>
    adminApi<T>(`/api/admin/site/${resource}?locale=${encodeURIComponent(locale)}`, { cookieHeader }),
  get: <T>(resource: string, slug: string, locale = "pt-BR", cookieHeader?: string) =>
    adminApi<T>(`/api/admin/site/${resource}/${encodeURIComponent(slug)}?locale=${encodeURIComponent(locale)}`, { cookieHeader }),
  save: <T>(resource: string, slug: string, payload: unknown, cookieHeader?: string) =>
    adminApi<T>(`/api/admin/site/${resource}/${encodeURIComponent(slug)}`, {
      method: "PUT",
      body: JSON.stringify(payload),
      cookieHeader,
    }),
  publish: <T>(resource: string, slug: string, request: SiteLifecycleRequest, cookieHeader?: string) =>
    adminApi<T>(`/api/admin/site/${resource}/${encodeURIComponent(slug)}/publish`, {
      method: "POST",
      body: JSON.stringify(request),
      cookieHeader,
    }),
  archive: <T>(resource: string, slug: string, request: SiteLifecycleRequest, cookieHeader?: string) =>
    adminApi<T>(`/api/admin/site/${resource}/${encodeURIComponent(slug)}/archive`, {
      method: "POST",
      body: JSON.stringify(request),
      cookieHeader,
    }),
  rollback: <T>(resource: string, slug: string, version: number, request: SiteLifecycleRequest, cookieHeader?: string) =>
    adminApi<T>(`/api/admin/site/${resource}/${encodeURIComponent(slug)}/rollback/${version}`, {
      method: "POST",
      body: JSON.stringify(request),
      cookieHeader,
    }),
};
