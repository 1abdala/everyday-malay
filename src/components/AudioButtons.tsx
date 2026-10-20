import React, { useState } from 'react';
import { playAudio, stopAudio } from '../lib/audio';

type AudioButtonsProps = {
  normalSrc?: string;
  slowSrc?: string;
  textToSpeak: string;
  size?: 'sm' | 'md';
};

export const AudioButtons: React.FC<AudioButtonsProps> = ({
  normalSrc,
  slowSrc,
  textToSpeak
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSpeed, setActiveSpeed] = useState<'normal' | 'slow' | null>(null);
  const [isFallbackVoice, setIsFallbackVoice] = useState(false);

  const handlePlay = (speed: 'normal' | 'slow') => {
    if (isPlaying && activeSpeed === speed) {
      stopAudio();
      setIsPlaying(false);
      setActiveSpeed(null);
      return;
    }

    const src = speed === 'slow' ? (slowSrc || normalSrc) : normalSrc;

    playAudio({
      src,
      fallbackText: textToSpeak,
      speed,
      onStart: (fallback) => {
        setIsPlaying(true);
        setActiveSpeed(speed);
        setIsFallbackVoice(fallback);
      },
      onEnded: () => {
        setIsPlaying(false);
        setActiveSpeed(null);
      },
      onError: () => {
        setIsPlaying(false);
        setActiveSpeed(null);
      }
    });
  };

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
      <button
        type="button"
        className="audio-btn"
        onClick={() => handlePlay('normal')}
        aria-label={`Play normal speed for ${textToSpeak}`}
        title="Play normal speed"
      >
        <span>{isPlaying && activeSpeed === 'normal' ? '⏸' : '▶'}</span>
        <span>Normal</span>
      </button>

      <button
        type="button"
        className="audio-btn"
        onClick={() => handlePlay('slow')}
        aria-label={`Play slow speed for ${textToSpeak}`}
        title="Play slow speed"
      >
        <span>{isPlaying && activeSpeed === 'slow' ? '⏸' : '🐢'}</span>
        <span>Slow</span>
      </button>

      {isFallbackVoice && (
        <span className="device-voice-tag" title="Recorded audio missing: using device synthetic speech">
          🤖 device voice
        </span>
      )}
    </div>
  );
};
