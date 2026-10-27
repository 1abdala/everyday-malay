import type { Card, ProgressMap } from '../types';

// The chapter order is based on the concrete task outcomes in the current draft lessons.
export const STARTER_SCENARIO_ORDER = ['shop-01', 'mamak-01', 'grab-01'] as const;

export const STARTER_CHAPTER = {
  number: 1,
  title: 'First Conversations',
  objective: 'Handle a simple shop visit, place a mamak order, and communicate the essentials of a Grab ride.'
} as const;

export const PLANNED_CHAPTERS = [
  'Choices & Requests',
  'Getting Around & Solving Problems',
  'Markets & Local Life',
  'Speak More Naturally'
] as const;

export function orderStarterScenarios(cards: Card[]): Card[] {
  const byId = new Map(cards.map((card) => [card.id, card]));
  const ordered = STARTER_SCENARIO_ORDER.flatMap((id) => {
    const card = byId.get(id);
    return card ? [card] : [];
  });
  const knownIds = new Set(STARTER_SCENARIO_ORDER);
  return [...ordered, ...cards.filter((card) => !knownIds.has(card.id as typeof STARTER_SCENARIO_ORDER[number]))];
}

export function getScenarioNumber(cards: Card[], cardId: string): number | undefined {
  const index = cards.findIndex((card) => card.id === cardId);
  return index < 0 ? undefined : index + 1;
}

export type ScenarioDisplayStatus = 'completed' | 'in-progress' | 'up-next' | 'ready';

export function getScenarioDisplayStatus(progress: ProgressMap, cardId: string, isRecommended: boolean): ScenarioDisplayStatus {
  const scenarioProgress = progress[cardId];
  if (scenarioProgress?.finished) return 'completed';
  if (scenarioProgress?.started) return 'in-progress';
  return isRecommended ? 'up-next' : 'ready';
}

export function getPathProgress(cards: Card[], progress: ProgressMap) {
  const completedCount = cards.filter((card) => progress[card.id]?.finished).length;
  const inProgress = cards
    .filter((card) => progress[card.id]?.started && !progress[card.id]?.finished)
    .sort((a, b) => (progress[b.id]?.updatedAt ?? 0) - (progress[a.id]?.updatedAt ?? 0))[0];
  const nextIncomplete = cards.find((card) => !progress[card.id]?.finished);

  return {
    completedCount,
    recommendedCard: inProgress ?? nextIncomplete,
    isChapterScenarioComplete: cards.length > 0 && completedCount === cards.length
  };
}
