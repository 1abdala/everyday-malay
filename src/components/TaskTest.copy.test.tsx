// @vitest-environment jsdom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import shop from '../../content/cards/shop-01.json';
import mamak from '../../content/cards/mamak-01.json';
import grab from '../../content/cards/grab-01.json';
import type { Card } from '../types';
import { TaskTest } from './TaskTest';

vi.mock('../lib/storage', () => ({ logFailedAnswer: vi.fn() }));
vi.mock('../lib/track', () => ({ track: vi.fn() }));
vi.mock('../lib/audio', () => ({ playAudio: vi.fn() }));

let root: Root;
let container: HTMLDivElement;

const feedbackCard: Card = {
  ...(shop as Card),
  task: {
    goal: 'Complete this practice turn.',
    turns: [{ type: 'prompt', en: 'Say hello.', accept: ['hello'], model: 'Hello.', hint: 'Greet the person.' }]
  }
};

function setInputValue(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

async function renderTask() {
  await act(async () => {
    root.render(<TaskTest card={feedbackCard} isActive onComplete={vi.fn()} />);
  });
}

async function answer(value: string) {
  let input = container.querySelector<HTMLInputElement>('[aria-label="Your response in Malay"]');
  if (!input) {
    const typeButton = [...container.querySelectorAll('button')].find((button) => button.textContent?.includes('Type'));
    await act(async () => typeButton?.click());
    input = container.querySelector<HTMLInputElement>('[aria-label="Your response in Malay"]');
  }
  if (!input) throw new Error('Task response input was not rendered');
  await act(async () => setInputValue(input, value));
  const checkButton = [...container.querySelectorAll('button')].find((button) => button.textContent?.includes('Check answer'));
  if (!checkButton) throw new Error('Check answer button was not rendered');
  await act(async () => checkButton.click());
}

describe('Priority 1 task copy', () => {
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

  it('keeps task goals and hints aligned with the current role-play checks', () => {
    expect(shop.scene).toMatch(/want to buy bottled water/i);
    expect(mamak.task.goal).toContain('choose dine-in or takeaway');
    expect(mamak.task.goal).toContain('confirm that\'s all');
    expect(mamak.task.goal).toContain('ask for the bill after eating');
    const mamakDrink = mamak.task.turns.find((turn) => turn.model === 'Teh tarik satu.');
    const mamakFood = mamak.task.turns.find((turn) => turn.model === 'Roti canai dua.');
    expect(mamakDrink?.hint).toBe('Name the drink.');
    expect(mamakFood?.hint).toBe('Name the food.');
    expect(grab.task.goal).toContain('tell the driver to follow the GPS');
    expect(grab.task.goal).toContain('ask to get off here');
    expect(grab.chips.find((chip) => chip.spoken === 'depan sikit')?.note).toContain('differs from asking to get off here');
    expect(shop.review.status).toBe('draft');
    expect(mamak.review.status).toBe('draft');
    expect(grab.review.status).toBe('draft');
  });

  it('opens with the word blocks visible and explains how to switch to recall practice', async () => {
    await renderTask();
    expect(container.textContent).toContain('Start by arranging the word blocks');
    expect(container.querySelector('[aria-label="Available word tiles"]')).toBeTruthy();
    expect(container.querySelector('[aria-label="Your response in Malay"]')).toBeNull();
  });

  it('uses neutral wording for assisted and suggested-answer feedback', async () => {
    await renderTask();
    await answer('hello');
    expect(container.textContent).toContain('One suggested answer:');
    expect(container.textContent).not.toContain('Model answer:');

    await act(async () => root.unmount());
    root = createRoot(container);
    await act(async () => {
      root.render(<TaskTest card={feedbackCard} isActive={false} onComplete={vi.fn()} />);
    });
    await answer('wrong');
    await answer('still wrong');
    expect(container.textContent).toContain('Suggested response:');
    expect(container.textContent).not.toContain('Here is how locals say it:');
  });

  it('restores the active role-play turn and typed draft after remounting', async () => {
    const twoTurnCard: Card = {
      ...feedbackCard,
      task: {
        goal: 'Complete two turns.',
        turns: [
          { type: 'prompt', en: 'First prompt.', accept: ['first'], model: 'First.', hint: 'Say first.' },
          { type: 'prompt', en: 'Second prompt.', accept: ['second'], model: 'Second.', hint: 'Say second.' }
        ]
      }
    };
    const drafts: import('../types').TaskDraftProgress[] = [];
    const onDraftChange = (draft: import('../types').TaskDraftProgress) => drafts.push(draft);

    await act(async () => root.render(<TaskTest card={twoTurnCard} isActive onComplete={vi.fn()} onDraftChange={onDraftChange} />));
    await answer('first');
    const nextButton = [...container.querySelectorAll('button')].find((button) => button.textContent?.includes('Next turn'));
    expect(nextButton).toBeTruthy();
    await act(async () => nextButton?.click());
    const input = container.querySelector<HTMLInputElement>('[aria-label="Your response in Malay"]');
    expect(input).toBeTruthy();
    await act(async () => setInputValue(input!, 'partly typed'));
    const savedDraft = drafts.at(-1);
    expect(savedDraft?.turnIndex).toBe(1);
    expect(savedDraft?.firstTryCount).toBe(1);
    expect(savedDraft?.typedInput).toBe('partly typed');

    await act(async () => root.unmount());
    root = createRoot(container);
    await act(async () => root.render(<TaskTest card={twoTurnCard} isActive onComplete={vi.fn()} initialDraft={savedDraft} onDraftChange={onDraftChange} />));
    expect(container.textContent).toContain('Turn 2 of 2');
    expect(container.querySelector<HTMLInputElement>('[aria-label="Your response in Malay"]')?.value).toBe('partly typed');
    expect(drafts.at(-1)?.firstTryCount).toBe(1);
  });
});
