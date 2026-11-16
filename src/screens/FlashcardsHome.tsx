import React, { useMemo, useState } from 'react';
import type { Card, ProgressMap } from '../types';
import { getPathProgress, getScenarioDisplayStatus, getScenarioNumber, PLANNED_CHAPTERS, STARTER_CHAPTER } from '../lib/learningPath';
import { getScenarioArtwork } from '../lib/scenarioArtwork';
import { ScenarioArtwork } from '../components/ScenarioArtwork';
import './flashcards-home.css';

type BrowseTab = 'path' | 'explore';

type FlashcardsHomeProps = {
  cards: Card[];
  progress: ProgressMap;
  initialTab: BrowseTab;
  onActiveTabChange: (tab: BrowseTab) => void;
  onSelectCard: (cardId: string, sourceTab: BrowseTab) => void;
  onOpenSettings: () => void;
  onOpenSurvival: () => void;
  onOpenPhrasebook: () => void;
};

function SceneStatus({ card, progress, isRecommended }: { card: Card; progress: ProgressMap; isRecommended: boolean }) {
  const status = getScenarioDisplayStatus(progress, card.id, isRecommended);
  const labels = { completed: 'Completed', 'in-progress': 'In progress', 'up-next': 'Up next', ready: 'Ready when you are' };
  const stateClass = status === 'completed' ? 'is-done' : status === 'in-progress' ? 'is-started' : '';
  return <span id={`scenario-status-${card.id}`} className={`flash-status ${stateClass}`}><i />{labels[status]}</span>;
}

