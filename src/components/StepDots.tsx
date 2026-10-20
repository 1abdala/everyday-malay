import React from 'react';

type StepDotsProps = {
  totalSteps: number;
  currentStep: number;
  onSelectStep: (stepIndex: number) => void;
};

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
  currentStep,
  onSelectStep
}) => {
  return (
    <div className="step-dots" role="tablist" aria-label="Card step progress">
      {Array.from({ length: totalSteps }).map((_, idx) => (
        <button
          key={idx}
          type="button"
          role="tab"
          aria-selected={idx === currentStep}
          aria-label={`Step ${idx + 1}: ${STEP_LABELS[idx] || `Step ${idx + 1}`}`}
          className={`step-dot ${idx === currentStep ? 'active' : ''}`}
          onClick={() => onSelectStep(idx)}
        />
      ))}
    </div>
  );
};
