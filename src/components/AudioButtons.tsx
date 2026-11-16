import React, { useState } from 'react';
import { playAudio, stopAudio } from '../lib/audio';
import { findNativeAudioAsset, selectNativeAudio } from '../lib/audioManifest';

type AudioButtonsProps = {
  normalSrc?: string;
  slowSrc?: string;
  textToSpeak: string;
  audioId?: string;
  scenarioId?: string;
  size?: 'sm' | 'md';
};

export const AudioButtons: React.FC<AudioButtonsProps> = ({
  normalSrc,
  slowSrc,
  textToSpeak,
  audioId,
  scenarioId
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSpeed, setActiveSpeed] = useState<'normal' | 'slow' | null>(null);
  const [isFallbackVoice, setIsFallbackVoice] = useState(false);
  const [playbackError, setPlaybackError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const manifestAsset = findNativeAudioAsset({ id: audioId, scenarioId, text: textToSpeak });
  const hasManifestAsset = Boolean(manifestAsset);
  const hasPlannedRecording = manifestAsset?.status === 'planned';

  const handlePlay = (speed: 'normal' | 'slow') => {
    if (isPlaying && activeSpeed === speed) {
      stopAudio();
      setIsPlaying(false);
      setActiveSpeed(null);
      return;
    }

    const src = hasManifestAsset
      ? selectNativeAudio(manifestAsset, speed)
      : (speed === 'slow' ? (slowSrc || normalSrc) : normalSrc);
    setPlaybackError(false);
    setIsLoading(Boolean(src));
    setActiveSpeed(speed);

    playAudio({
      src,
      fallbackText: textToSpeak,
      speed,
      onStart: (fallback) => {
        setIsLoading(false);
        setIsPlaying(true);
        setActiveSpeed(speed);
        setIsFallbackVoice(fallback);
      },
      onEnded: () => {
        setIsLoading(false);
        setIsPlaying(false);
        setActiveSpeed(null);
      },
      onError: () => {
        setIsLoading(false);
        setIsPlaying(false);
        setActiveSpeed(null);
        setPlaybackError(true);
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
        <span>{isLoading && activeSpeed === 'normal' ? '…' : isPlaying && activeSpeed === 'normal' ? '⏸' : '▶'}</span>
        <span>Normal</span>
      </button>

      {(!normalSrc && !slowSrc || hasManifestAsset && !selectNativeAudio(manifestAsset, 'normal')) && <span className="device-voice-tag">{hasPlannedRecording ? 'Native recording planned; device-generated audio is used if available.' : 'This phrase uses device-generated audio if available. It is not a native recording.'}</span>}

      <button
        type="button"
        className="audio-btn"
        onClick={() => handlePlay('slow')}
        aria-label={`Play slow speed for ${textToSpeak}`}
        title="Play slow speed"
      >
        <span>{isLoading && activeSpeed === 'slow' ? '…' : isPlaying && activeSpeed === 'slow' ? '⏸' : '🐢'}</span>
        <span>Slow</span>
      </button>

      {isLoading && <span role="status" className="audio-unavailable-message">Loading audio…</span>}

      {isFallbackVoice && (
        <span className="device-voice-tag" title="Device-generated speech is not a native Malaysian Malay recording">
          Device-generated audio · not native
        </span>
      )}
      {playbackError && (
        <span role="status" className="audio-unavailable-message">
          Audio unavailable on this device.
        </span>
      )}
    </div>
  );
};
