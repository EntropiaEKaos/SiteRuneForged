import "server-only";

import { RuneForgeApiError } from "./client";

const ADMIN_API_URL = process.env.RUNEFORGE_ADMIN_API_URL ?? process.env.RUNEFORGE_API_URL;

export interface AdminRequestOptions extends RequestInit {
  token?: string;
}

export async function adminApi<T>(path: string, options: AdminRequestOptions = {}): Promise<T> {
  if (!ADMIN_API_URL) {
    throw new RuneForgeApiError(500, "RUNEFORGE_ADMIN_API_URL is not configured");
  }

  const { token, headers, ...requestOptions } = options;
  const response = await fetch(`${ADMIN_API_URL.replace(/\/$/, "")}${path}`, {
    ...requestOptions,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
  list: <T>(resource: string, token?: string) => adminApi<T>(`/api/admin/site/${resource}`, { token }),
  get: <T>(resource: string, slug: string, token?: string) => adminApi<T>(`/api/admin/site/${resource}/${encodeURIComponent(slug)}`, { token }),
  save: <T>(resource: string, slug: string, payload: unknown, token?: string) => adminApi<T>(`/api/admin/site/${resource}/${encodeURIComponent(slug)}`, { method: "PUT", body: JSON.stringify(payload), token }),
  publish: <T>(resource: string, slug: string, token?: string) => adminApi<T>(`/api/admin/site/${resource}/${encodeURIComponent(slug)}/publish`, { method: "POST", token }),
};
