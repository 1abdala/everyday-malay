import React from 'react';
import type { DialogueLine as DialogueLineType } from '../types';
import { AudioButtons } from './AudioButtons';

type DialogueLineProps = {
  line: DialogueLineType;
  showEnglish: boolean;
};

export const DialogueLine: React.FC<DialogueLineProps> = ({ line, showEnglish }) => {
  const isYou = line.who === 'you';

  return (
    <div className={`chat-bubble-row ${isYou ? 'you' : 'npc'}`}>
      <div className={`chat-bubble ${isYou ? 'you' : 'npc'}`}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.8, textTransform: 'uppercase' }}>
            {isYou ? 'You' : 'Worker / Driver'}
          </span>
        </div>

        <div className="bubble-text-ms">{line.ms}</div>

        {showEnglish && <div className="bubble-text-en">{line.en}</div>}

        <div className="bubble-audio-actions">
          <AudioButtons
            normalSrc={line.audio?.normal}
            slowSrc={line.audio?.slow}
            textToSpeak={line.ms}
          />
        </div>
      </div>
    </div>
  );
};
