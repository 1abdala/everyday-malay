import React from 'react';
import type { TaskSummaryResult } from './TaskTest';

type ResultStepProps = {
  result: TaskSummaryResult | null;
  onRetryTask: () => void;
  onNextCard: () => void;
  onBackToDeck: () => void;
  hasNextCard: boolean;
};

export const ResultStep: React.FC<ResultStepProps> = ({
  result,
  onRetryTask,
  onNextCard,
  onBackToDeck,
  hasNextCard
}) => {
  if (!result) {
    return (
      <div className="result-card">
        <div className="result-icon">⏳</div>
        <h2>Task Not Yet Completed</h2>
        <p style={{ color: 'var(--color-text-muted)' }}>
          Swipe back or tap "Task test" to complete the spoken role-play first!
        </p>
        <div className="result-actions">
          <button type="button" className="btn-primary" onClick={onRetryTask}>
            Go to Task test
          </button>
          <button type="button" className="btn-secondary" onClick={onBackToDeck}>
            Back to deck
          </button>
        </div>
      </div>
    );
  }

  const isFlawless = result.firstTry === result.turns;

  return (
    <div className="result-card">
      <div className="result-icon">{isFlawless ? '🌟' : '🎉'}</div>

      <div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '6px' }}>
          {isFlawless ? 'Tahniah! Perfect run!' : 'Task Completed!'}
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
          {isFlawless
            ? 'You cleared every turn on your first attempt.'
            : 'Great job practicing colloquial Malaysian Malay in real life.'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="result-stats-grid">
        <div className="stat-box">
          <span className="stat-number">{result.firstTry}</span>
          <span className="stat-label">First try</span>
        </div>
        <div className="stat-box">
          <span className="stat-number">{result.withHint}</span>
          <span className="stat-label">With hint</span>
        </div>
        <div className="stat-box">
          <span className="stat-number">{result.assisted}</span>
          <span className="stat-label">Assisted</span>
        </div>
      </div>

      {/* Phrases to revisit if any */}
      {result.phrasesToRevisit.length > 0 && (
        <div style={{ textAlign: 'left', background: 'var(--color-surface-subtle)', padding: '14px', borderRadius: 'var(--border-radius-md)' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
            Phrases to revisit:
          </div>
          <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.92rem' }}>
            {result.phrasesToRevisit.map((phrase, idx) => (
              <li key={idx}>
                <strong>{phrase}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="result-actions">
        {hasNextCard && (
          <button type="button" className="btn-primary" onClick={onNextCard}>
            Next card →
          </button>
        )}

        <button type="button" className="btn-secondary" onClick={onRetryTask}>
          🔄 Retry task
        </button>

        <button type="button" className="btn-ghost" onClick={onBackToDeck}>
          ← Back to deck
        </button>
      </div>
    </div>
  );
};
