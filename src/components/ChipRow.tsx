import React from 'react';
import type { Chip } from '../types';

type ChipRowProps = {
  chips: Chip[];
};

export const ChipRow: React.FC<ChipRowProps> = ({ chips }) => {
  return (
    <div className="chips-list">
      {chips.map((chip, idx) => (
        <div key={idx} className="chip-card">
          <div className="chip-pair">
            <div className="pill-spoken" title="Spoken / Bahasa pasar form">
              <span>🗣️</span>
              <span className="malay-text" lang="ms">{chip.spoken}</span>
            </div>
            <span className="chip-vs">vs</span>
            <div className="pill-formal" title="Formal / Textbook Malay form">
              <span className="malay-text" lang="ms">📖 {chip.formal}</span>
            </div>
          </div>
          <div className="chip-note english-text" lang="en">{chip.note}</div>
        </div>
      ))}
    </div>
  );
};
