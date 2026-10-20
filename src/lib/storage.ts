import type { CardProgress, ProgressMap, FailedAnswer, UserSettings } from '../types';

const PROGRESS_KEY = 'em.progress.v1';
const FAILED_KEY = 'em.failed.v1';
const EVENTS_KEY = 'em.events.v1';
const SETTINGS_KEY = 'em.settings.v1';

// In-memory fallback if localStorage is disabled or throws
const memoryStore: Record<string, string> = {};

function safeGetItem(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch {
    // fallback
  }
  return memoryStore[key] ?? null;
}

function safeSetItem(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
      return;
    }
  } catch {
    // fallback
  }
  memoryStore[key] = value;
}

function safeRemoveItem(key: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  } catch {
    // fallback
  }
  delete memoryStore[key];
}

/* --- Progress --- */

export function loadProgress(): ProgressMap {
  try {
    const raw = safeGetItem(PROGRESS_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveCardProgress(cardId: string, update: Partial<CardProgress>): CardProgress {
  const current = loadProgress();
  const existing = current[cardId] || {
    started: false,
    finished: false,
    lastStepIndex: 0,
    attempts: 0,
    updatedAt: Date.now()
  };

  const updated: CardProgress = {
    ...existing,
    ...update,
    updatedAt: Date.now()
  };

  current[cardId] = updated;
  try {
    safeSetItem(PROGRESS_KEY, JSON.stringify(current));
  } catch {
    // ignore
  }

  return updated;
}

/* --- Failed Answers Log (cap 500) --- */

export function logFailedAnswer(cardId: string, turnIndex: number, input: string): void {
  try {
    const raw = safeGetItem(FAILED_KEY);
    const list: FailedAnswer[] = raw ? JSON.parse(raw) : [];
    list.push({
      cardId,
      turnIndex,
      input,
      ts: Date.now()
    });

    // Keep only most recent 500 entries
    if (list.length > 500) {
      list.splice(0, list.length - 500);
    }

    safeSetItem(FAILED_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

export function getFailedAnswers(): FailedAnswer[] {
  try {
    const raw = safeGetItem(FAILED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/* --- Settings --- */

const DEFAULT_SETTINGS: UserSettings = {
  defaultSpeed: 'normal',
  showEnglishDefault: true
};

export function loadSettings(): UserSettings {
  try {
    const raw = safeGetItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: UserSettings): void {
  try {
    safeSetItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

/* --- Clear Data --- */

export function clearAllData(): void {
  safeRemoveItem(PROGRESS_KEY);
  safeRemoveItem(FAILED_KEY);
  safeRemoveItem(EVENTS_KEY);
  safeRemoveItem(SETTINGS_KEY);
  Object.keys(memoryStore).forEach((k) => delete memoryStore[k]);
}

/* --- Copy Progress Summary --- */

export function generateProgressSummary(totalCards: number = 3): string {
  const progress = loadProgress();
  const cardIds = Object.keys(progress);
  const finishedCards = cardIds.filter((id) => progress[id]?.finished);

  // Calculate distinct active days from updatedAt timestamps
  const daysSet = new Set<string>();
  cardIds.forEach((id) => {
    const p = progress[id];
    if (p?.updatedAt) {
      daysSet.add(new Date(p.updatedAt).toISOString().slice(0, 10));
    }
  });
  const daysUsed = Math.max(1, daysSet.size);

  let details = '';
  if (progress['mamak-01']?.bestTask) {
    const b = progress['mamak-01'].bestTask;
    details = ` | mamak-01: task complete (${b.firstTry} first try, ${b.withHint} hint)`;
  } else if (finishedCards.length > 0) {
    const firstFinished = finishedCards[0];
    const b = progress[firstFinished]?.bestTask;
    if (b) {
      details = ` | ${firstFinished}: task complete (${b.firstTry} first try, ${b.withHint} hint)`;
    }
  }

  return `Everyday Malay | cards finished: ${finishedCards.length}/${totalCards}${details} | days used: ${daysUsed}`;
}
