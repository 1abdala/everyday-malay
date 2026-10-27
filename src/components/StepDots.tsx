import React from 'react';

type StepDotsProps = { totalSteps: number; currentStep: number };

const STEP_LABELS = [
  'Scene',
  'Listen',
  'Say it like locals',
  'Key phrases',
  'Task test',
  'Result'
];

export const StepDots: React.FC<StepDotsProps> = ({
  totalSteps,
  currentStep
}) => {
  return (
    <div className="step-dots" role="progressbar" aria-label={`${STEP_LABELS[currentStep] ?? 'Lesson'} step`} aria-valuemin={1} aria-valuemax={totalSteps} aria-valuenow={currentStep + 1}>
      {Array.from({ length: totalSteps }).map((_, idx) => (
        <span
          key={idx}
          aria-hidden="true"
          className={`step-dot ${idx <= currentStep ? 'is-reached' : ''} ${idx === currentStep ? 'active' : ''}`}
        />
      ))}
      <span className="step-count-label">{String(currentStep + 1).padStart(2, '0')} / {String(totalSteps).padStart(2, '0')}</span>
    </div>
  );
};
