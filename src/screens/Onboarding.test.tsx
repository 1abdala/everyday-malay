// @vitest-environment jsdom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { OnboardingScreen } from './Onboarding';

let root: Root;
let container: HTMLDivElement;

describe('first-session orientation', () => {
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

  it('starts the starter module after orientation', async () => {
    const onStart = vi.fn();
    const onSkip = vi.fn();
    await act(async () => root.render(<OnboardingScreen onStart={onStart} onSkip={onSkip} />));
    expect(container.textContent).toContain('Your progress is stored locally in this browser');
    const button = [...container.querySelectorAll('button')].find((item) => item.textContent?.includes('Start learning'));
    await act(async () => button?.click());
    expect(onStart).toHaveBeenCalledOnce();
  });

  it('lets the learner skip orientation', async () => {
    const onStart = vi.fn(); const onSkip = vi.fn();
    await act(async () => root.render(<OnboardingScreen onStart={onStart} onSkip={onSkip} />));
    const button = [...container.querySelectorAll('button')].find((item) => item.textContent?.includes('Skip for now'));
    await act(async () => button?.click());
    expect(onSkip).toHaveBeenCalledOnce();
  });
});
