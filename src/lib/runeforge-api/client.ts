const API_URL = process.env.RUNEFORGE_API_URL;

export class RuneForgeApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = "RuneForgeApiError";
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  if (!API_URL) throw new RuneForgeApiError(500, "RUNEFORGE_API_URL is not configured");

  const response = await fetch(`${API_URL.replace(/\/$/, "")}${path}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 300 },
  });

  if (!response.ok) throw new RuneForgeApiError(response.status, `RuneForge API request failed: ${path}`);
  return response.json() as Promise<T>;
}
