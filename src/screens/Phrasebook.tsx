import React, { useState } from 'react';
import type { Card } from '../types';
import { loadSavedPhrases, removeSavedPhrase } from '../lib/storage';

export const Phrasebook: React.FC<{ cards: Card[]; onBack: () => void }> = ({ cards, onBack }) => {
  const [phrases, setPhrases] = useState(loadSavedPhrases);
  const titles = new Map(cards.map((card) => [card.id, card.title]));
  return <main className="phrasebook-screen" aria-labelledby="phrasebook-title">
    <header className="app-header"><button type="button" className="btn-ghost" onClick={onBack}>← Back</button><h1 id="phrasebook-title">Phrasebook</h1><span /></header>
    <p className="setting-desc">Saved phrases are stored locally in this browser for quick reference.</p>
    {phrases.length === 0 ? <section className="phrasebook-empty"><h2>No saved phrases yet</h2><p>Open a scenario’s Key Phrases step and choose “Save for review.”</p></section> : <div className="saved-phrase-list">{phrases.map((phrase) => <article className="saved-phrase" key={phrase.id}>
      <strong>{phrase.malay}</strong><span>{phrase.english}</span><small>{titles.get(phrase.scenarioId) ?? phrase.scenarioId}</small>
      <button type="button" className="btn-ghost" aria-label={`Remove ${phrase.malay} from phrasebook`} onClick={() => { removeSavedPhrase(phrase.id); setPhrases((current) => current.filter((item) => item.id !== phrase.id)); }}>Remove</button>
    </article>)}</div>}
  </main>;
};
