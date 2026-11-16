import React, { useState, useEffect, useRef } from 'react';
import type { Card, TaskDraftProgress, TaskTurn } from '../types';
import { matchTurn } from '../lib/matcher';
import { logFailedAnswer } from '../lib/storage';
import { track } from '../lib/track';
import { playAudio } from '../lib/audio';
import { WordBank } from './WordBank';
import { AudioButtons } from './AudioButtons';

export type TaskSummaryResult = {
  turns: number;
  firstTry: number;
  withHint: number;
  assisted: number;
  attempts: number;
  phrasesToRevisit: string[];
};

type TaskTestProps = {
  card: Card;
  onComplete: (result: TaskSummaryResult) => void;
  isActive: boolean;
  initialDraft?: TaskDraftProgress;
  onDraftChange?: (draft: TaskDraftProgress) => void;
};

type TurnState = {
  status: 'answering' | 'passed' | 'hint' | 'assisted';
  attempts: number;
  nearMiss: boolean;
};

export const TaskTest: React.FC<TaskTestProps> = ({ card, onComplete, isActive, initialDraft, onDraftChange }) => {
  const validInitialDraft = initialDraft
    && Number.isInteger(initialDraft.turnIndex)
    && initialDraft.turnIndex >= 0
    && initialDraft.turnIndex < card.task.turns.length
    && Array.isArray(initialDraft.selectedWordTiles)
    && Array.isArray(initialDraft.phrasesToRevisit)
    ? initialDraft
    : undefined;
  const [currentTurnIdx, setCurrentTurnIdx] = useState(validInitialDraft?.turnIndex ?? 0);
  const [inputMode, setInputMode] = useState<'type' | 'wordbank'>(validInitialDraft?.inputMode ?? 'wordbank');
  const [typedInput, setTypedInput] = useState(validInitialDraft?.typedInput ?? '');
  const [selectedWordTiles, setSelectedWordTiles] = useState<{ id: string; word: string }[]>(validInitialDraft?.selectedWordTiles ?? []);

  // Turn state tracking
  const [turnState, setTurnState] = useState<TurnState>(validInitialDraft?.turnState ?? {
    status: 'answering',
    attempts: 0,
    nearMiss: false
  });

  // Task accumulator stats
  const [firstTryCount, setFirstTryCount] = useState(validInitialDraft?.firstTryCount ?? 0);
  const [withHintCount, setWithHintCount] = useState(validInitialDraft?.withHintCount ?? 0);
  const [assistedCount, setAssistedCount] = useState(validInitialDraft?.assistedCount ?? 0);
  const [totalAttempts, setTotalAttempts] = useState(validInitialDraft?.totalAttempts ?? 0);
  const [phrasesToRevisit, setPhrasesToRevisit] = useState<string[]>(validInitialDraft?.phrasesToRevisit ?? []);
  const [isConcluding, setIsConcluding] = useState(validInitialDraft?.isConcluding ?? false);
  const [assistedReconstructed, setAssistedReconstructed] = useState(validInitialDraft?.assistedReconstructed ?? false);
  const [reconstructionError, setReconstructionError] = useState(false);
  const [audioUnavailable, setAudioUnavailable] = useState(false);
  const completionSentRef = useRef(false);
  const startedTrackedRef = useRef(false);
  const typedInputRef = useRef<HTMLInputElement>(null);

  const currentTurn: TaskTurn | undefined = card.task.turns[currentTurnIdx];

  // Track task started on first load
  useEffect(() => {
    if (isActive && !startedTrackedRef.current) {
      startedTrackedRef.current = true;
      track('task_started', { cardId: card.id });
    }
  }, [card.id, isActive]);

  useEffect(() => {
    if (!isActive || !onDraftChange) return;
    onDraftChange({
      turnIndex: currentTurnIdx,
      inputMode,
      typedInput,
      selectedWordTiles,
      turnState,
      firstTryCount,
      withHintCount,
      assistedCount,
      totalAttempts,
      phrasesToRevisit,
      isConcluding,
      assistedReconstructed
    });
  }, [isActive, onDraftChange, currentTurnIdx, inputMode, typedInput, selectedWordTiles, turnState, firstTryCount, withHintCount, assistedCount, totalAttempts, phrasesToRevisit, isConcluding, assistedReconstructed]);

  // Autoplay NPC audio for current turn if user has interacted
  useEffect(() => {
    if (isActive && currentTurn?.type === 'npc' && currentTurn.audio) {
      setAudioUnavailable(false);
      playAudio({
        src: currentTurn.audio,
        fallbackText: currentTurn.ms,
        speed: 'normal',
        onError: () => setAudioUnavailable(true)
      });
    }
  }, [currentTurnIdx, currentTurn, isActive]);

  useEffect(() => {
    if (isActive && inputMode === 'type') {
      typedInputRef.current?.focus();
    }
  }, [isActive, inputMode]);

  if (!currentTurn) return null;

  const currentAnswer =
    inputMode === 'type'
      ? typedInput
      : selectedWordTiles.map((t) => t.word).join(' ');

  const handleCheckAnswer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentAnswer.trim() || turnState.status === 'passed' || (turnState.status === 'assisted' && assistedReconstructed)) {
      return;
    }

    if (turnState.status === 'assisted') {
      const reconstruction = matchTurn(currentAnswer, { ...currentTurn, accept: [currentTurn.model], keywords: undefined });
      if (reconstruction.pass) {
        setAssistedReconstructed(true);
        setReconstructionError(false);
      } else {
        setReconstructionError(true);
      }
      return;
    }

    const nextAttempt = turnState.attempts + 1;
    setTotalAttempts((prev) => prev + 1);

    const matchRes = matchTurn(currentAnswer, currentTurn);

    if (matchRes.pass) {
      // Passed!
      if (nextAttempt === 1) {
        setFirstTryCount((prev) => prev + 1);
      } else {
        setWithHintCount((prev) => prev + 1);
      }

      setTurnState({
        status: 'passed',
        attempts: nextAttempt,
        nearMiss: false
      });
    } else {
      // Failed attempt
      logFailedAnswer(card.id, currentTurnIdx, currentAnswer);
      track('turn_failed', { cardId: card.id, turnIndex: currentTurnIdx });

      if (!phrasesToRevisit.includes(currentTurn.model)) {
        setPhrasesToRevisit((prev) => [...prev, currentTurn.model]);
      }

      if (nextAttempt === 1) {
        // First fail -> show hint
        setTurnState({
          status: 'hint',
          attempts: nextAttempt,
          nearMiss: matchRes.nearMiss
        });
      } else {
        // Second fail -> assisted mode
        setAssistedCount((prev) => prev + 1);
        setTurnState({
          status: 'assisted',
          attempts: nextAttempt,
          nearMiss: false
        });
        setTypedInput('');
        setSelectedWordTiles([]);
        setInputMode('wordbank');
        setAssistedReconstructed(false);
        setReconstructionError(false);
      }
    }
  };

  const handleAdvance = () => {
    const isLastTurn = currentTurnIdx === card.task.turns.length - 1;

    if (isLastTurn) {
      if (card.task.conclusion && !isConcluding) {
        // Play conclusion
        setIsConcluding(true);
        if (card.task.conclusion.audio) {
          playAudio({
            src: card.task.conclusion.audio,
            fallbackText: card.task.conclusion.ms,
            speed: 'normal'
          });
        }
        return;
      }

      // Finish task
      if (completionSentRef.current) return;
      completionSentRef.current = true;
      const summaryResult: TaskSummaryResult = {
        turns: card.task.turns.length,
        firstTry: firstTryCount,
        withHint: withHintCount,
        assisted: assistedCount,
        attempts: totalAttempts,
        phrasesToRevisit
      };

      track('task_completed', {
        cardId: card.id,
        firstTry: firstTryCount,
        withHint: withHintCount,
        assisted: assistedCount
      });

      onComplete(summaryResult);
    } else {
      // Next turn
      setCurrentTurnIdx((prev) => prev + 1);
      // Start with blocks on the first turn, then invite recall on later turns.
      setInputMode('type');
      setTypedInput('');
      setSelectedWordTiles([]);
      setTurnState({
        status: 'answering',
        attempts: 0,
        nearMiss: false
      });
      setAssistedReconstructed(false);
      setReconstructionError(false);
    }
  };

  return (
    <div className="task-test-container">
      {/* Task Goal */}
      <div className="task-goal-box">
        <div className="task-goal-title">Role-play Goal</div>
        <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{card.task.goal}</div>
        <p className="task-scaffold-note">Start by arranging the word blocks. Switch to Type when you’re ready to try from memory.</p>
      </div>

      {/* Main turn card */}
      <div className="task-turn-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="turn-prompt-badge">
            Turn {currentTurnIdx + 1} of {card.task.turns.length}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            {currentTurn.type === 'npc' ? 'Other person spoke' : 'Your initiative'}
          </span>
        </div>

        {/* Turn Prompt Content */}
        {currentTurn.type === 'npc' ? (
          <div>
            <div className="turn-dialogue-prompt malay-text" lang="ms">"{currentTurn.ms}"</div>
            <div className="turn-subtext english-text" lang="en">{currentTurn.en}</div>
            {currentTurn.audio && (
              <div style={{ marginTop: '8px' }}>
                <AudioButtons
                  scenarioId={card.id}
                  normalSrc={currentTurn.audio}
                  textToSpeak={currentTurn.ms}
                />
              </div>
            )}
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>
              Instruction:
            </div>
            <div className="turn-dialogue-prompt">{currentTurn.en}</div>
          </div>
        )}
        {audioUnavailable && (
          <div role="status" className="device-voice-tag" style={{ marginTop: 8 }}>
            Audio unavailable on this device.
          </div>
        )}

        {/* Input Mode Switcher */}
        <div className="mode-toggle-bar">
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
            Input mode:
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              type="button"
              className={`mode-btn ${inputMode === 'type' ? 'active' : ''}`}
              onClick={() => setInputMode('type')}
            >
              ⌨️ Type
            </button>
            <button
              type="button"
              className={`mode-btn ${inputMode === 'wordbank' ? 'active' : ''}`}
              onClick={() => setInputMode('wordbank')}
            >
              🧩 Word Bank
            </button>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleCheckAnswer} className="task-input-form">
          {inputMode === 'type' ? (
            <input
              ref={typedInputRef}
              type="text"
              className="task-text-input"
              placeholder="Type your response in Malay..."
              lang="ms"
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value)}
              disabled={turnState.status === 'passed' || (turnState.status === 'assisted' && assistedReconstructed)}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              aria-label="Your response in Malay"
              autoFocus
            />
          ) : (
            <WordBank
              card={card}
              modelAnswer={currentTurn.model}
              selectedWords={selectedWordTiles}
              onSelectedWordsChange={setSelectedWordTiles}
              disabled={turnState.status === 'passed' || (turnState.status === 'assisted' && assistedReconstructed)}
            />
          )}

          {/* Feedback states */}
          {turnState.status === 'passed' && (
            <div className="feedback-box feedback-success" role="status">
              <span style={{ fontWeight: 700 }}>✓ Betul! (Correct)</span>
              <span>One suggested answer: <strong className="malay-text" lang="ms">{currentTurn.model}</strong></span>
            </div>
          )}

          {turnState.status === 'hint' && (
            <div className="feedback-box feedback-hint" role="alert">
              <span style={{ fontWeight: 700 }}>
                {turnState.nearMiss ? "Close! You're missing something." : 'Try again!'}
              </span>
              <span>Hint: {currentTurn.hint}</span>
            </div>
          )}

          {turnState.status === 'assisted' && (
            <div className="feedback-box feedback-assisted" role="alert">
              <span style={{ fontWeight: 700 }}>Suggested response:</span>
              <span className="malay-text" lang="ms" style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                {currentTurn.model}
              </span>
              <span>{assistedReconstructed ? 'Good reconstruction. You can continue.' : 'Now rebuild the response with the word blocks, or type it from memory.'}</span>
            </div>
          )}

          {reconstructionError && <div className="feedback-box feedback-hint" role="status">Build the suggested response shown above before continuing.</div>}

          {/* Conclusion display if last turn was passed and conclusion exists */}
          {isConcluding && card.task.conclusion && (
            <div className="feedback-box feedback-assisted" style={{ marginTop: '10px' }}>
              <span style={{ fontWeight: 700 }}>Worker / Driver:</span>
              <span className="malay-text" lang="ms" style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                "{card.task.conclusion.ms}"
              </span>
              <span className="english-text" lang="en" style={{ fontSize: '0.88rem' }}>
                {card.task.conclusion.en}
              </span>
              {card.task.conclusion.audio && (
                <div style={{ marginTop: '6px' }}>
                  <AudioButtons
                    scenarioId={card.id}
                    normalSrc={card.task.conclusion.audio}
                    textToSpeak={card.task.conclusion.ms}
                  />
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          {turnState.status === 'answering' || turnState.status === 'hint' || (turnState.status === 'assisted' && !assistedReconstructed) ? (
            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', marginTop: '4px' }}
              disabled={!currentAnswer.trim()}
            >
              {turnState.status === 'assisted' ? 'Rebuild response' : 'Check answer'}
            </button>
          ) : (
            <button
              type="button"
              className="btn-primary"
              style={{ width: '100%', marginTop: '4px' }}
              onClick={handleAdvance}
            >
              {currentTurnIdx === card.task.turns.length - 1 && (!card.task.conclusion || isConcluding)
                ? 'Finish task'
                : 'Next turn'}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
