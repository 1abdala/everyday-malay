import React, { useState, useEffect } from 'react';
import type { Card, ProgressMap, UserSettings } from './types';
import { loadProgress, loadSettings } from './lib/storage';
import { track } from './lib/track';

import mamakData from '../content/cards/mamak-01.json';
import grabData from '../content/cards/grab-01.json';
import shopData from '../content/cards/shop-01.json';

import { Deck } from './screens/Deck';
import { CardScreen } from './screens/Card';
import { SettingsScreen } from './screens/Settings';

const ALL_CARDS: Card[] = [
  mamakData as Card,
  grabData as Card,
  shopData as Card
];

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<'deck' | 'card' | 'settings'>('deck');
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [progress, setProgress] = useState<ProgressMap>({});
  const [settings, setSettings] = useState<UserSettings>(loadSettings);

  const refreshProgress = () => {
    setProgress(loadProgress());
  };

  useEffect(() => {
    refreshProgress();
    track('app_opened');
  }, []);

  const handleSelectCard = (cardId: string) => {
    setActiveCardId(cardId);
    setCurrentScreen('card');
  };

  const handleBackToDeck = () => {
    setCurrentScreen('deck');
    setActiveCardId(null);
    refreshProgress();
  };

  const activeCard = ALL_CARDS.find((c) => c.id === activeCardId) || ALL_CARDS[0];

  return (
    <div className="app-container">
      {currentScreen === 'deck' && (
        <Deck
          cards={ALL_CARDS}
          progress={progress}
          onSelectCard={handleSelectCard}
          onOpenSettings={() => setCurrentScreen('settings')}
        />
      )}

      {currentScreen === 'card' && activeCard && (
        <CardScreen
          key={activeCard.id}
          card={activeCard}
          allCards={ALL_CARDS}
          progress={progress}
          settings={settings}
          onBackToDeck={handleBackToDeck}
          onNavigateToCard={(cardId) => {
            setActiveCardId(cardId);
          }}
          onProgressUpdated={refreshProgress}
        />
      )}

      {currentScreen === 'settings' && (
        <SettingsScreen
          settings={settings}
          onSettingsChange={setSettings}
          onClose={() => setCurrentScreen('deck')}
          onDataCleared={() => {
            refreshProgress();
            setSettings(loadSettings());
          }}
          totalCards={ALL_CARDS.length}
        />
      )}
    </div>
  );
};