export const FlashcardsHome: React.FC<FlashcardsHomeProps> = ({ cards, progress, initialTab, onActiveTabChange, onSelectCard, onOpenSettings, onOpenSurvival, onOpenPhrasebook }) => {
  const [activeTab, setActiveTab] = useState<BrowseTab>(initialTab);
  const selectTab = (tab: BrowseTab) => {
    setActiveTab(tab);
    onActiveTabChange(tab);
  };
  const pathProgress = useMemo(() => getPathProgress(cards, progress), [cards, progress]);
  const { recommendedCard, completedCount, isChapterScenarioComplete } = pathProgress;

  const renderSceneCard = (card: Card, index: number, isRecommended: boolean) => {
    const detail = getScenarioArtwork(card.id);
    return <button
      key={card.id}
      type="button"
      className={`flash-card flash-card-${index % 3} flash-card-${detail.art} ${isRecommended ? 'is-recommended' : ''}`}
      onClick={() => onSelectCard(card.id, activeTab)}
      aria-label={`Open scenario: ${card.title}`}
      aria-describedby={`scenario-status-${card.id}`}
    >
      <span className="flash-card-number">{String(getScenarioNumber(cards, card.id) ?? index + 1).padStart(2, '0')}</span>
      <span className="flash-card-content">
        <span className="flash-category">{detail.category}</span>
        <strong>{card.title}</strong>
        <small>{card.scene}</small>
        <span className="flash-time">{card.minutes} MIN <i>↗</i></span>
      </span>
      <ScenarioArtwork card={card} variant="card" />
      <SceneStatus card={card} progress={progress} isRecommended={isRecommended} />
    </button>;
  };

  return <main className="flashcards-home">
    <div className="flashcards-shell dark-flash">
      <div className="device-status"><span>9:41</span><span>● ● ● ▰</span></div>
      <header className="app-masthead flash-masthead">
        <a className="wordmark-flash" href="#flash-home">everyday<span>malay</span><i>✳</i></a>
        <button type="button" className="flash-avatar" onClick={onOpenSettings} aria-label="Open settings">Y</button>
      </header>

      {activeTab === 'path' ? <>
        <section className="flash-welcome" id="flash-home">
          <span className="flash-label">YOUR GUIDED LEARNING PATH</span>
          <h1>Start with<br /><em>real life.</em></h1>
          <p>Small conversations. More confidence out there.</p>
        </section>

        <section className="chapter-panel" aria-labelledby="chapter-title">
          <div className="chapter-kicker"><span>CHAPTER {String(STARTER_CHAPTER.number).padStart(2, '0')}</span><span>STARTER CHAPTER</span></div>
          <h2 id="chapter-title">{STARTER_CHAPTER.title}</h2>
          <p>{STARTER_CHAPTER.objective}</p>
          <div className="chapter-progress-copy"><strong>{completedCount} of {cards.length} scenes completed</strong><span>{Math.round((completedCount / Math.max(cards.length, 1)) * 100)}%</span></div>
          <div className="chapter-progress-track" role="progressbar" aria-label="Starter chapter scenario progress" aria-valuemin={0} aria-valuemax={cards.length} aria-valuenow={completedCount}>
            <span style={{ width: `${(completedCount / Math.max(cards.length, 1)) * 100}%` }} />
          </div>
        </section>

        <button type="button" className="survival-entry" onClick={onOpenSurvival}>
          <span className="survival-entry-mark" aria-hidden="true">Aa</span>
          <span><strong>Survival Malay</strong><small>A quick phrase starter · about 3–5 minutes</small></span>
          <i aria-hidden="true">→</i>
        </button>

        <button
          type="button"
          className="flash-progress path-resume"
          disabled={!recommendedCard}
          onClick={() => recommendedCard && onSelectCard(recommendedCard.id, 'path')}
          aria-label={recommendedCard ? `${progress[recommendedCard.id]?.started ? 'Resume' : 'Start'} ${recommendedCard.title}` : 'All starter chapter scenarios completed'}
        >
          <span className="progress-orbit"><b>{completedCount}</b><small>/{cards.length}</small></span>
          <span className="flash-progress-copy">
            <strong>{recommendedCard ? (progress[recommendedCard.id]?.started ? 'Pick up where you left off' : 'Your next conversation') : 'All chapter scenes complete'}</strong>
            <span>{recommendedCard?.title ?? 'Chapter challenge is a planned next step'}</span>
          </span>
          <i>{recommendedCard ? '↗' : '✓'}</i>
        </button>

        <section className="flash-deck path-deck">
          <div className="flash-deck-heading"><h2>Chapter scenes</h2><span>{cards.length} AVAILABLE</span></div>
          {cards.map((card, index) => renderSceneCard(card, index, card.id === recommendedCard?.id))}
          <div className="chapter-milestone">
            <span className="milestone-mark">✳</span>
            <div><span className="milestone-kicker">NEXT MILESTONE</span><strong>{isChapterScenarioComplete ? 'Chapter challenge — planned' : 'Finish all 3 scenes'}</strong><small>{isChapterScenarioComplete ? 'The practical chapter challenge is part of the next progression phase.' : 'Complete each scene to reach the chapter challenge.'}</small></div>
          </div>
          <section className="planned-chapters" aria-labelledby="planned-title">
            <div className="planned-heading"><h2 id="planned-title">Coming later</h2><span>{PLANNED_CHAPTERS.length} PLANNED</span></div>
            <div className="planned-grid" aria-label="Planned future chapters">
              {PLANNED_CHAPTERS.map((title) => <div className="planned-chapter" key={title}><strong>{title}</strong><small>Planned</small></div>)}
            </div>
          </section>
        </section>
      </> : <>
        <section className="flash-welcome explore-welcome" id="flash-home">
          <span className="flash-label">PRACTICE WHAT YOU NEED</span>
          <h1>Explore<br /><em>scenarios.</em></h1>
          <p>Every available scene is open for independent practice.</p>
        </section>
        <section className="flash-deck explore-deck">
          <div className="flash-deck-heading"><h2>Available scenes</h2><span>{cards.length} TO PRACTICE</span></div>
          {cards.map((card, index) => renderSceneCard(card, index, false))}
          <p className="explore-note">Explore practice is always available. It adds to your saved scenario progress while your guided chapter continues in Path.</p>
        </section>
      </>}

      <nav className="app-tabbar flash-tabbar" aria-label="Main navigation">
        <button type="button" className={activeTab === 'path' ? 'tab-active' : ''} onClick={() => selectTab('path')} aria-current={activeTab === 'path' ? 'page' : undefined}><span>⌁</span><small>Path</small></button>
        <button type="button" className={activeTab === 'explore' ? 'tab-active' : ''} onClick={() => selectTab('explore')} aria-current={activeTab === 'explore' ? 'page' : undefined}><span>▦</span><small>Explore</small></button>
        <button type="button" onClick={onOpenPhrasebook} aria-label="Open saved phrasebook"><span>♡</span><small>Phrasebook</small></button>
      </nav>
    </div>
  </main>;
};
