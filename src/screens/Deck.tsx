import React from 'react';
import type { Card, ProgressMap } from '../types';

type DeckProps = {
  cards: Card[];
  progress: ProgressMap;
  onSelectCard: (cardId: string) => void;
  onOpenSettings: () => void;
};

export const Deck: React.FC<DeckProps> = ({
  cards,
  progress,
  onSelectCard,
  onOpenSettings
}) => {
  return (
    <div className="deck-view">
      {/* Header */}
      <header className="app-header" style={{ margin: '-20px -20px 10px -20px' }}>
        <div className="brand-title">
          <span>🇲🇾</span>
          <span>Everyday Malay</span>
        </div>
        <button
          type="button"
          className="header-action-btn"
          onClick={onOpenSettings}
          aria-label="Settings and progress export"
        >
          ⚙️ Settings
        </button>
      </header>

      {/* Intro */}
      <div className="deck-intro">
        <h1>Spoken Malay Scenarios</h1>
        <p>
          Master colloquial everyday Malay (bahasa pasar) with native audio role-plays.
        </p>
      </div>

      {/* Cards list */}
      <div className="deck-list">
        {cards.map((card) => {
          const cardProg = progress[card.id];
          const isDraft = card.review?.status !== 'approved';

          let statusClass = 'badge-not-started';
          let statusText = 'Not started';

          if (cardProg?.finished) {
            statusClass = 'badge-done';
            statusText = 'Done ✓';
          } else if (cardProg?.started) {
            statusClass = 'badge-in-progress';
            statusText = 'In progress';
          }

          return (
            <button
              key={card.id}
              type="button"
              className="deck-card"
              onClick={() => onSelectCard(card.id)}
              aria-label={`Open scenario: ${card.title}`}
            >
              {isDraft && (
                <div className="draft-banner" style={{ margin: 0, padding: '4px 8px' }}>
                  <span>⚠️</span>
                  <span>Draft: being checked by native speakers</span>
                </div>
              )}

              <div className="deck-card-top">
                <div className="card-title-group">
                  <h2>{card.title}</h2>
                  <p className="card-scene">{card.scene}</p>
                </div>
                <div className="card-icon">{card.icon}</div>
              </div>

              <div className="card-meta-row">
                <span className={`badge-status ${statusClass}`}>{statusText}</span>
                <span>⏱️ ~{card.minutes} min</span>
                <span>🗣️ {card.variety}</span>

                {cardProg?.bestTask && (
                  <span style={{ marginLeft: 'auto', fontWeight: 600, color: 'var(--color-primary)' }}>
                    Best: {cardProg.bestTask.firstTry}/{cardProg.bestTask.turns} 1st-try
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
