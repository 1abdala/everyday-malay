// @vitest-environment jsdom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Card } from '../types';
import { SurvivalMalay } from './SurvivalMalay';

const cards = [
  { id: 'shop-01', phrases: [{ id: 'shop-phrase-1', ms: 'Ada plastik tak?', en: 'Do you have a plastic bag?' }, { id: 'shop-phrase-2', ms: 'Nak resit.', en: 'I would like a receipt.' }], dialogue: [{ id: 'shop-line-1', who: 'npc', ms: 'Terima kasih.', en: 'Thank you.' }] },
  { id: 'mamak-01', phrases: [{ id: 'mamak-phrase-1', ms: 'Itu saja.', en: 'That is all.' }, { id: 'mamak-phrase-2', ms: 'Tu je.', en: 'That is all.' }], dialogue: [] },
  { id: 'grab-01', phrases: [{ id: 'grab-phrase-1', ms: 'Ikut GPS je.', en: 'Just follow the GPS.' }], dialogue: [{ id: 'grab-line-1', who: 'npc', ms: 'Hi. Nak pergi KLCC, ya?', en: 'Hi. Going to KLCC?' }] }
] as unknown as Card[];

describe('Survival Malay starter module', () => {
  let root: Root | undefined; let host: HTMLDivElement | undefined;
  beforeEach(() => { Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true }); });
  afterEach(() => { if (root) act(() => root?.unmount()); host?.remove(); root = undefined; host = undefined; });

  it('completes listening recognition, word-block construction, and a guided response', () => {
    host = document.createElement('div'); document.body.append(host); root = createRoot(host);
    const onFinish = vi.fn();
    act(() => root?.render(<SurvivalMalay cards={cards} onFinish={onFinish} onSkip={vi.fn()} />));
    const clickText = (text: string) => act(() => [...host!.querySelectorAll('button')].find((button) => button.textContent?.trim() === text)?.click());
    clickText('Start the quick checks →');
    clickText('Thank you.'); clickText('Continue →');
    clickText('Itu'); clickText('saja'); clickText('Continue →');
    clickText('Nak resit.'); clickText('Finish starter →');
    expect(host.textContent).toContain('Ready to explore real situations');
    clickText('Go to the learning Path →');
    expect(onFinish).toHaveBeenCalledOnce();
  });
});
