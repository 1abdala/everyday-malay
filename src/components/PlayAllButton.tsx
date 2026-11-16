import React, { useRef, useState } from 'react';
import type { DialogueLine } from '../types';
import { playAudio, stopAudio } from '../lib/audio';
import { findNativeAudioAsset, selectNativeAudio } from '../lib/audioManifest';

export const PlayAllButton: React.FC<{ lines: DialogueLine[]; scenarioId: string }> = ({ lines, scenarioId }) => {
  const [playing, setPlaying] = useState(false);
  const [usesDeviceVoice, setUsesDeviceVoice] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const failedRef = useRef(false);
  const indexRef = useRef(0);

  const stop = () => {
    failedRef.current = true;
    stopAudio();
    setPlaying(false);
  };

  const playFrom = (index: number) => {
    if (index >= lines.length) {
      setPlaying(false);
      return;
    }
    indexRef.current = index;
    const line = lines[index];
    playAudio({
      src: selectNativeAudio(findNativeAudioAsset({ id: `${scenarioId}_${line.id}` }), 'normal'),
      fallbackText: line.ms,
      speed: 'normal',
      onStart: (isFallback) => setUsesDeviceVoice((current) => current || isFallback),
      onEnded: () => { if (!failedRef.current) playFrom(indexRef.current + 1); },
      onError: () => {
        failedRef.current = true;
        setPlaying(false);
        setUnavailable(true);
      }
    });
  };

  const handleClick = () => {
    if (playing) { stop(); return; }
    failedRef.current = false;
    indexRef.current = 0;
    setUnavailable(false);
    setUsesDeviceVoice(false);
    setPlaying(true);
    playFrom(0);
  };

  return <div className="play-all-control">
    <button type="button" className="btn-secondary" onClick={handleClick} aria-label={playing ? 'Stop playing dialogue' : 'Play all dialogue lines'}>{playing ? 'Stop dialogue' : '▶ Play all'}</button>
    {usesDeviceVoice && <span className="audio-unavailable-message">Device-generated audio, not a native recording.</span>}
    {unavailable && <span role="status" className="audio-unavailable-message">Audio unavailable on this device.</span>}
  </div>;
};
