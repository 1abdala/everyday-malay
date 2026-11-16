// @vitest-environment jsdom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { playAudio } from '../lib/audio';
import { AudioButtons } from './AudioButtons';

vi.mock('../lib/audio', () => ({ playAudio: vi.fn(), stopAudio: vi.fn() }));

let root: Root;
let container: HTMLDivElement;

describe('audio playback feedback', () => {
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

  it('shows a visible status when playback and speech fallback both fail', async () => {
    await act(async () => root.render(<AudioButtons textToSpeak="Selamat pagi" />));
    const button = container.querySelector('button');
    expect(button).toBeTruthy();
    await act(async () => button?.click());
    const options = vi.mocked(playAudio).mock.calls[0][0];
    await act(async () => options.onError?.(new Error('unavailable')));
    expect(container.querySelector('[role="status"]')?.textContent).toContain('Audio unavailable');
  });

  it('labels missing native recordings as interim device-generated audio', async () => {
    await act(async () => root.render(<AudioButtons textToSpeak="Selamat pagi" />));
    expect(container.textContent).toContain('device-generated audio');
    expect(container.textContent).toContain('not a native recording');
  });

  it('clearly labels planned manifest audio as unavailable natively while retaining device fallback', async () => {
    await act(async () => root.render(<AudioButtons audioId="shop-01-phrase-01" scenarioId="shop-01" textToSpeak="Ada plastik tak?" />));
    expect(container.textContent).toContain('Native recording planned');
    expect(container.textContent).toContain('device-generated audio');
  });

  it('shows a loading status while a native recording is starting', async () => {
    await act(async () => root.render(<AudioButtons normalSrc="/audio/test.mp3" textToSpeak="Terima kasih" />));
    await act(async () => container.querySelector('button')?.click());
    expect(container.textContent).toContain('Loading audio');
    const options = vi.mocked(playAudio).mock.calls.at(-1)![0];
    await act(async () => options.onStart?.(false));
    expect(container.textContent).not.toContain('Loading audio');
  });
});
