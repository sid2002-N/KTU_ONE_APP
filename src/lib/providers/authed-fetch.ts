/** Shared authed fetch — auto-refreshes on 401, then retries. */
import { apiUrl } from "@/lib/api-base";

let _refreshing: Promise<boolean> | null = null;

async function refreshToken(): Promise<boolean> {
  if (_refreshing) return _refreshing;
  _refreshing = (async () => {
    try {
      const res = await fetch(apiUrl("/api/v1/refresh"), { method: "POST", credentials: "include" });
      return res.ok;
    } catch { return false; } finally { _refreshing = null; }
  })();
  return _refreshing;
}

export async function authedFetch(url: string, init?: RequestInit): Promise<Response> {
  // Resolve relative "/api/..." paths against the configured backend origin
  // (needed inside the Capacitor WebView, no-op on web).
  const target = apiUrl(url);
  let res = await fetch(target, { ...init, credentials: "include" });
  if (res.status === 401) {
    const refreshed = await refreshToken();
    if (refreshed) res = await fetch(target, { ...init, credentials: "include" });
  }
  return res;
}
