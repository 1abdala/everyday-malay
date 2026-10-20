import type { Card } from '../types';

let currentAudio: HTMLAudioElement | null = null;

export type AudioPlayOptions = {
  src?: string;
  fallbackText: string;
  speed?: 'normal' | 'slow';
  onStart?: (isFallback: boolean) => void;
  onEnded?: () => void;
  onError?: (err: unknown) => void;
};

/**
 * Stops any currently playing audio or speech synthesis.
 */
export function stopAudio(): void {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Fallback to Web Speech API (device voice)
 */
function playSpeechSynthesis(
  text: string,
  speed: 'normal' | 'slow',
  onStart?: (isFallback: boolean) => void,
  onEnded?: () => void
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onEnded?.();
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ms-MY';
  utterance.rate = speed === 'slow' ? 0.55 : 0.95;

  utterance.onstart = () => {
    onStart?.(true);
  };
  utterance.onend = () => {
    onEnded?.();
  };
  utterance.onerror = () => {
    onEnded?.();
  };

  window.speechSynthesis.speak(utterance);
}

/**
 * Plays audio with automatic fallback to Web Speech API.
 */
export function playAudio({
  src,
  fallbackText,
  speed = 'normal',
  onStart,
  onEnded,
  onError
}: AudioPlayOptions): void {
  stopAudio();

  if (!src) {
    playSpeechSynthesis(fallbackText, speed, onStart, onEnded);
    return;
  }

  const audio = new Audio(src);
  currentAudio = audio;

  // Normal playback speed is 1.0, slow can also slow down playbackRate if needed
  if (speed === 'slow') {
    audio.playbackRate = 0.85;
  }

  let started = false;

  audio.onplay = () => {
    started = true;
    onStart?.(false);
  };

  audio.onended = () => {
    currentAudio = null;
    onEnded?.();
  };

  audio.onerror = () => {
    currentAudio = null;
    // Failed to load or 404: fall back to device voice
    playSpeechSynthesis(fallbackText, speed, onStart, onEnded);
  };

  audio.play().catch((err) => {
    // If play() was prevented (e.g. autoplay policy or 404 error)
    if (!started) {
      currentAudio = null;
      playSpeechSynthesis(fallbackText, speed, onStart, onEnded);
    } else {
      onError?.(err);
    }
  });
}

/**
 * Pre-caches all audio files for a given card into the browser cache / SW
 */
export function precacheCardAudio(card: Card): void {
  if (typeof window === 'undefined' || !('caches' in window)) return;

  const urls: string[] = [];
  card.dialogue.forEach((line) => {
    if (line.audio?.normal) urls.push(line.audio.normal);
    if (line.audio?.slow) urls.push(line.audio.slow);
  });
  card.phrases.forEach((phrase) => {
    if (phrase.audio?.normal) urls.push(phrase.audio.normal);
    if (phrase.audio?.slow) urls.push(phrase.audio.slow);
  });
  card.task.turns.forEach((turn) => {
    if (turn.type === 'npc' && turn.audio) urls.push(turn.audio);
  });
  if (card.task.conclusion?.audio) {
    urls.push(card.task.conclusion.audio);
  }

  urls.forEach((url) => {
    // Trigger lightweight fetch so service worker or HTTP cache caches 200 responses
    fetch(url, { method: 'GET', mode: 'no-cors' }).catch(() => {
      // Audio might not exist yet during draft, silently ignore
    });
  });
}
