import { describe, expect, it } from 'vitest';
import type { Card, ProgressMap } from '../types';
import { getPathProgress, getScenarioDisplayStatus, getScenarioNumber, orderStarterScenarios } from './learningPath';

const card = (id: string) => ({ id } as Card);

describe('starter learning path', () => {
  it('orders current scenarios from shop to mamak to Grab', () => {
    const ordered = orderStarterScenarios([card('grab-01'), card('mamak-01'), card('shop-01')]);
    expect(ordered.map(({ id }) => id)).toEqual(['shop-01', 'mamak-01', 'grab-01']);
    expect(ordered.map(({ id }) => getScenarioNumber(ordered, id))).toEqual([1, 2, 3]);
    expect(getScenarioNumber(ordered, 'unknown')).toBeUndefined();
  });

  it('recommends the first scenario for a fresh learner', () => {
    const result = getPathProgress([card('shop-01'), card('mamak-01')], {});
    expect(result.recommendedCard?.id).toBe('shop-01');
    expect(result.completedCount).toBe(0);
    expect(result.isChapterScenarioComplete).toBe(false);
  });

  it('resumes the most recently active unfinished scenario', () => {
    const progress: ProgressMap = {
      'shop-01': { started: true, finished: false, lastStepIndex: 1, attempts: 0, updatedAt: 10 },
      'mamak-01': { started: true, finished: false, lastStepIndex: 3, attempts: 0, updatedAt: 20 }
    };
    expect(getPathProgress([card('shop-01'), card('mamak-01')], progress).recommendedCard?.id).toBe('mamak-01');
  });

  it('advances past completed scenarios without inferring mastery', () => {
    const progress: ProgressMap = {
      'shop-01': { started: true, finished: true, lastStepIndex: 5, attempts: 1, updatedAt: 10 }
    };
    expect(getPathProgress([card('shop-01'), card('mamak-01')], progress).recommendedCard?.id).toBe('mamak-01');
  });

  it('has no recommended scenario once all chapter scenarios are completed', () => {
    const progress: ProgressMap = {
      'shop-01': { started: true, finished: true, lastStepIndex: 5, attempts: 1, updatedAt: 10 },
      'mamak-01': { started: true, finished: true, lastStepIndex: 5, attempts: 1, updatedAt: 20 }
    };
    const result = getPathProgress([card('shop-01'), card('mamak-01')], progress);
    expect(result.recommendedCard).toBeUndefined();
    expect(result.isChapterScenarioComplete).toBe(true);
  });

  it('uses distinct completed, in-progress, next, and ready labels without adding states', () => {
    const progress: ProgressMap = {
      'shop-01': { started: true, finished: true, lastStepIndex: 5, attempts: 1, updatedAt: 10 },
      'mamak-01': { started: true, finished: false, lastStepIndex: 2, attempts: 0, updatedAt: 20 }
    };
    expect(getScenarioDisplayStatus(progress, 'shop-01', false)).toBe('completed');
    expect(getScenarioDisplayStatus(progress, 'mamak-01', true)).toBe('in-progress');
    expect(getScenarioDisplayStatus(progress, 'grab-01', true)).toBe('up-next');
    expect(getScenarioDisplayStatus(progress, 'grab-01', false)).toBe('ready');
  });
});
