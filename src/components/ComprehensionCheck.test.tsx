// @vitest-environment jsdom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ComprehensionCheck } from './ComprehensionCheck';

const questions = [{
  id: 'q-1', prompt: 'What does the customer need?',
  choices: [{ id: 'a', text: 'Bottled water' }, { id: 'b', text: 'A ride' }],
  correctChoiceId: 'a', explanation: 'The customer asks for mineral water.', reviewStatus: 'draft' as const
}];

describe('ComprehensionCheck', () => {
  let root: Root | undefined;
  let host: HTMLDivElement | undefined;
  beforeEach(() => { Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true }); });
  afterEach(() => { if (root) act(() => root?.unmount()); host?.remove(); root = undefined; host = undefined; });

  it('gives immediate retryable feedback, records outcomes, and completes on a correct answer', () => {
    host = document.createElement('div'); document.body.append(host); root = createRoot(host);
    const onResult = vi.fn();
    act(() => root?.render(<ComprehensionCheck questions={questions} onResult={onResult} />));
    expect(host!.textContent).toContain('Audio is not available for this check yet');
    const buttons = host!.querySelectorAll('button.comprehension-choice');
    act(() => (buttons[1] as HTMLButtonElement).click());
    expect(host!.textContent).toContain('Not quite');
    expect(onResult).toHaveBeenLastCalledWith('q-1', false);
    act(() => (host!.querySelector('.comprehension-next') as HTMLButtonElement).click());
    act(() => (host!.querySelectorAll('button.comprehension-choice')[0] as HTMLButtonElement).click());
    expect(onResult).toHaveBeenLastCalledWith('q-1', true);
    act(() => (host!.querySelector('.comprehension-next') as HTMLButtonElement).click());
    expect(host!.textContent).toContain('Understanding check complete');
  });
});
