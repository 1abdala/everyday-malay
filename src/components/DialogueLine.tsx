import React, { useEffect, useState } from 'react';
import type { DialogueLine as DialogueLineType } from '../types';
import { AudioButtons } from './AudioButtons';

type DialogueLineProps = {
  line: DialogueLineType;
  showEnglish: boolean;
  scenarioId?: string;
};

export const DialogueLine: React.FC<DialogueLineProps> = ({ line, showEnglish, scenarioId }) => {
  const isYou = line.who === 'you';
  const [revealed, setRevealed] = useState(showEnglish);
  useEffect(() => setRevealed(showEnglish), [showEnglish]);

  return (
    <div className={`chat-bubble-row ${isYou ? 'you' : 'npc'}`}>
      <div className={`chat-bubble ${isYou ? 'you' : 'npc'}`}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.8, textTransform: 'uppercase' }}>
            {isYou ? 'You' : 'Worker / Driver'}
          </span>
        </div>

        <div className="bubble-text-ms">{line.ms}</div>

        <button type="button" className="dialogue-translation-toggle" aria-expanded={revealed} onClick={() => setRevealed((value) => !value)}>
          {revealed ? 'Hide English' : 'Show English meaning'}
        </button>
        {revealed && <div className="bubble-text-en">{line.en}</div>}

        <div className="bubble-audio-actions">
          <AudioButtons
            audioId={scenarioId ? `${scenarioId}_${line.id}` : undefined}
            scenarioId={scenarioId}
            normalSrc={line.audio?.normal}
            slowSrc={line.audio?.slow}
            textToSpeak={line.ms}
          />
        </div>
      </div>
    </div>
  );
};
