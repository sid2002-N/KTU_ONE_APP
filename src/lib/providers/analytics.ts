/**
 * AnalyticsProvider — abstracts event tracking.
 *
 * MVP: MockAnalyticsProvider (console logs in dev, no-op in prod).
 * Future: FirebaseAnalytics (native), GA4 / Vercel Analytics (web).
 */

export type AnalyticsEvent =
  | { name: "page_view"; props: { path: string; title?: string } }
  | { name: "calculator_used"; props: { type: string; result: number } }
  | { name: "paper_viewed"; props: { paperId: string } }
  | { name: "paper_downloaded"; props: { paperId: string } }
  | { name: "paper_bookmarked"; props: { paperId: string; bookmarked: boolean } }
  | { name: "search_performed"; props: { query: string; resultCount: number } }
  | { name: "supporter_purchase_started"; props: Record<string, never> }
  | { name: "supporter_purchase_succeeded"; props: { transactionId: string } }
  | { name: "supporter_purchase_failed"; props: { reason?: string } }
  | { name: "login_succeeded"; props: { registerNumber: string } }
  | { name: "login_failed"; props: { reason: string } }
  | { name: "notice_opened"; props: { noticeId: string } }
  | { name: "ad_clicked"; props: { slot: string } }
  | { name: "theme_changed"; props: { theme: string } };

export interface AnalyticsProvider {
  track(event: AnalyticsEvent): void;
  setUserProperty(key: string, value: string | number | boolean | null): void;
  setUserId(id: string | null): void;
}

class MockAnalyticsProvider implements AnalyticsProvider {
  track(event: AnalyticsEvent) {
    if (process.env.NODE_ENV !== "production") {
      console.debug(`[analytics] ${event.name}`, event.props);
    }
  }
  setUserProperty(key: string, value: string | number | boolean | null) {
    if (process.env.NODE_ENV !== "production") {
      console.debug(`[analytics] set ${key}=${value}`);
    }
  }
  setUserId(id: string | null) {
    if (process.env.NODE_ENV !== "production") {
      console.debug(`[analytics] setUserId ${id ?? "null"}`);
    }
  }
}

let _instance: AnalyticsProvider | null = null;

export function getAnalyticsProvider(): AnalyticsProvider {
  if (!_instance) _instance = new MockAnalyticsProvider();
  return _instance;
}

export function __setAnalyticsProvider(p: AnalyticsProvider) {
  _instance = p;
}
