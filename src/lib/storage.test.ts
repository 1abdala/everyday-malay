import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ProgressMap } from '../types';
import { clearAllData, completeOnboarding, completeScenario, completeSurvival, exportLocalData, hasCompletedOnboarding, hasCompletedSurvival, isPersistentStorageAvailable, loadProgress, loadRewardProgress, loadSavedPhrases, loadSettings, logFailedAnswer, removeSavedPhrase, saveCardProgress, savePhraseForReview, saveSettings } from './storage';
import { getPathProgress } from './learningPath';

const PROGRESS_KEY = 'em.progress.v2';
const LEGACY_PROGRESS_KEY = 'em.progress.v1';
const REWARD_META_KEY = '__em_rewards_v1';
const values = new Map<string, string>();
const localStorageMock = {
  getItem: (key: string) => values.get(key) ?? null,
  setItem: (key: string, value: string) => { values.set(key, String(value)); },
  removeItem: (key: string) => { values.delete(key); }
};

const taskResult = {
  turns: 3,
  firstTry: 1,
  withHint: 1,
  assisted: 1,
  attempts: 4,
  phrasesToRevisit: ['Boleh minta resit?']
};

describe('scenario completion and XP persistence', () => {
  beforeEach(() => {
    values.clear();
    vi.stubGlobal('window', { localStorage: localStorageMock });
  });

  afterEach(() => vi.unstubAllGlobals());

  it('completes a fresh scenario and awards the configured reward once', () => {
    const result = completeScenario('shop-01', { bestTask: taskResult, attempts: 1, lastStepIndex: 5 });
    expect(result.progress.finished).toBe(true);
    expect(result.xpAwarded).toBe(10);
    expect(result.totalXp).toBe(10);
    expect(loadRewardProgress().completionRewardIds).toEqual(['shop-01']);
  });

  it('does not award XP again when Results is reopened or the completion event repeats', () => {
    completeScenario('shop-01', { bestTask: taskResult, attempts: 1 });
    expect(completeScenario('shop-01', { bestTask: taskResult, attempts: 2 }).xpAwarded).toBe(0);
    expect(loadRewardProgress().totalXp).toBe(10);
  });

  it('preserves XP and completion after reloading from the stored snapshot', () => {
    completeScenario('shop-01', { bestTask: taskResult, attempts: 1, lastStepIndex: 5 });
    const refreshedProgress = loadProgress();
    const refreshedRewards = loadRewardProgress();
    expect(refreshedProgress['shop-01'].finished).toBe(true);
    expect(refreshedProgress['shop-01'].bestTask?.phrasesToRevisit).toEqual(taskResult.phrasesToRevisit);
    expect(refreshedRewards.totalXp).toBe(10);
  });

  it('does not duplicate first-completion XP on a retry of a completed scenario', () => {
    completeScenario('shop-01', { bestTask: taskResult, attempts: 1 });
    const retry = completeScenario('shop-01', { bestTask: { ...taskResult, firstTry: 3 }, attempts: 2 });
    expect(retry.xpAwarded).toBe(0);
    expect(retry.progress.attempts).toBe(2);
    expect(loadRewardProgress().totalXp).toBe(10);
  });

  it('completes and rewards a task even when hints or assistance were used', () => {
    const result = completeScenario('mamak-01', { bestTask: taskResult, attempts: 1 });
    expect(result.progress.finished).toBe(true);
    expect(result.progress.bestTask?.withHint).toBe(1);
    expect(result.progress.bestTask?.assisted).toBe(1);
    expect(result.xpAwarded).toBe(10);
  });

  it('does not award XP for starting without finishing the task', () => {
    saveCardProgress('grab-01', { started: true, lastStepIndex: 4 });
    expect(loadProgress()['grab-01'].finished).toBe(false);
    expect(loadRewardProgress().totalXp).toBe(0);
  });

  it('keeps legacy em.progress.v1 records readable and grants no historical XP', () => {
    const legacy: ProgressMap = {
      'mamak-01': { started: true, finished: true, lastStepIndex: 5, attempts: 1, updatedAt: 100, bestTask: { turns: 3, firstTry: 2, withHint: 1, assisted: 0 } },
      'grab-01': { started: true, finished: false, lastStepIndex: 2, attempts: 0, updatedAt: 200 }
    };
    values.set(LEGACY_PROGRESS_KEY, JSON.stringify(legacy));
    expect(loadProgress()).toEqual(legacy);
    expect(loadRewardProgress().totalXp).toBe(0);
    expect(values.get(PROGRESS_KEY)).toBe(values.get(LEGACY_PROGRESS_KEY));
    saveCardProgress('grab-01', { lastStepIndex: 3 });
    const saved = JSON.parse(values.get(PROGRESS_KEY)!);
    expect(saved['mamak-01']).toEqual(legacy['mamak-01']);
    expect(saved['grab-01'].lastStepIndex).toBe(3);
    expect(JSON.parse(values.get(LEGACY_PROGRESS_KEY)!)['grab-01'].lastStepIndex).toBe(2);
  });

  it('round-trips an unfinished role-play draft within the existing progress record', () => {
    const taskDraft = {
      turnIndex: 2,
      inputMode: 'type' as const,
      typedInput: 'Turun sini',
      selectedWordTiles: [],
      turnState: { status: 'hint' as const, attempts: 1, nearMiss: true },
      firstTryCount: 1,
      withHintCount: 0,
      assistedCount: 0,
      totalAttempts: 2,
      phrasesToRevisit: ['Ikut GPS je.'],
      isConcluding: false,
      assistedReconstructed: false
    };
    saveCardProgress('grab-01', { started: true, lastStepIndex: 4, taskDraft });

    expect(loadProgress()['grab-01'].taskDraft).toEqual(taskDraft);
    const snapshot = JSON.parse(values.get(PROGRESS_KEY)!);
    expect(Object.keys(snapshot)).toContain('grab-01');
    expect(snapshot['grab-01'].taskDraft.typedInput).toBe('Turun sini');
  });

  it('exports distinct local data categories and clears onboarding with an explicit reset', () => {
    completeOnboarding();
    completeSurvival();
    saveCardProgress('shop-01', { started: true, lastStepIndex: 2 });
    logFailedAnswer('shop-01', 1, 'wrong answer');
    saveSettings({ defaultSpeed: 'slow', showEnglishDefault: false });
    savePhraseForReview({ id: 'shop-01-phrase-01', scenarioId: 'shop-01', malay: 'Maaf, ada air mineral tak?', english: 'Excuse me, do you have bottled water?' });

    const exported = exportLocalData();
    expect(exported.schemaVersion).toBe(2);
    expect(exported.progress['shop-01'].lastStepIndex).toBe(2);
    expect(exported.failedAnswers).toHaveLength(1);
    expect(exported.settings.defaultSpeed).toBe('slow');
    expect(exported.onboardingCompleted).toBe(true);
    expect(exported.survivalCompleted).toBe(true);
    expect(exported.savedPhrases).toHaveLength(1);

    removeSavedPhrase('shop-01-phrase-01');
    expect(loadSavedPhrases()).toEqual([]);

    clearAllData();
    expect(hasCompletedOnboarding()).toBe(false);
    expect(hasCompletedSurvival()).toBe(false);
    expect(loadProgress()).toEqual({});
    expect(values.has(LEGACY_PROGRESS_KEY)).toBe(false);
  });

  it('starts new learners with translations hidden by default', () => {
    expect(loadSettings().showEnglishDefault).toBe(false);
  });

  it('detects unavailable persistent storage so the UI can warn that saves may be temporary', () => {
    vi.stubGlobal('window', { localStorage: { setItem: () => { throw new Error('quota'); }, getItem: () => null, removeItem: () => { throw new Error('quota'); } } });
    expect(isPersistentStorageAvailable()).toBe(false);
  });

  it('awards each stable scenario ID its own one-time reward', () => {
    completeScenario('shop-01', { bestTask: taskResult });
    completeScenario('grab-01', { bestTask: taskResult });
    expect(loadRewardProgress().totalXp).toBe(20);
    expect(loadRewardProgress().completionRewardIds).toEqual(['shop-01', 'grab-01']);
  });

  it('makes Path completion indicators reflect persisted completion', () => {
    completeScenario('shop-01', { bestTask: taskResult });
    const path = getPathProgress([{ id: 'shop-01' } as never, { id: 'mamak-01' } as never], loadProgress());
    expect(path.completedCount).toBe(1);
    expect(path.recommendedCard?.id).toBe('mamak-01');
  });

  it('writes completion and reward claims together so interrupted repeats stay idempotent', () => {
    let writes = 0;
    const countedStorage = { ...localStorageMock, setItem: (key: string, value: string) => { writes += 1; values.set(key, String(value)); } };
    vi.stubGlobal('window', { localStorage: countedStorage });
    completeScenario('shop-01', { bestTask: taskResult, attempts: 1, lastStepIndex: 5 });
    const snapshot = JSON.parse(values.get(PROGRESS_KEY)!);
    expect(writes).toBe(1);
    expect(snapshot['shop-01'].finished).toBe(true);
    expect(snapshot[REWARD_META_KEY].completionRewardIds).toContain('shop-01');
    expect(completeScenario('shop-01', { bestTask: taskResult, attempts: 2 }).xpAwarded).toBe(0);
  });
});
