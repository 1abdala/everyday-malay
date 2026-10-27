import type { CardProgress, ProgressMap, FailedAnswer, UserSettings } from '../types';

const PROGRESS_KEY = 'em.progress.v1';
const FAILED_KEY = 'em.failed.v1';
const EVENTS_KEY = 'em.events.v1';
const SETTINGS_KEY = 'em.settings.v1';
const REWARD_META_KEY = '__em_rewards_v1';

export const SCENARIO_COMPLETION_XP = 10;

type RewardLedger = {
  version: 1;
  totalXp: number;
  completionRewardIds: string[];
};

type ProgressSnapshot = {
  progress: ProgressMap;
  rewards: RewardLedger | null;
};

const EMPTY_REWARD_LEDGER: RewardLedger = { version: 1, totalXp: 0, completionRewardIds: [] };

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

function readProgressSnapshot(): ProgressSnapshot {
  try {
    const raw = safeGetItem(PROGRESS_KEY);
    if (!raw) return { progress: {}, rewards: null };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return { progress: {}, rewards: null };

    const progress: ProgressMap = {};
    Object.entries(parsed as Record<string, unknown>).forEach(([id, value]) => {
      if (id !== REWARD_META_KEY && value && typeof value === 'object' && !Array.isArray(value)) {
        progress[id] = value as CardProgress;
      }
    });

    const rawRewards = (parsed as Record<string, unknown>)[REWARD_META_KEY] as Partial<RewardLedger> | undefined;
    const rewards = rawRewards && rawRewards.version === 1
      ? {
          version: 1 as const,
          totalXp: Number.isFinite(rawRewards.totalXp) ? Math.max(0, Number(rawRewards.totalXp)) : 0,
          completionRewardIds: Array.isArray(rawRewards.completionRewardIds)
            ? rawRewards.completionRewardIds.filter((id): id is string => typeof id === 'string')
            : []
        }
      : null;

    return { progress, rewards };
  } catch {
    return { progress: {}, rewards: null };
  }
}

function writeProgressSnapshot(progress: ProgressMap, rewards: RewardLedger | null): void {
  const stored: Record<string, unknown> = { ...progress };
  if (rewards) stored[REWARD_META_KEY] = rewards;
  safeSetItem(PROGRESS_KEY, JSON.stringify(stored));
}

export function loadProgress(): ProgressMap {
  return readProgressSnapshot().progress;
}

export function loadRewardProgress(): Pick<RewardLedger, 'totalXp' | 'completionRewardIds'> {
  const rewards = readProgressSnapshot().rewards ?? EMPTY_REWARD_LEDGER;
  return { totalXp: rewards.totalXp, completionRewardIds: [...rewards.completionRewardIds] };
}

export function saveCardProgress(cardId: string, update: Partial<CardProgress>): CardProgress {
  const snapshot = readProgressSnapshot();
  const current = snapshot.progress;
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
  writeProgressSnapshot(current, snapshot.rewards);

  return updated;
}

export type ScenarioCompletionCommit = {
  progress: CardProgress;
  xpAwarded: number;
  totalXp: number;
  firstCompletion: boolean;
};

/** Complete a role-play and claim its first-completion reward in one localStorage write. */
export function completeScenario(
  cardId: string,
  update: Partial<CardProgress>,
  rewardXp: number = SCENARIO_COMPLETION_XP
): ScenarioCompletionCommit {
  const snapshot = readProgressSnapshot();
  const existing = snapshot.progress[cardId] || {
    started: false,
    finished: false,
    lastStepIndex: 0,
    attempts: 0,
    updatedAt: Date.now()
  };
  const rewards = snapshot.rewards ?? { ...EMPTY_REWARD_LEDGER, completionRewardIds: [] };
  const alreadyClaimed = rewards.completionRewardIds.includes(cardId);
  const firstCompletion = !existing.finished;
  const xpAwarded = firstCompletion && !alreadyClaimed ? Math.max(0, Math.floor(rewardXp)) : 0;
  const updated: CardProgress = {
    ...existing,
    ...update,
    started: true,
    finished: true,
    updatedAt: Date.now()
  };

  snapshot.progress[cardId] = updated;
  const nextRewards: RewardLedger = {
    version: 1,
    totalXp: rewards.totalXp + xpAwarded,
    completionRewardIds: xpAwarded > 0 && !alreadyClaimed
      ? [...rewards.completionRewardIds, cardId]
      : rewards.completionRewardIds
  };

  // Completion, result data, XP balance, and claim ID share the same storage transaction.
  writeProgressSnapshot(snapshot.progress, nextRewards);

  return { progress: updated, xpAwarded, totalXp: nextRewards.totalXp, firstCompletion };
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
