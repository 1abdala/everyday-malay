import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Card as CardType, ProgressMap, TaskDraftProgress, UserSettings } from '../types';
import { stopAudio } from '../lib/audio';
import { completeScenario, loadRewardProgress, saveCardProgress } from '../lib/storage';
import { track } from '../lib/track';
import { StepDots } from '../components/StepDots';
import { DialogueLine } from '../components/DialogueLine';
import { PlayAllButton } from '../components/PlayAllButton';
import { ComprehensionCheck } from '../components/ComprehensionCheck';
import { ChipRow } from '../components/ChipRow';
import { PhraseList } from '../components/PhraseList';
import { TaskTest, type TaskSummaryResult } from '../components/TaskTest';
import { ResultStep } from '../components/ResultStep';
import { ScenarioArtwork } from '../components/ScenarioArtwork';
import { getAdjacentLessonStep, LESSON_STEP_COUNT, normalizeLessonStep } from '../lib/lessonNavigation';

type CardScreenProps = {
  card: CardType;
  progress: ProgressMap;
  settings: UserSettings;
  onBackToDeck: () => void;
  onContinuePath: () => void;
  returnToBrowseLabel: string;
  onProgressUpdated: () => void;
};

const STEP_NAMES = ['Scene', 'Listen', 'Understand', 'Key phrases', 'Task test', 'Results'];

