// @vitest-environment jsdom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ResultStep } from './ResultStep';

let root: Root;
let container: HTMLDivElement;

describe('Results navigation actions', () => {
  beforeEach(() => {
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
  });

  it('separates resuming an unfinished role-play from restarting a completed scenario', async () => {
    const onResumeTask = vi.fn();
    const onRestartScenario = vi.fn();
    const common = {
      scenarioTitle: 'At the shop counter',
      taskGoal: 'Buy bottled water.',
      xpAwarded: 0,
      totalXp: 10,
      onResumeTask,
      onRestartScenario,
      onContinuePath: vi.fn(),
      onBackToDeck: vi.fn(),
      returnToBrowseLabel: 'Back to Path'
    };

    await act(async () => root.render(<ResultStep {...common} result={null} />));
    const resume = [...container.querySelectorAll('button')].find((button) => button.textContent?.includes('Resume role-play'));
    await act(async () => resume?.click());
    expect(onResumeTask).toHaveBeenCalledOnce();
    expect(onRestartScenario).not.toHaveBeenCalled();

    await act(async () => root.render(<ResultStep {...common} result={{ turns: 1, firstTry: 1, withHint: 0, assisted: 0, attempts: 1, phrasesToRevisit: [] }} />));
    expect(container.textContent).toContain('COMPLETED PRACTICE');
    expect(container.textContent).toContain('does not measure how well you speak Malay');
    const restart = [...container.querySelectorAll('button')].find((button) => button.textContent?.includes('Restart from scene'));
    await act(async () => restart?.click());
    expect(onRestartScenario).toHaveBeenCalledOnce();
  });
});
