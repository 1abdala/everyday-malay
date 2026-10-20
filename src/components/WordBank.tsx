import React, { useMemo } from 'react';
import type { Card } from '../types';

type WordBankProps = {
  card: Card;
  modelAnswer: string;
  selectedWords: { id: string; word: string }[];
  onSelectedWordsChange: (words: { id: string; word: string }[]) => void;
  disabled?: boolean;
};

/**
 * Extracts candidate distractor words strictly from the same card's content.
 */
function extractCardDistractors(card: Card, excludeWords: Set<string>): string[] {
  const words = new Set<string>();

  const addText = (text: string) => {
    const tokens = text
      .toLowerCase()
      .replace(/[.,!?'"()]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 1 && !w.includes('_'));
    tokens.forEach((t) => {
      if (!excludeWords.has(t)) {
        words.add(t);
      }
    });
  };

  card.dialogue.forEach((d) => addText(d.ms));
  card.chips.forEach((c) => {
    addText(c.spoken);
    addText(c.formal);
  });
  card.phrases.forEach((p) => addText(p.ms));

  return Array.from(words);
}

export const WordBank: React.FC<WordBankProps> = ({
  card,
  modelAnswer,
  selectedWords,
  onSelectedWordsChange,
  disabled
}) => {
  // Generate word tiles from model answer + 2 distractors from card
  const tiles = useMemo(() => {
    const rawTokens = modelAnswer
      .replace(/[.,!?'"()]/g, ' ')
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    const modelWordsSet = new Set(rawTokens.map((w) => w.toLowerCase()));
    const candidateDistractors = extractCardDistractors(card, modelWordsSet);

    // Pick 2 distractors from available candidates
    const distractors: string[] = [];
    if (candidateDistractors.length > 0) {
      distractors.push(candidateDistractors[0]);
    }
    if (candidateDistractors.length > 1) {
      distractors.push(candidateDistractors[1]);
    }

    const all = [...rawTokens, ...distractors];

    // Deterministic shuffle based on characters to avoid jitter on rerenders
    const indexed = all.map((word, i) => ({ id: `${i}-${word}`, word }));
    return indexed.sort((a, b) => {
      const hashA = a.word.charCodeAt(0) + a.id.length * 3;
      const hashB = b.word.charCodeAt(0) + b.id.length * 3;
      return hashA - hashB;
    });
  }, [card, modelAnswer]);

  const selectedIds = new Set(selectedWords.map((t) => t.id));

  const handleTileClick = (tile: { id: string; word: string }) => {
    if (disabled) return;
    if (selectedIds.has(tile.id)) return;
    onSelectedWordsChange([...selectedWords, tile]);
  };

  const handleRemoveTile = (indexToRemove: number) => {
    if (disabled) return;
    onSelectedWordsChange(selectedWords.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="word-bank-container">
      <div className="word-bank-selected" aria-label="Selected words for answer">
        {selectedWords.length === 0 ? (
          <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
            Tap word tiles below to compose your answer...
          </span>
        ) : (
          selectedWords.map((tile, idx) => (
            <button
              key={`${tile.id}-sel-${idx}`}
              type="button"
              className="word-tile selected"
              onClick={() => handleRemoveTile(idx)}
              disabled={disabled}
              title="Tap to remove"
            >
              {tile.word} ✕
            </button>
          ))
        )}
      </div>

      <div className="word-bank-pool" aria-label="Available word tiles">
        {tiles.map((tile) => {
          const isUsed = selectedIds.has(tile.id);
          return (
            <button
              key={tile.id}
              type="button"
              className={`word-tile ${isUsed ? 'used' : ''}`}
              onClick={() => handleTileClick(tile)}
              disabled={disabled || isUsed}
            >
              {tile.word}
            </button>
          );
        })}
      </div>
    </div>
  );
};
