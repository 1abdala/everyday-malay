import { appAssetPath } from './assets';
import { fetchAudioOnDemand } from './audioCache';

let currentAudio: HTMLAudioElement | null = null;
let currentObjectUrl: string | null = null;
let playbackSequence = 0;

export type AudioPlayOptions = {
  src?: string;
  fallbackText: string;
  speed?: 'normal' | 'slow';
  onStart?: (isFallback: boolean) => void;
  onEnded?: () => void;
  onError?: (err: unknown) => void;
};

export function stopAudio(): void {
  playbackSequence += 1;
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  if (currentObjectUrl) {
    URL.revokeObjectURL(currentObjectUrl);
    currentObjectUrl = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
}

function playSpeechSynthesis(text: string, speed: 'normal' | 'slow', onStart?: (fallback: boolean) => void, onEnded?: () => void, onError?: (err: unknown) => void): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
    onError?.(new Error('Speech playback is unavailable on this device.'));
    onEnded?.();
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ms-MY';
  utterance.rate = speed === 'slow' ? 0.55 : 0.95;
  let voices: SpeechSynthesisVoice[];
  try { voices = window.speechSynthesis.getVoices?.() ?? []; }
  catch (error) { onError?.(error); return; }
  const malayVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith('ms'));
  if (voices.length > 0 && !malayVoice) { onError?.(new Error('No Malay device voice is available.')); return; }
  if (malayVoice) utterance.voice = malayVoice;
  utterance.onstart = () => onStart?.(true);
  utterance.onend = () => onEnded?.();
  utterance.onerror = (event) => { onError?.(event); onEnded?.(); };
  try { window.speechSynthesis.speak(utterance); } catch (error) { onError?.(error); }
}

/** Fetch on learner request, cache opportunistically, and use a device voice on failure. */
export function playAudio({ src, fallbackText, speed = 'normal', onStart, onEnded, onError }: AudioPlayOptions): void {
  stopAudio();
  if (!src) { playSpeechSynthesis(fallbackText, speed, onStart, onEnded, onError); return; }
  const sequence = playbackSequence;
  void (async () => {
    let objectUrl: string | undefined;
    try {
      const response = await fetchAudioOnDemand(appAssetPath(src));
      if (!response.ok) throw new Error(`Audio request failed (${response.status}).`);
      const blob = await response.blob();
      if (sequence !== playbackSequence) return;
      objectUrl = URL.createObjectURL(blob);
      currentObjectUrl = objectUrl;
      const audio = new Audio(objectUrl);
      currentAudio = audio;
      if (speed === 'slow') audio.playbackRate = 0.85;
      let started = false;
      const releaseUrl = () => {
        if (objectUrl && currentObjectUrl === objectUrl) { URL.revokeObjectURL(objectUrl); currentObjectUrl = null; }
      };
      audio.onplay = () => { started = true; onStart?.(false); };
      audio.onended = () => { currentAudio = null; releaseUrl(); onEnded?.(); };
      audio.onerror = () => {
        currentAudio = null; releaseUrl();
        playSpeechSynthesis(fallbackText, speed, onStart, onEnded, onError);
      };
      await audio.play();
      // Some test/browser implementations resolve play() without dispatching `play`.
      if (!started && sequence === playbackSequence && audio.paused === false) onStart?.(false);
    } catch {
      if (sequence !== playbackSequence) return;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      if (currentObjectUrl === objectUrl) currentObjectUrl = null;
      currentAudio = null;
      playSpeechSynthesis(fallbackText, speed, onStart, onEnded, onError);
    }
  })();
}
