import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let _loginLimiter: Ratelimit | null = null;
let _refreshLimiter: Ratelimit | null = null;

function getLimiters() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return { login: null, refresh: null };
  if (!_loginLimiter) {
    const redis = new Redis({ url, token });
    _loginLimiter = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, "15 m"), prefix: "ktu_one:login" });
    _refreshLimiter = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(30, "1 h"), prefix: "ktu_one:refresh" });
  }
  return { login: _loginLimiter, refresh: _refreshLimiter };
}

export async function checkLoginRateLimit(id: string) {
  const { login } = getLimiters();
  if (!login) return { success: true, limit: 5, remaining: 5, reset: Date.now() + 15 * 60 * 1000 };
  const r = await login.limit(id);
  return { success: r.success, limit: r.limit, remaining: r.remaining, reset: r.reset };
}

export async function checkRefreshRateLimit(id: string) {
  const { refresh } = getLimiters();
  if (!refresh) return { success: true, limit: 30, remaining: 30, reset: Date.now() + 60 * 60 * 1000 };
  const r = await refresh.limit(id);
  return { success: r.success, limit: r.limit, remaining: r.remaining, reset: r.reset };
}

export function getRequestIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? req.headers.get("x-real-ip")?.trim() ?? "anonymous";
}
