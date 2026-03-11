/**
 * Fetches JSON from a URL and throws a contextual error for non-2xx responses.
 *
 * @param url - The absolute URL to request.
 * @param init - Optional fetch configuration.
 * @returns Parsed JSON payload.
 */
export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      ...init?.headers,
    },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`Request to ${url} failed with ${response.status} ${response.statusText}.`);
  }

  return (await response.json()) as T;
}
