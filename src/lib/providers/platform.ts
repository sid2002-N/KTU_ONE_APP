/**
 * PlatformProvider — abstracts the runtime platform (Web / Android / iOS).
 *
 * Providers across the app may switch implementations based on the platform.
 * The UI never branches on platform — it asks PlatformProvider.
 */

export type Platform = "web" | "android" | "ios";

export interface PlatformInfo {
  platform: Platform;
  isNative: boolean; // android or ios
  isWeb: boolean;
  isPWA: boolean;
  isStandalone: boolean; // running as installed PWA
  version: string;
}

export interface PlatformProvider {
  getInfo(): PlatformInfo;
  /**
   * Returns a secure-storage-capable flag.
   * Native platforms use SecureStorage; web uses cookies/sessionStorage.
   */
  supportsSecureStorage(): boolean;
  /**
   * Haptic feedback (no-op on web without vibration support).
   */
  haptic?(kind: "light" | "medium" | "heavy" | "success" | "error"): void;
}

class WebPlatformProvider implements PlatformProvider {
  getInfo(): PlatformInfo {
    const isStandalone =
      typeof window !== "undefined" &&
      (window.matchMedia?.("(display-mode: standalone)").matches ||
        (window.navigator as { standalone?: boolean }).standalone === true);
    return {
      platform: "web",
      isNative: false,
      isWeb: true,
      isPWA: isStandalone,
      isStandalone,
      version: "1.0.0",
    };
  }

  supportsSecureStorage(): boolean {
    return typeof document !== "undefined" && "cookie" in document;
  }

  haptic(kind: "light" | "medium" | "heavy" | "success" | "error") {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      const patterns: Record<string, number | number[]> = {
        light: 10,
        medium: 20,
        heavy: 40,
        success: [10, 30, 10],
        error: [40, 30, 40],
      };
      navigator.vibrate(patterns[kind] as number | number[]);
    }
  }
}

let _instance: PlatformProvider | null = null;

export function getPlatformProvider(): PlatformProvider {
  if (!_instance) {
    _instance = new WebPlatformProvider();
  }
  return _instance;
}

export function __setPlatformProvider(p: PlatformProvider) {
  _instance = p;
}
