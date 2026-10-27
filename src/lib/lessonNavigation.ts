export const LESSON_STEP_COUNT = 6;

export function normalizeLessonStep(step: unknown, totalSteps = LESSON_STEP_COUNT): number {
  if (!Number.isInteger(step) || (step as number) < 0 || (step as number) >= totalSteps) return 0;
  return step as number;
}

/** Return only an adjacent step; invalid jumps and boundary moves are ignored. */
export function getAdjacentLessonStep(
  currentStep: number,
  direction: -1 | 1,
  totalSteps = LESSON_STEP_COUNT
): number | null {
  const nextStep = currentStep + direction;
  return nextStep < 0 || nextStep >= totalSteps ? null : nextStep;
}
