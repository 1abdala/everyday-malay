import React, { useState, useRef, useEffect } from 'react';
import type { Phrase } from '../types';
import { AudioButtons } from './AudioButtons';

type PhraseListProps = {
  phrases: Phrase[];
};

export const PhraseList: React.FC<PhraseListProps> = ({ phrases }) => {
  const [hasMediaRecorder, setHasMediaRecorder] = useState(false);
  const [recordingIndex, setRecordingIndex] = useState<number | null>(null);
  const [recordedAudioUrls, setRecordedAudioUrls] = useState<Record<number, string>>({});
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      navigator.mediaDevices &&
      typeof navigator.mediaDevices.getUserMedia === 'function' &&
      typeof MediaRecorder !== 'undefined'
    ) {
      setHasMediaRecorder(true);
    }
  }, []);

  const handleStartRecording = async (index: number) => {
    try {
      chunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedAudioUrls((prev) => ({ ...prev, [index]: url }));
        setRecordingIndex(null);
        // Stop all audio tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setRecordingIndex(index);
    } catch {
      // User denied permission or device error
      setRecordingIndex(null);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <div className="phrase-list">
      {phrases.map((phrase, idx) => {
        const isRecording = recordingIndex === idx;
        const myAudioUrl = recordedAudioUrls[idx];

        return (
          <div key={idx} className="phrase-card">
            <div className="phrase-ms">{phrase.ms}</div>
            <div className="phrase-en">{phrase.en}</div>

            <div className="phrase-audio-bar">
              <AudioButtons
                normalSrc={phrase.audio?.normal}
                slowSrc={phrase.audio?.slow}
                textToSpeak={phrase.ms}
              />
            </div>

            {hasMediaRecorder && (
              <div className="recorder-box">
                {!isRecording ? (
                  <button
                    type="button"
                    className="rec-btn"
                    onClick={() => handleStartRecording(idx)}
                    aria-label={`Record your own voice for ${phrase.ms}`}
                  >
                    <span>🎙️</span>
                    <span>Record practice</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="rec-btn recording"
                    onClick={handleStopRecording}
                    aria-label="Stop recording"
                  >
                    <span>⏹️</span>
                    <span>Stop recording</span>
                  </button>
                )}

                {myAudioUrl && (
                  <audio
                    src={myAudioUrl}
                    controls
                    style={{ height: '32px', maxWidth: '170px' }}
                    aria-label="Playback your recording"
                  />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