export const CardScreen: React.FC<CardScreenProps> = ({
  card,
  progress,
  settings,
  onBackToDeck,
  onContinuePath,
  returnToBrowseLabel,
  onProgressUpdated
}) => {
  const existingProg = progress[card.id];
  const initialStep = normalizeLessonStep(existingProg?.lastStepIndex);

  const [currentStep, setCurrentStep] = useState(initialStep);
  const [showEnglish, setShowEnglish] = useState(settings.showEnglishDefault);
  const [taskResult, setTaskResult] = useState<TaskSummaryResult | null>(
    existingProg?.bestTask
      ? {
          turns: existingProg.bestTask.turns,
          firstTry: existingProg.bestTask.firstTry,
          withHint: existingProg.bestTask.withHint,
          assisted: existingProg.bestTask.assisted,
          attempts: existingProg.bestTask.attempts ?? 0,
          phrasesToRevisit: existingProg.bestTask.phrasesToRevisit ?? []
        }
      : null
  );

  const contentRef = useRef<HTMLDivElement>(null);
  const currentStepRef = useRef(initialStep);
  const transitionLockRef = useRef(false);
  const completionGuardRef = useRef(false);
  const [taskRun, setTaskRun] = useState(0);
  const [xpAwarded, setXpAwarded] = useState(0);
  const [totalXp, setTotalXp] = useState(() => loadRewardProgress().totalXp);

  const saveTaskDraft = useCallback((taskDraft: TaskDraftProgress) => {
    saveCardProgress(card.id, { taskDraft });
    onProgressUpdated();
  }, [card.id, onProgressUpdated]);

  // Pre-cache audio & track card opened
  useEffect(() => {
    track('card_opened', { cardId: card.id });
    saveCardProgress(card.id, { started: true });
    onProgressUpdated();

    return () => {
      stopAudio();
    };
  }, [card.id]);

  const moveToStep = (stepIndex: number, persist = true, force = false) => {
    if ((!force && transitionLockRef.current) || stepIndex === currentStepRef.current) return;
    if (!force) {
      transitionLockRef.current = true;
      window.setTimeout(() => { transitionLockRef.current = false; }, 220);
    }
    currentStepRef.current = stepIndex;
    setCurrentStep(stepIndex);
    if (contentRef.current) contentRef.current.scrollTop = 0;
    track('step_reached', { cardId: card.id, step: stepIndex });
    if (persist) {
      saveCardProgress(card.id, { lastStepIndex: stepIndex });
      onProgressUpdated();
    }
  };

  const moveAdjacent = (direction: -1 | 1) => {
    const nextStep = getAdjacentLessonStep(currentStepRef.current, direction);
    if (nextStep !== null) moveToStep(nextStep);
  };

  const handleTaskComplete = (summary: TaskSummaryResult) => {
    if (completionGuardRef.current) return;
    completionGuardRef.current = true;
    setTaskResult(summary);
    const completion = completeScenario(card.id, {
      lastStepIndex: 5,
      taskDraft: undefined,
      attempts: (existingProg?.attempts || 0) + 1,
      bestTask: {
        turns: summary.turns,
        firstTry: summary.firstTry,
        withHint: summary.withHint,
        assisted: summary.assisted,
        attempts: summary.attempts,
        phrasesToRevisit: summary.phrasesToRevisit
      }
    });
    setXpAwarded(completion.xpAwarded);
    setTotalXp(completion.totalXp);
    track('card_finished', { cardId: card.id });
    onProgressUpdated();
    // The task completion write already persisted Results as the current step.
    moveToStep(5, false, true);
  };

  const resumeTask = () => {
    moveToStep(4, true, true);
  };

  const restartScenario = () => {
    saveCardProgress(card.id, { taskDraft: undefined });
    setTaskResult(null);
    setXpAwarded(0);
    setTotalXp(loadRewardProgress().totalXp);
    setTaskRun((run) => run + 1);
    completionGuardRef.current = false;
    moveToStep(0, true, true);
    onProgressUpdated();
  };

  const continueLabels = ['Start Dialogue →', 'Check Understanding →', 'Learn Key Phrases →', 'Begin Role-play →'];

  return (
    <div className="card-flow-container">
      {/* Top Header */}
      <header className="card-flow-header">
        <button
          type="button"
          className="btn-ghost"
          onClick={onBackToDeck}
          aria-label={`Return to ${returnToBrowseLabel.replace('Back to ', '')}`}
        >
          ← {returnToBrowseLabel.replace('Back to ', '')}
        </button>

        <StepDots totalSteps={LESSON_STEP_COUNT} currentStep={currentStep} />
        <span className="lesson-step-name">{STEP_NAMES[currentStep]}</span>
        <span className="lesson-card-icon" aria-hidden="true">{card.icon}</span>
      </header>

      {/* One vertical lesson step at a time; navigation controls own step changes. */}
      <main className="steps-scroller" ref={contentRef} aria-label="Lesson content">
        {/* Step 0: Scene */}
        <section className="step-slide" hidden={currentStep !== 0} aria-label="Step 1 of 6: Scene">
          {card.review.status !== 'approved' && (
            <div className="draft-banner">
              <span>⚠️</span>
              <span>Draft: being checked by native speakers</span>
            </div>
          )}

          <div className="step-header">
            <span className="step-badge">Step 1 of 6</span>
            <h2 className="step-title">{card.title}</h2>
            <p className="scene-learner-goal">{card.learnerGoal}</p>
          </div>

          <div className="scene-card-hero">
            <ScenarioArtwork card={card} variant="intro" isActive={currentStep === 0} />
            <div className="scene-hero-text">"{card.scene}"</div>
            <div style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
              Variety: <strong>{card.variety}</strong> · ~{card.minutes} mins
            </div>
          </div>

        </section>

        {/* Step 1: Listen */}
        <section className="step-slide" hidden={currentStep !== 1} aria-label="Step 2 of 6: Listen">
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
            <PlayAllButton lines={card.dialogue} scenarioId={card.id} />
          </div>

          <div className="chat-thread">
            {card.dialogue.map((line) => (
              <DialogueLine key={line.id} line={line} scenarioId={card.id} showEnglish={showEnglish} />
            ))}
          </div>

        </section>

        {/* Step 2: Understand */}
        <section className="step-slide" hidden={currentStep !== 2} aria-label="Step 3 of 6: Understand">
          <div className="step-header">
            <span className="step-badge">Step 3 of 6</span>
            <h2 className="step-title">Understand the conversation</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem' }}>
              Check what happened in the scene before practising your own responses. Retry any question; this check does not block the lesson.
            </p>
          </div>
          <ComprehensionCheck
            questions={card.comprehensionQuestions ?? []}
            onResult={(questionId, correct) => {
              const prior = progress[card.id]?.comprehensionResults ?? {};
              saveCardProgress(card.id, { comprehensionResults: { ...prior, [questionId]: correct } });
              onProgressUpdated();
            }}
          />
        </section>

        {/* Step 3: Key Phrases */}
        <section className="step-slide" hidden={currentStep !== 3} aria-label="Step 4 of 6: Key phrases">
          <div className="step-header">
            <span className="step-badge">Step 4 of 6</span>
            <h2 className="step-title">Key Phrases for the Task</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem' }}>
              Listen to useful phrases. Spoken/formal comparisons are contextual, not universal rules.
            </p>
          </div>

          <ChipRow chips={card.chips} />
          <PhraseList phrases={card.phrases} scenarioId={card.id} />

        </section>

        {/* Step 4: Task Test */}
        <section className="step-slide" hidden={currentStep !== 4} aria-label="Step 5 of 6: Task test">
          <div className="step-header">
            <span className="step-badge">Step 5 of 6</span>
            <h2 className="step-title">Task Test: Role-play</h2>
          </div>

          <TaskTest
            key={`${card.id}-${taskRun}`}
            card={card}
            onComplete={handleTaskComplete}
            isActive={currentStep === 4}
            initialDraft={taskRun === 0 ? existingProg?.taskDraft : undefined}
            onDraftChange={saveTaskDraft}
          />
        </section>

        {/* Step 5: Result */}
        <section className="step-slide" hidden={currentStep !== 5} aria-label="Step 6 of 6: Result">
          <div className="step-header">
            <span className="step-badge">Step 6 of 6</span>
            <h2 className="step-title">Summary</h2>
          </div>

          <ResultStep
            result={taskResult}
            scenarioTitle={card.title}
            taskGoal={card.task.goal}
            xpAwarded={xpAwarded}
            totalXp={totalXp}
            onResumeTask={resumeTask}
            onRestartScenario={restartScenario}
            onContinuePath={onContinuePath}
            onBackToDeck={onBackToDeck}
            returnToBrowseLabel={returnToBrowseLabel}
          />
        </section>
      </main>

      {currentStep < 5 && <footer className="card-flow-footer">
        <button
          type="button"
          className="btn-secondary"
          disabled={currentStep === 0}
          onClick={() => moveAdjacent(-1)}
          aria-label="Go back one lesson step"
        >
          ← Back
        </button>

        {currentStep < 4 ? <button type="button" className="btn-primary lesson-continue" onClick={() => moveAdjacent(1)}>
          {continueLabels[currentStep]}
        </button> : <span className="lesson-footer-note">Complete the role-play above to see your results</span>}
      </footer>}
    </div>
  );
};
