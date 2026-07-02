/**
 * StorageProvider — abstracts persistent key/value storage.
 *
 * Web MVP: localStorage.
 * Future: Cloudflare R2 (for files), IndexedDB (for large blobs).
 * Native: Capacitor Preferences / SecureStorage.
 *
 * Pages and features NEVER call localStorage directly — they go through this.
 */

export interface StorageProvider {
  get<T = unknown>(key: string): Promise<T | null>;
  set<T = unknown>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  clear(prefix?: string): Promise<void>;
  keys(): Promise<string[]>;
}

const PREFIX = "ktu_one:";

class LocalStorageProvider implements StorageProvider {
  async get<T = unknown>(key: string): Promise<T | null> {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(PREFIX + key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  async set<T = unknown>(key: string, value: T): Promise<void> {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      // quota exceeded — silently fail; production would evict oldest
    }
  }

  async remove(key: string): Promise<void> {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(PREFIX + key);
  }

  async clear(prefix?: string): Promise<void> {
    if (typeof window === "undefined") return;
    const fullPrefix = PREFIX + (prefix ?? "");
    const all = Object.keys(window.localStorage).filter((k) =>
      k.startsWith(fullPrefix),
    );
    for (const k of all) window.localStorage.removeItem(k);
  }

  async keys(): Promise<string[]> {
    if (typeof window === "undefined") return [];
    return Object.keys(window.localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .map((k) => k.slice(PREFIX.length));
  }
}

let _instance: StorageProvider | null = null;

export function getStorageProvider(): StorageProvider {
  if (!_instance) _instance = new LocalStorageProvider();
  return _instance;
}

export const STORAGE_KEYS = {
  authSession: "auth:session",
  preferences: "app:preferences",
  supporterStatus: "supporter:status",
  calculatorHistory: "calc:history",
  bookmarks: "bookmarks",
  recentSearches: "search:recent",
  cachedProfile: "cache:profile",
  cachedResults: "cache:results",
  cachedAttendance: "cache:attendance",
  cachedCGPA: "cache:cgpa",
  lastSync: "sync:last",
} as const;
