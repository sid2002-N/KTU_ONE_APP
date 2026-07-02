/**
 * AdsProvider — abstracts ad serving across platforms.
 *
 * Web MVP: MockAdsProvider (renders branded placeholders).
 * Future: Google AdSense (web), Google AdMob (android), none (iOS not supported).
 *
 * Pages only render <BannerAd />. They never know which provider is active.
 */

export type AdSlot = "home-top" | "home-mid" | "papers-list" | "syllabus-list" | "notices-list" | "settings-top";

export interface AdDescriptor {
  slot: AdSlot;
  // Implementation fills these in
  render: "mock" | "adsense" | "admob" | "none";
  height: number; // px
  label: string;
}

export interface AdsProvider {
  /** Whether ads should be shown (false if supporter, env flag, etc.) */
  isEnabled(): boolean;

  /** Disable ads (e.g. user just became supporter). */
  setEnabled(enabled: boolean): void;

  /** Returns ad metadata for a slot. The UI decides how to render. */
  getAd(slot: AdSlot): AdDescriptor;
}

class MockAdsProvider implements AdsProvider {
  private enabled = true;

  isEnabled() {
    return this.enabled;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  getAd(slot: AdSlot): AdDescriptor {
    const heights: Record<AdSlot, number> = {
      "home-top": 100,
      "home-mid": 120,
      "papers-list": 110,
      "syllabus-list": 110,
      "notices-list": 110,
      "settings-top": 90,
    };
    const labels: Record<AdSlot, string> = {
      "home-top": "Sponsored — Banner Ad",
      "home-mid": "Sponsored — Banner Ad",
      "papers-list": "Sponsored — Banner Ad",
      "syllabus-list": "Sponsored — Banner Ad",
      "notices-list": "Sponsored — Banner Ad",
      "settings-top": "Sponsored — Banner Ad",
    };
    return {
      slot,
      render: "mock",
      height: heights[slot],
      label: labels[slot],
    };
  }
}

let _instance: AdsProvider | null = null;

export function getAdsProvider(): AdsProvider {
  if (!_instance) _instance = new MockAdsProvider();
  return _instance;
}

export function __setAdsProvider(p: AdsProvider) {
  _instance = p;
}
