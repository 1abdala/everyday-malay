import React, { useMemo, useState } from 'react';
import type { Card } from '../types';
import { AudioButtons } from '../components/AudioButtons';
import { loadSavedPhrases, savePhraseForReview } from '../lib/storage';

type StarterItem = { id: string; scenarioId: string; malay: string; english: string; group: string };

function selectPhrase(cards: Card[], phrase: string, scenarioId: string): StarterItem | undefined {
  const card = cards.find((item) => item.id === scenarioId);
  const item = card?.phrases.find((candidate) => candidate.ms === phrase);
  return item ? { id: item.id, scenarioId, malay: item.ms, english: item.en, group: '' } : undefined;
}

export const SurvivalMalay: React.FC<{ cards: Card[]; onFinish: () => void; onSkip: () => void }> = ({ cards, onFinish, onSkip }) => {
  const items = useMemo(() => [
    selectPhrase(cards, 'Ada plastik tak?', 'shop-01'),
    selectPhrase(cards, 'Nak resit.', 'shop-01'),
    selectPhrase(cards, 'Itu saja.', 'mamak-01'),
    selectPhrase(cards, 'Tu je.', 'mamak-01'),
    selectPhrase(cards, 'Ikut GPS je.', 'grab-01')
  ].filter(Boolean) as StarterItem[], [cards]);
  const thanksLine = cards.find((card) => card.id === 'shop-01')?.dialogue.find((line) => line.ms === 'Terima kasih.');
  const greetingLine = cards.find((card) => card.id === 'grab-01')?.dialogue[0];
  const [stage, setStage] = useState(0);
  const [selectedMeaning, setSelectedMeaning] = useState<string | null>(null);
  const [blocks, setBlocks] = useState<string[]>([]);
  const [saved, setSaved] = useState(() => loadSavedPhrases());
  const targetBlocks = ['Itu', 'saja.'];
  const blockCorrect = blocks.join(' ') === targetBlocks.join(' ');

  const save = (item: StarterItem) => {
    savePhraseForReview(item);
    setSaved(loadSavedPhrases());
  };

  return <main className="survival-screen" aria-labelledby="survival-title">
    <header className="survival-header"><span className="onboarding-eyebrow">A QUICK START · ABOUT 3–5 MINUTES</span><button type="button" className="btn-ghost" onClick={onSkip}>Skip starter</button></header>
    <section className="survival-panel">
      <div className="survival-progress" aria-label={`Starter step ${Math.min(stage + 1, 4)} of 4`}>STEP {Math.min(stage + 1, 4)} / 4 <span>{stage < 4 ? 'Survival Malay' : 'Ready for the Path'}</span></div>
      <h1 id="survival-title">Survival Malay</h1>
      <p className="survival-intro">A few reusable phrases for everyday exchanges. These phrases come from the current draft scenarios; they are not a complete phrase list.</p>
      <div className="survival-draft-note" role="note"><strong>Content review is still in progress.</strong> Word-by-word meanings are not shown until a reviewer approves each gloss. Asking about price and asking someone to repeat or slow down still need reviewed phrase content.</div>

      {stage === 0 && <section aria-labelledby="starter-phrases-title">
        <h2 id="starter-phrases-title">Useful phrases</h2>
        <div className="survival-groups">
          <div><strong>Greetings and polite openings</strong>{greetingLine ? <div className="survival-phrase"><span className="malay-text" lang="ms">{greetingLine.ms}</span><small className="english-text" lang="en">{greetingLine.en}</small><AudioButtons textToSpeak={greetingLine.ms} /></div> : <small>Phrase awaits content review.</small>}</div>
          <div><strong>Asking for something</strong>{items.slice(0, 2).map((item) => <span className="survival-phrase" key={item.id}><b className="malay-text" lang="ms">{item.malay}</b><small className="english-text" lang="en">{item.english}</small><AudioButtons textToSpeak={item.malay} /><button className="phrase-save-button" type="button" onClick={() => save(item)}>+ Save for review</button></span>)}</div>
          <div><strong>Asking about price</strong><small>Phrase awaits content review; no candidate is taught here.</small></div>
          <div><strong>Asking someone to repeat or speak more slowly</strong><small>Phrase awaits content review; no candidate is taught here.</small></div>
          <div><strong>Thanking someone</strong>{thanksLine ? <div className="survival-phrase"><span className="malay-text" lang="ms">{thanksLine.ms}</span><small className="english-text" lang="en">{thanksLine.en}</small><AudioButtons textToSpeak={thanksLine.ms} /></div> : <small>Phrase awaits content review.</small>}</div>
          <div><strong>Confirming or responding simply</strong>{items.slice(2).map((item) => <span className="survival-phrase" key={item.id}><b className="malay-text" lang="ms">{item.malay}</b><small className="english-text" lang="en">{item.english}</small><AudioButtons textToSpeak={item.malay} /><button className="phrase-save-button" type="button" onClick={() => save(item)}>+ Save for review</button></span>)}</div>
        </div>
        <p className="word-breakdown-pending">Word breakdown coming soon for these draft phrases.</p>
      </section>}

      {stage === 1 && <section className="survival-exercise"><span className="step-badge">LISTENING RECOGNITION</span><h2>What does “<span className="malay-text" lang="ms">Terima kasih</span>” mean?</h2><AudioButtons textToSpeak="Terima kasih." /><div className="survival-answer-options">{['Thank you.', 'Where is it?', 'How much is it?'].map((answer) => <button key={answer} type="button" className={selectedMeaning === answer ? 'is-selected' : ''} onClick={() => setSelectedMeaning(answer)}>{answer}</button>)}</div>{selectedMeaning && <p role="status">{selectedMeaning === 'Thank you.' ? 'That’s right. This phrase is used to thank someone.' : 'Not quite. Listen again and choose another answer.'}</p>}</section>}

      {stage === 2 && <section className="survival-exercise"><span className="step-badge">WORD BLOCKS</span><h2>Build the response meaning “That’s all.”</h2><p>Use the full beginner form first.</p><div className="survival-built" aria-live="polite">{blocks.length ? blocks.join(' ') : 'Choose the words in order'}</div><div className="survival-blocks">{targetBlocks.map((word) => <button type="button" key={word} disabled={blocks.includes(word)} onClick={() => setBlocks((current) => [...current, word])}>{word.replace('.', '')}</button>)}{blocks.length > 0 && <button type="button" onClick={() => setBlocks([])}>Start again</button>}</div>{blockCorrect && <p role="status">Correct: Itu saja. The shortened “Tu je” is presented after the full form in the Mamak lesson.</p>}</section>}

      {stage === 3 && <section className="survival-exercise"><span className="step-badge">GUIDED ROLE-PLAY</span><h2>The shop worker asks whether you want a receipt.</h2><div className="survival-answer-options">{['Nak resit.', 'Tak nak resit.', 'Ikut GPS je.'].map((answer) => <button type="button" key={answer} lang="ms" className={`malay-text ${selectedMeaning === answer ? 'is-selected' : ''}`} onClick={() => setSelectedMeaning(answer)}>{answer}</button>)}</div>{selectedMeaning && <p role="status">{selectedMeaning === 'Nak resit.' || selectedMeaning === 'Tak nak resit.' ? 'This response is relevant to the receipt question.' : 'That phrase belongs in a different situation.'}</p>}</section>}

      {stage === 4 && <section className="survival-exercise"><span className="step-badge">STARTER SUMMARY</span><h2>Ready to explore real situations</h2><p>You saved {saved.length} phrase{saved.length === 1 ? '' : 's'} for review.</p><ul>{saved.map((phrase) => <li key={phrase.id}><span className="malay-text" lang="ms">{phrase.malay}</span> — <span className="english-text" lang="en">{phrase.english}</span></li>)}</ul><p>This is guided practice, not a language ability score.</p></section>}

      <footer className="survival-actions">
        {stage > 0 && stage < 4 && <button type="button" className="btn-secondary" onClick={() => { setStage((value) => value - 1); setSelectedMeaning(null); }}>← Back</button>}
        {stage < 4 ? <button type="button" className="btn-primary" disabled={stage === 1 && selectedMeaning !== 'Thank you.' || stage === 2 && !blockCorrect || stage === 3 && !['Nak resit.', 'Tak nak resit.'].includes(selectedMeaning ?? '')} onClick={() => { setStage((value) => value + 1); setSelectedMeaning(null); }}>{stage === 0 ? 'Start the quick checks →' : stage === 3 ? 'Finish starter →' : 'Continue →'}</button> : <button type="button" className="btn-primary" onClick={onFinish}>Go to the learning Path →</button>}
      </footer>
    </section>
  </main>;
};
