import { afterEach, describe, expect, it, vi } from 'vitest';
import { playAudio } from './audio';

describe('audio fallback failure feedback', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('reports when neither a recording nor browser speech synthesis is available', () => {
    const onError = vi.fn();
    vi.stubGlobal('window', {});
    vi.stubGlobal('SpeechSynthesisUtterance', undefined);

    playAudio({ fallbackText: 'Selamat pagi', onError });

    expect(onError).toHaveBeenCalledOnce();
    expect(onError.mock.calls[0][0]).toBeInstanceOf(Error);
  });

  it('does not silently use a non-Malay browser voice', () => {
    const onError = vi.fn();
    const speak = vi.fn();
    vi.stubGlobal('window', { speechSynthesis: { cancel: vi.fn(), getVoices: () => [{ lang: 'en-US' }], speak } });
    vi.stubGlobal('SpeechSynthesisUtterance', class { lang = ''; rate = 1; voice?: unknown; onstart = null; onend = null; onerror = null; constructor(public text: string) { void text; } });
    playAudio({ fallbackText: 'Terima kasih', onError });
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ message: 'No Malay device voice is available.' }));
    expect(speak).not.toHaveBeenCalled();
  });

  it('falls back to clearly device-generated speech when a manifest file is missing', async () => {
    const speak = vi.fn();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 404 })));
    vi.stubGlobal('window', { caches: undefined, speechSynthesis: { cancel: vi.fn(), getVoices: () => [], speak } });
    vi.stubGlobal('SpeechSynthesisUtterance', class { lang = ''; rate = 1; onstart = null; onend = null; onerror = null; constructor(public text: string) { void text; } });
    playAudio({ src: '/audio/missing.mp3', fallbackText: 'Terima kasih', onStart: (fallback) => expect(fallback).toBe(true) });
    await vi.waitFor(() => expect(speak).toHaveBeenCalledOnce());
  });
});
