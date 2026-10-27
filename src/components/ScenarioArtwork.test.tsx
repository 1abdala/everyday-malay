// @vitest-environment jsdom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Card } from '../types';
import { ScenarioArtwork } from './ScenarioArtwork';
import { CardScreen } from '../screens/Card';

vi.mock('../lib/audio', () => ({
  precacheCardAudio: vi.fn(),
  stopAudio: vi.fn()
}));

vi.mock('../lib/storage', () => ({
  completeScenario: vi.fn(),
  loadRewardProgress: vi.fn(() => ({ totalXp: 0 })),
  saveCardProgress: vi.fn()
}));

vi.mock('../lib/track', () => ({ track: vi.fn() }));

vi.mock('./TaskTest', () => ({ TaskTest: () => null }));
vi.mock('./ResultStep', () => ({ ResultStep: () => null }));

const shopCard = { id: 'shop-01', icon: '🏪' } as Card;
const shopLesson = {
  id: 'shop-01',
  title: 'At the shop counter',
  scene: 'You are at a local shop.',
  icon: '🏪',
  minutes: 5,
  variety: 'Colloquial Malay',
  review: { status: 'draft' },
  dialogue: [],
  chips: [],
  phrases: [],
  task: { goal: 'Complete the shop purchase.', turns: [] }
} as Card;
const mediaPlay = vi.fn<() => Promise<void>>();
const mediaPause = vi.fn();
let root: Root;
let container: HTMLDivElement;
let originalPlay: PropertyDescriptor | undefined;
let originalPause: PropertyDescriptor | undefined;

function setReducedMotion(matches: boolean) {
  const addEventListener = vi.fn();
  const removeEventListener = vi.fn();
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn((media: string) => ({
      matches,
      media,
      onchange: null,
      addEventListener,
      removeEventListener,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))
  });
  return { addEventListener, removeEventListener };
}

async function renderArtwork() {
  await act(async () => {
    root.render(<ScenarioArtwork card={shopCard} variant="intro" />);
  });
}

describe('ScenarioArtwork video fallbacks', () => {
  beforeEach(() => {
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);

    mediaPlay.mockReset().mockResolvedValue(undefined);
    mediaPause.mockReset();
    originalPlay = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'play');
    originalPause = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'pause');
    Object.defineProperty(HTMLMediaElement.prototype, 'play', { configurable: true, value: mediaPlay });
    Object.defineProperty(HTMLMediaElement.prototype, 'pause', { configurable: true, value: mediaPause });
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
    if (originalPlay) Object.defineProperty(HTMLMediaElement.prototype, 'play', originalPlay);
    else delete (HTMLMediaElement.prototype as Partial<HTMLMediaElement>).play;
    if (originalPause) Object.defineProperty(HTMLMediaElement.prototype, 'pause', originalPause);
    else delete (HTMLMediaElement.prototype as Partial<HTMLMediaElement>).pause;
    vi.restoreAllMocks();
  });

  it('renders static scenario artwork and never starts video when reduced motion is preferred', async () => {
    setReducedMotion(true);

    await renderArtwork();

    expect(container.querySelector('.scene-hero-art')).not.toBeNull();
    expect(container.querySelector('img')?.getAttribute('src')).toBe(`${import.meta.env.BASE_URL}images/shop-checkout.png`);
    expect(container.querySelector('video')).toBeNull();
    expect(mediaPlay).not.toHaveBeenCalled();
  });

  it('replaces a failed video with the static artwork while keeping the intro panel wrapper', async () => {
    setReducedMotion(false);

    await renderArtwork();

    const video = container.querySelector('video');
    expect(video).not.toBeNull();
    expect(video?.getAttribute('src')).toBe(`${import.meta.env.BASE_URL}videos/storecheckput.mp4`);
    expect(video?.muted).toBe(true);
    expect(video?.loop).toBe(true);
    expect(mediaPlay).toHaveBeenCalledTimes(1);

    await act(async () => {
      video!.dispatchEvent(new Event('error'));
    });

    expect(container.querySelector('video')).toBeNull();
    expect(container.querySelector('img')?.getAttribute('src')).toBe(`${import.meta.env.BASE_URL}images/shop-checkout.png`);
    expect(container.querySelector('.scene-hero-art')?.className).toBe('scene-hero-art scene-hero-art-shop');
  });

  it('keeps the lesson footer usable after a video failure', async () => {
    setReducedMotion(false);

    await act(async () => {
      root.render(
        <CardScreen
          card={shopLesson}
          progress={{}}
          settings={{ defaultSpeed: 'normal', showEnglishDefault: true }}
          onBackToDeck={vi.fn()}
          onContinuePath={vi.fn()}
          returnToBrowseLabel="Back to Path"
          onProgressUpdated={vi.fn()}
        />
      );
    });

    const video = container.querySelector('video');
    expect(video).not.toBeNull();
    await act(async () => {
      video!.dispatchEvent(new Event('error'));
    });

    expect(container.querySelector('.scene-hero-art img')?.getAttribute('src')).toBe(`${import.meta.env.BASE_URL}images/shop-checkout.png`);
    expect(container.querySelector('.card-flow-footer .lesson-continue')?.textContent).toContain('Start Dialogue');

    await act(async () => {
      container.querySelector<HTMLButtonElement>('.card-flow-footer .lesson-continue')!.click();
    });

    expect(container.querySelector('[aria-label="Step 2 of 6: Listen"]')?.hasAttribute('hidden')).toBe(false);
    expect(container.querySelector('.lesson-step-name')?.textContent).toBe('Listen');
  });
});
