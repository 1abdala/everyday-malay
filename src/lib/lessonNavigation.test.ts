import { describe, expect, it } from 'vitest';
import { getAdjacentLessonStep, LESSON_STEP_COUNT, normalizeLessonStep } from './lessonNavigation';

describe('lesson step navigation', () => {
  it('moves back and forward by exactly one step', () => {
    expect(getAdjacentLessonStep(0, 1)).toBe(1);
    expect(getAdjacentLessonStep(3, 1)).toBe(4);
    expect(getAdjacentLessonStep(4, -1)).toBe(3);
  });

  it('does not move beyond the first or final step', () => {
    expect(getAdjacentLessonStep(0, -1)).toBeNull();
    expect(getAdjacentLessonStep(LESSON_STEP_COUNT - 1, 1)).toBeNull();
  });

  it('restores only valid saved step indices', () => {
    expect(normalizeLessonStep(4)).toBe(4);
    expect(normalizeLessonStep(0)).toBe(0);
    expect(normalizeLessonStep(6)).toBe(0);
    expect(normalizeLessonStep(-1)).toBe(0);
    expect(normalizeLessonStep('4')).toBe(0);
    expect(normalizeLessonStep(undefined)).toBe(0);
  });
});
