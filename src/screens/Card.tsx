import React, { useState, useEffect, useRef } from 'react';
import type { Card as CardType, ProgressMap, UserSettings } from '../types';
import { precacheCardAudio, stopAudio } from '../lib/audio';
import { saveCardProgress } from '../lib/storage';
import { track } from '../lib/track';
import { StepDots } from '../components/StepDots';
import { DialogueLine } from '../components/DialogueLine';
import { ChipRow } from '../components/ChipRow';
import { PhraseList } from '../components/PhraseList';
import { TaskTest, type TaskSummaryResult } from '../components/TaskTest';
import { ResultStep } from '../components/ResultStep';

type CardScreenProps = {
  card: CardType;
  allCards: CardType[];
  progress: ProgressMap;
  settings: UserSettings;
  onBackToDeck: () => void;
  onNavigateToCard: (cardId: string) => void;
  onProgressUpdated: () => void;
};

const TOTAL_STEPS = 6;

export const CardScreen: React.FC<CardScreenProps> = ({
  card,
  allCards,
  progress,
  settings,
  onBackToDeck,
  onNavigateToCard,
  onProgressUpdated
}) => {
  const existingProg = progress[card.id];
  const initialStep = existingProg?.lastStepIndex && existingProg.lastStepIndex < TOTAL_STEPS ? existingProg.lastStepIndex : 0;

  const [currentStep, setCurrentStep] = useState(initialStep);
  const [showEnglish, setShowEnglish] = useState(settings.showEnglishDefault);
  const [taskResult, setTaskResult] = useState<TaskSummaryResult | null>(
    existingProg?.bestTask
      ? {
          turns: existingProg.bestTask.turns,
          firstTry: existingProg.bestTask.firstTry,
          withHint: existingProg.bestTask.withHint,
          assisted: existingProg.bestTask.assisted,
          attempts: existingProg.attempts,
          phrasesToRevisit: []
        }
      : null
  );

  const scrollerRef = useRef<HTMLDivElement>(null);

  // Pre-cache audio & track card opened
  useEffect(() => {
    precacheCardAudio(card);
    track('card_opened', { cardId: card.id });
    saveCardProgress(card.id, { started: true });
    onProgressUpdated();

    return () => {
      stopAudio();
    };
  }, [card.id]);

  // Scroll to step when currentStep changes
  const scrollToStep = (stepIndex: number) => {
    if (scrollerRef.current) {
      const targetScroll = stepIndex * scrollerRef.current.clientWidth;
      scrollerRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
    setCurrentStep(stepIndex);
    track('step_reached', { cardId: card.id, step: stepIndex });
    saveCardProgress(card.id, { lastStepIndex: stepIndex });
    onProgressUpdated();
  };

  // Listen to manual swipe / scroll events on container
  const handleScroll = () => {
    if (!scrollerRef.current) return;
    const scrollLeft = scrollerRef.current.scrollLeft;
    const width = scrollerRef.current.clientWidth;
    if (width > 0) {
      const newStep = Math.round(scrollLeft / width);
      if (newStep !== currentStep && newStep >= 0 && newStep < TOTAL_STEPS) {
        setCurrentStep(newStep);
        track('step_reached', { cardId: card.id, step: newStep });
        saveCardProgress(card.id, { lastStepIndex: newStep });
        onProgressUpdated();
      }
    }
  };

  // Keyboard left/right arrow shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept arrow keys if typing in an input
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (e.key === 'ArrowRight') {
        if (currentStep < TOTAL_STEPS - 1) {
          scrollToStep(currentStep + 1);
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentStep > 0) {
          scrollToStep(currentStep - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep]);

  const handleTaskComplete = (summary: TaskSummaryResult) => {
    setTaskResult(summary);
    saveCardProgress(card.id, {
      finished: true,
      attempts: (existingProg?.attempts || 0) + 1,
      bestTask: {
        turns: summary.turns,
        firstTry: summary.firstTry,
        withHint: summary.withHint,
        assisted: summary.assisted
      }
    });
    track('card_finished', { cardId: card.id });
    onProgressUpdated();
    // Advance to Result step (index 5)
    scrollToStep(5);
  };

  // Check if next card exists
  const currentIndex = allCards.findIndex((c) => c.id === card.id);
  const nextCard = currentIndex >= 0 && currentIndex < allCards.length - 1 ? allCards[currentIndex + 1] : null;

  return (
    <div className="card-flow-container">
      {/* Top Header */}
      <header className="card-flow-header">
        <button
          type="button"
          className="btn-ghost"
          onClick={onBackToDeck}
          aria-label="Back to deck"
        >
          ← Deck
        </button>

        <StepDots
          totalSteps={TOTAL_STEPS}
          currentStep={currentStep}
          onSelectStep={scrollToStep}
        />

        <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>{card.icon}</span>
      </header>

      {/* Swipeable Steps Scroller */}
      <div
        className="steps-scroller"
        ref={scrollerRef}
        onScroll={handleScroll}
        tabIndex={0}
        aria-label="Swipeable scenario steps"
      >
        {/* Step 0: Scene */}
        <section className="step-slide" aria-label="Step 1 of 6: Scene">
          {card.review.status !== 'approved' && (
            <div className="draft-banner">
              <span>⚠️</span>
              <span>Draft: being checked by native speakers</span>
            </div>
          )}

          <div className="step-header">
            <span className="step-badge">Step 1 of 6</span>
            <h2 className="step-title">{card.title}</h2>
          </div>

          <div className="scene-card-hero">
            <div className="scene-hero-icon">{card.icon}</div>
            <div className="scene-hero-text">"{card.scene}"</div>
            <div style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
              Variety: <strong>{card.variety}</strong> · ~{card.minutes} mins
            </div>
          </div>

          <button
            type="button"
            className="btn-primary"
            style={{ width: '100%', marginTop: 'auto' }}
            onClick={() => scrollToStep(1)}
          >
            Start Dialogue →
          </button>
        </section>

        {/* Step 1: Listen */}
        <section className="step-slide" aria-label="Step 2 of 6: Listen">
          <div className="step-header">
            <span className="step-badge">Step 2 of 6</span>
            <h2 className="step-title">Listen to the Dialogue</h2>
          </div>

          <div className="dialogue-toolbar">
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              {card.dialogue.length} lines
            </span>

            <label className="toggle-label">
              <input
                type="checkbox"
                checked={showEnglish}
                onChange={(e) => setShowEnglish(e.target.checked)}
              />
              <span>Show English</span>
            </label>
          </div>

          <div className="chat-thread">
            {card.dialogue.map((line) => (
              <DialogueLine key={line.id} line={line} showEnglish={showEnglish} />
            ))}
          </div>

          <button
            type="button"
            className="btn-primary"
            style={{ width: '100%', marginTop: '16px' }}
            onClick={() => scrollToStep(2)}
          >
            Say It Like Locals →
          </button>
        </section>

        {/* Step 2: Chips */}
        <section className="step-slide" aria-label="Step 3 of 6: Say it like locals">
          <div className="step-header">
            <span className="step-badge">Step 3 of 6</span>
            <h2 className="step-title">Say It Like Locals</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem' }}>
              Notice how everyday spoken Malay drops formal syllables and uses conversational markers.
            </p>
          </div>

          <ChipRow chips={card.chips} />

          <button
            type="button"
            className="btn-primary"
            style={{ width: '100%', marginTop: 'auto' }}
            onClick={() => scrollToStep(3)}
          >
            Learn Key Phrases →
          </button>
        </section>

        {/* Step 3: Key Phrases */}
        <section className="step-slide" aria-label="Step 4 of 6: Key phrases">
          <div className="step-header">
            <span className="step-badge">Step 4 of 6</span>
            <h2 className="step-title">Key Phrases for the Task</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem' }}>
              Listen and practice saying these out loud before your scored role-play.
            </p>
          </div>

          <PhraseList phrases={card.phrases} />

          <button
            type="button"
            className="btn-primary"
            style={{ width: '100%', marginTop: '16px' }}
            onClick={() => scrollToStep(4)}
          >
            Begin Task Test →
          </button>
        </section>

        {/* Step 4: Task Test */}
        <section className="step-slide" aria-label="Step 5 of 6: Task test">
          <div className="step-header">
            <span className="step-badge">Step 5 of 6</span>
            <h2 className="step-title">Task Test: Role-play</h2>
          </div>

          <TaskTest
            key={card.id}
            card={card}
            onComplete={handleTaskComplete}
          />
        </section>

        {/* Step 5: Result */}
        <section className="step-slide" aria-label="Step 6 of 6: Result">
          <div className="step-header">
            <span className="step-badge">Step 6 of 6</span>
            <h2 className="step-title">Summary</h2>
          </div>

          <ResultStep
            result={taskResult}
            onRetryTask={() => scrollToStep(4)}
            onNextCard={() => {
              if (nextCard) {
                onNavigateToCard(nextCard.id);
              }
            }}
            onBackToDeck={onBackToDeck}
            hasNextCard={Boolean(nextCard)}
          />
        </section>
      </div>

      {/* Bottom Sticky Navigation */}
      <footer className="card-flow-footer">
        <button
          type="button"
          className="btn-secondary"
          disabled={currentStep === 0}
          onClick={() => scrollToStep(currentStep - 1)}
          style={{ opacity: currentStep === 0 ? 0.4 : 1 }}
        >
          ← Back
        </button>

        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
          {currentStep + 1} / {TOTAL_STEPS}
        </span>

        <button
          type="button"
          className="btn-secondary"
          disabled={currentStep === TOTAL_STEPS - 1}
          onClick={() => scrollToStep(currentStep + 1)}
          style={{ opacity: currentStep === TOTAL_STEPS - 1 ? 0.4 : 1 }}
        >
          Next →
        </button>
      </footer>
    </div>
  );
};
