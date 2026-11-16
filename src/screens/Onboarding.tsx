import React from 'react';
import { isPersistentStorageAvailable } from '../lib/storage';

type OnboardingProps = {
  onStart: () => void;
  onSkip: () => void;
};

export const OnboardingScreen: React.FC<OnboardingProps> = ({ onStart, onSkip }) => {
  const storageAvailable = isPersistentStorageAvailable();
  return (
  <main className="onboarding-screen" aria-labelledby="onboarding-title">
    <div className="onboarding-device-status" aria-hidden="true"><span>everydaymalay ✳</span><span>01 / 01</span></div>
    <section className="onboarding-card">
      <span className="onboarding-eyebrow">A PRACTICAL START</span>
      <h1 id="onboarding-title">Learn practical Malay for everyday situations in Malaysia.</h1>
      <p className="onboarding-intro">Short scenes help you practise the words you may need at a shop, mamak stall, or on a ride.</p>

      <div className="onboarding-flow" aria-label="Lesson flow">
        <span>Listen</span><i aria-hidden="true">→</i><span>Understand</span><i aria-hidden="true">→</i><span>Practise</span><i aria-hidden="true">→</i><span>Role-play</span>
      </div>

      <div className="onboarding-support">
        <strong>Hints and word blocks are learning support.</strong>
        <p>Use them while you build confidence. They are not a failure.</p>
      </div>

      <p className="onboarding-privacy">Your progress is stored locally in this browser. It does not sync to another browser or device.</p>
      {!storageAvailable && <p className="storage-warning" role="alert">This browser cannot save data reliably right now. Progress may only remain until this page closes.</p>}
      <div className="onboarding-actions">
        <button type="button" className="btn-primary" onClick={onStart}>Start learning <span aria-hidden="true">→</span></button>
        <button type="button" className="btn-ghost" onClick={onSkip}>Skip for now</button>
      </div>
    </section>
  </main>
  );
};
