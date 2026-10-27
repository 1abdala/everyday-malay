import React, { useMemo, useState } from 'react';
import type { Card, ProgressMap } from '../types';

type DeckProps = {
  cards: Card[];
  progress: ProgressMap;
  onSelectCard: (cardId: string) => void;
  onOpenSettings: () => void;
};

const categoryFor = (card: Card) => card.id.startsWith('mamak') ? 'Eat & drink' : card.id.startsWith('grab') ? 'Getting around' : 'Everyday errands';

export const Deck: React.FC<DeckProps> = ({ cards, progress, onSelectCard, onOpenSettings }) => {
  const [category, setCategory] = useState('All scenes');
  const categories = ['All scenes', ...Array.from(new Set(cards.map(categoryFor)))];
  const visibleCards = useMemo(() => category === 'All scenes' ? cards : cards.filter((card) => categoryFor(card) === category), [cards, category]);
  const resumeCard = cards
    .filter((card) => progress[card.id]?.started && !progress[card.id]?.finished)
    .sort((a, b) => (progress[b.id]?.updatedAt ?? 0) - (progress[a.id]?.updatedAt ?? 0))[0];
  const finished = cards.filter((card) => progress[card.id]?.finished).length;

  return (
    <main className="deck-view field-guide">
      <header className="field-header">
        <a className="field-brand" href="#home" aria-label="Everyday Malay home"><span className="brand-stamp">em</span><span>everyday<br />malay</span></a>
        <div className="header-note">A little more local,<br />one conversation at a time.</div>
        <button type="button" className="settings-link" onClick={onOpenSettings} aria-label="Settings and progress">Settings <span aria-hidden="true">↗</span></button>
      </header>

      <section className="field-hero" id="home">
        <div className="hero-copy">
          <p className="eyebrow"><span className="live-dot" /> THE EVERYDAY FIELD GUIDE <span className="eyebrow-rule" /></p>
          <h1>Find your<br /><em>everyday</em> Malay.</h1>
          <p className="hero-description">The words for right here, right now. Practise the little conversations that make life in Malaysia feel like yours.</p>
          {resumeCard ? (
            <button className="hero-cta" onClick={() => onSelectCard(resumeCard.id)}>Pick up where you left off <span>→</span></button>
          ) : (
            <a className="hero-cta" href="#scenes">Choose your first scene <span>↓</span></a>
          )}
        </div>
        <div className="hero-art" aria-label="Illustration of a mamak tea glass and roti canai" role="img">
          <div className="art-sun" /><div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
          <span className="art-note note-top">kopi tarik<br />& good chat</span>
          <div className="tea-glass"><div className="tea-top" /><div className="tea-liquid" /><div className="tea-foam" /><div className="tea-straw" /></div>
          <div className="roti-plate"><div className="roti roti-one" /><div className="roti roti-two" /><div className="roti roti-three" /></div>
          <span className="art-note note-bottom">jumpa lagi <b>✳</b></span>
          <span className="art-label">01 / mamak mornings</span>
        </div>
        <div className="hero-caption"><span>01—03</span><span>Small talk. Real life.</span><span>Kuala Lumpur · Malaysia</span></div>
      </section>

      <section className="progress-strip" aria-label="Your learning progress">
        <div className="progress-intro"><span className="strip-kicker">YOUR FIELD NOTES</span><strong>{finished} <small>/ {cards.length}</small></strong><span>scenes completed</span></div>
        <div className="progress-track" aria-label={`${finished} of ${cards.length} scenes completed`}><span style={{ width: `${cards.length ? (finished / cards.length) * 100 : 0}%` }} /></div>
        <p>{resumeCard ? <>Last visit: <b>{resumeCard.title}</b></> : <>Your first conversation is waiting.<br /><b>No streaks. Just useful Malay.</b></>}</p>
      </section>

      <section className="scene-section" id="scenes">
        <div className="section-heading"><div><p className="eyebrow">OUT IN THE WORLD</p><h2>Where to today<span className="period">?</span></h2></div><span className="scene-count">{visibleCards.length.toString().padStart(2, '0')} SCENES</span></div>
        <nav className="category-row" aria-label="Filter scenarios">
          {categories.map((item) => <button key={item} className={category === item ? 'category-chip is-active' : 'category-chip'} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}
        </nav>
        <div className="scene-grid">
          {visibleCards.map((card, index) => {
            const cardProgress = progress[card.id];
            const state = cardProgress?.finished ? 'Done' : cardProgress?.started ? 'In progress' : 'New scene';
            const palette = card.id.startsWith('mamak') ? 'mamak' : card.id.startsWith('grab') ? 'grab' : 'shop';
            return (
              <button key={card.id} type="button" className={`scene-card scene-${palette}`} onClick={() => onSelectCard(card.id)} aria-label={`Open scenario: ${card.title}`}>
                <div className="scene-card-top"><span className="scene-number">SCENE {String(index + 1).padStart(2, '0')}</span><span className="scene-arrow" aria-hidden="true">↗</span></div>
                <div className={`scene-illustration illustration-${palette}`} aria-hidden="true"><span className="illustration-halo" />{palette === 'mamak' ? <><span className="ill-steam">〰</span><span className="ill-cup">▰</span><span className="ill-roti">◉</span><span className="ill-spark">✳</span></> : palette === 'grab' ? <><span className="ill-road">〰</span><span className="ill-car">▰</span><span className="ill-pin">●</span><span className="ill-spark">✳</span></> : <><span className="ill-bag">▱</span><span className="ill-bottle">▯</span><span className="ill-spark">✳</span></>}</div>
                <div className="scene-card-copy"><span className="scene-category">{categoryFor(card)}</span><h3>{card.title}</h3><p>{card.scene}</p><div className="scene-card-footer"><span className="scene-state"><i className={cardProgress?.started ? 'state-dot has-progress' : 'state-dot'} />{state}</span><span>About {card.minutes} min <b>→</b></span></div></div>
                {card.review?.status !== 'approved' && <span className="draft-note">Draft · awaiting local review</span>}
              </button>
            );
          })}
        </div>
      </section>
      <footer className="field-footer"><span className="brand-stamp footer-stamp">em</span><span>Made for the conversations just around the corner.</span><span>Bahasa pasar, for real life.</span></footer>
    </main>
  );
};
