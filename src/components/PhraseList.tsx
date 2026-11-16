import React, { useState, useRef, useEffect } from 'react';
import type { Phrase } from '../types';
import { AudioButtons } from './AudioButtons';
import { loadSavedPhrases, removeSavedPhrase, savePhraseForReview } from '../lib/storage';

type PhraseListProps = {
  phrases: Phrase[];
  scenarioId: string;
};

export const PhraseList: React.FC<PhraseListProps> = ({ phrases, scenarioId }) => {
  const [hasMediaRecorder, setHasMediaRecorder] = useState(false);
  const [recordingIndex, setRecordingIndex] = useState<number | null>(null);
  const [recordedAudioUrls, setRecordedAudioUrls] = useState<Record<number, string>>({});
  const [savedPhraseIds, setSavedPhraseIds] = useState(() => new Set(loadSavedPhrases().map((phrase) => phrase.id)));
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [showAllPhrases, setShowAllPhrases] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordingFailedRef = useRef(false);
  const recordedAudioUrlsRef = useRef(recordedAudioUrls);
  recordedAudioUrlsRef.current = recordedAudioUrls;

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

  useEffect(() => () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stop();
    }
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    Object.values(recordedAudioUrlsRef.current).forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const handleStartRecording = async (index: number) => {
    try {
      setRecordingError(null);
      recordingFailedRef.current = false;
      chunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const supportedTypes = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'];
      const mimeType = supportedTypes.find((type) => MediaRecorder.isTypeSupported?.(type));
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      recorder.onerror = () => {
        recordingFailedRef.current = true;
        setRecordingError('Recording stopped unexpectedly. You can still practise by listening and speaking aloud.');
        setRecordingIndex(null);
        stream.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      };

      recorder.onstop = () => {
        if (!recordingFailedRef.current && chunksRef.current.length > 0) {
          const blob = new Blob(chunksRef.current, { type: recorder.mimeType || mimeType || 'application/octet-stream' });
          const url = URL.createObjectURL(blob);
          setRecordedAudioUrls((prev) => {
            if (prev[index]) URL.revokeObjectURL(prev[index]);
            return { ...prev, [index]: url };
          });
        }
        setRecordingIndex(null);
        stream.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      };

      recorder.start();
      setRecordingIndex(index);
    } catch (error) {
      setRecordingIndex(null);
      const name = error instanceof DOMException ? error.name : '';
      setRecordingError(name === 'NotAllowedError' || name === 'SecurityError'
        ? 'Microphone permission was not granted. You can still practise by listening and speaking aloud.'
        : 'Recording is unavailable in this browser right now. You can still practise by speaking aloud.');
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <div className="phrase-list">
      <p className="recording-disclosure">Microphone practice is experimental. A recording stays in this browser session for your playback and is not uploaded.</p>
      {!hasMediaRecorder && <p className="recording-unavailable" role="status">Recording is unavailable in this browser. You can still practise by listening and speaking aloud.</p>}
      {recordingError && <p className="recording-unavailable" role="alert">{recordingError}</p>}
      {(showAllPhrases ? phrases : phrases.slice(0, 5)).map((phrase, idx) => {
        const isRecording = recordingIndex === idx;
        const myAudioUrl = recordedAudioUrls[idx];
        const isSaved = savedPhraseIds.has(phrase.id);
        const approvedGlosses = phrase.wordGlosses?.filter((gloss) => gloss.reviewStatus === 'approved') ?? [];
        const allGlossesReviewed = Boolean(phrase.wordGlosses?.length && approvedGlosses.length === phrase.wordGlosses.length);

        return (
          <div key={idx} className="phrase-card">
            <div className="phrase-ms malay-text" lang="ms">{phrase.ms}</div>
            <div className="phrase-en english-text" lang="en">{phrase.en}</div>
            {allGlossesReviewed ? (
              <ul className="phrase-word-glosses" aria-label={`Reviewed word meanings for ${phrase.ms}`}>
                {approvedGlosses.map((gloss, glossIndex) => <li key={`${phrase.id}-${glossIndex}`}><strong className="malay-text" lang="ms">{gloss.malay}</strong><span className="english-text" lang="en">{gloss.english}</span></li>)}
              </ul>
            ) : (
              <p className="word-breakdown-pending">Word breakdown coming soon; this phrase has not been given unreviewed word meanings.</p>
            )}

            {phrase.review.status !== 'approved' && <span className="phrase-review-status">Phrase under review</span>}

            <button
              type="button"
              className="phrase-save-button"
              aria-pressed={isSaved}
              onClick={() => {
                if (isSaved) {
                  removeSavedPhrase(phrase.id);
                  setSavedPhraseIds((current) => { const next = new Set(current); next.delete(phrase.id); return next; });
                } else {
                  savePhraseForReview({ id: phrase.id, scenarioId, malay: phrase.ms, english: phrase.en });
                  setSavedPhraseIds((current) => new Set(current).add(phrase.id));
                }
              }}
            >
              {isSaved ? '✓ Saved for review' : '+ Save for review'}
            </button>

            <div className="phrase-audio-bar">
              <AudioButtons
                audioId={phrase.id}
                scenarioId={scenarioId}
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
                    onError={() => setRecordingError('This recording could not be played in this browser.')}
                  />
                )}
              </div>
            )}
          </div>
        );
      })}
      {phrases.length > 5 && <button type="button" className="btn-secondary phrase-expand-button" aria-expanded={showAllPhrases} onClick={() => setShowAllPhrases((shown) => !shown)}>{showAllPhrases ? 'Show fewer phrases' : `Show ${phrases.length - 5} more phrases`}</button>}
    </div>
  );
};
