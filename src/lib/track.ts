const EVENTS_KEY = 'em.events.v1';

export type AnalyticsEvent = {
  name: string;
  props?: Record<string, unknown>;
  ts: number;
};

export function track(name: string, props?: Record<string, unknown>): void {
  try {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem(EVENTS_KEY) : null;
    const list: AnalyticsEvent[] = raw ? JSON.parse(raw) : [];

    list.push({
      name,
      props,
      ts: Date.now()
    });

    if (list.length > 300) {
      list.splice(0, list.length - 300);
    }

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(EVENTS_KEY, JSON.stringify(list));
    }
  } catch {
    // Ignore storage issues in private browsing or server rendering
  }
}

export function getEvents(): AnalyticsEvent[] {
  try {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem(EVENTS_KEY) : null;
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
