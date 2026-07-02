/**
 * API base URL resolver.
 *
 * - Web build (standalone): `NEXT_PUBLIC_API_BASE_URL` is empty → relative
 *   same-origin requests (`/api/...`), unchanged behaviour.
 * - Capacitor build (static export): the WebView loads from `https://localhost`,
 *   so requests must be absolute. Set `NEXT_PUBLIC_API_BASE_URL` to the live
 *   backend origin (e.g. `https://ktu.one`) at build time.
 *
 * `apiUrl("/api/v1/x")` → `${base}/api/v1/x`. Absolute inputs pass through.
 */
const RAW_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

// Trim any trailing slash so joins never double-up.
export const API_BASE = RAW_BASE.replace(/\/+$/, "");

export function apiUrl(path: string): string {
  // Already absolute (http/https) — leave as-is.
  if (/^https?:\/\//i.test(path)) return path;
  if (!API_BASE) return path; // web: relative same-origin
  return `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
}
