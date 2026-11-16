import React from 'react';
import type { TaskSummaryResult } from './TaskTest';

type ResultStepProps = {
  result: TaskSummaryResult | null;
  scenarioTitle: string;
  taskGoal: string;
  xpAwarded: number;
  totalXp: number;
  onResumeTask: () => void;
  onRestartScenario: () => void;
  onContinuePath: () => void;
  onBackToDeck: () => void;
  returnToBrowseLabel: string;
};

export const ResultStep: React.FC<ResultStepProps> = ({
  result,
  scenarioTitle,
  taskGoal,
  xpAwarded,
  totalXp,
  onResumeTask,
  onRestartScenario,
  onContinuePath,
  onBackToDeck,
  returnToBrowseLabel
}) => {
  if (!result) {
    return (
      <div className="result-card em-result-card">
        <span className="result-kicker">ROLE-PLAY IN PROGRESS</span>
        <div className="result-heading"><span className="result-icon" aria-hidden="true">↗</span><div><h2>Finish the conversation</h2><p>Complete the final role-play turn to save your result and completion reward.</p></div></div>
        <div className="result-actions">
          <button type="button" className="btn-primary" onClick={onContinuePath}>Continue on Path →</button>
          <button type="button" className="btn-secondary" onClick={onResumeTask}>Resume role-play</button>
          <button type="button" className="btn-ghost" onClick={onBackToDeck}>← {returnToBrowseLabel}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="result-card em-result-card">
      <span className="result-kicker">{result.phrasesToRevisit.length > 0 ? 'PRACTICE COMPLETE · REVIEW SUGGESTED' : result.assisted > 0 || result.withHint > 0 ? 'PRACTICED WITH SUPPORT' : 'COMPLETED PRACTICE'}</span>
      <div className="result-heading"><span className="result-icon" aria-hidden="true">✓</span><div><h2>{scenarioTitle}</h2><p>{result.assisted > 0 || result.withHint > 0 ? 'You completed this practice with support in some responses. Revisit the phrases below to build confidence.' : 'You completed this role-play practice.'}</p></div></div>
      <section className="result-practice"><span>WHAT YOU PRACTICED</span><p>{taskGoal}</p></section>

      <div className="result-stats-grid" aria-label="Role-play result">
        <div className="stat-box"><span className="stat-number">{result.firstTry}/{result.turns}</span><span className="stat-label">First try</span></div>
        <div className="stat-box"><span className="stat-number">{result.withHint}</span><span className="stat-label">With hint</span></div>
        <div className="stat-box"><span className="stat-number">{result.assisted}</span><span className="stat-label">Assisted</span></div>
      </div>
      {xpAwarded > 0 && <div className="result-xp-award" role="status"><strong>+{xpAwarded} XP</strong><span>Completion reward, not a measure of language ability</span></div>}
      <p className="result-xp-total">Your XP total <strong>{totalXp} XP</strong></p>
      <p className="result-xp-total">XP rewards finishing practice; it does not measure how well you speak Malay.</p>

      {result.phrasesToRevisit.length > 0 && <section className="result-revisit"><strong>Phrases to revisit</strong><ul>{result.phrasesToRevisit.map((phrase, idx) => <li key={`${phrase}-${idx}`}>{phrase}</li>)}</ul></section>}

      <div className="result-actions">
        <button type="button" className="btn-primary" onClick={onContinuePath}>Continue on Path →</button>
        <button type="button" className="btn-secondary" onClick={onRestartScenario}>↻ Restart from scene</button>
        <button type="button" className="btn-ghost" onClick={onBackToDeck}>← {returnToBrowseLabel}</button>
      </div>
    </div>
  );
};
