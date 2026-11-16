// @vitest-environment jsdom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DialogueLine } from './DialogueLine';

describe('DialogueLine', () => {
  let root: Root | undefined;
  let host: HTMLDivElement | undefined;
  beforeEach(() => { Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true }); });
  afterEach(() => { if (root) act(() => root?.unmount()); host?.remove(); root = undefined; host = undefined; });

  it('reveals each line translation on request', () => {
    host = document.createElement('div'); document.body.append(host); root = createRoot(host);
    act(() => root?.render(<DialogueLine line={{ id: 'line-1', who: 'npc', ms: 'Terima kasih.', en: 'Thank you.' }} showEnglish={false} />));
    expect(host!.textContent).not.toContain('Thank you.');
    act(() => (host!.querySelector('button.dialogue-translation-toggle') as HTMLButtonElement).click());
    expect(host!.textContent).toContain('Thank you.');
  });

  it('marks Malay and English separately for consistent language styling', () => {
    host = document.createElement('div'); document.body.append(host); root = createRoot(host);
    act(() => root?.render(<DialogueLine line={{ id: 'line-1', who: 'npc', ms: 'Terima kasih.', en: 'Thank you.' }} showEnglish />));
    expect(host!.querySelector('.bubble-text-ms')?.getAttribute('lang')).toBe('ms');
    expect(host!.querySelector('.bubble-text-ms')?.classList.contains('malay-text')).toBe(true);
    expect(host!.querySelector('.bubble-text-en')?.getAttribute('lang')).toBe('en');
    expect(host!.querySelector('.bubble-text-en')?.classList.contains('english-text')).toBe(true);
  });
});
