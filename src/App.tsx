import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Card, ProgressMap, UserSettings } from './types';
import { completeOnboarding, completeSurvival, hasCompletedOnboarding, loadProgress, loadSettings } from './lib/storage';
import { track } from './lib/track';

import mamakData from '../content/cards/mamak-01.json';
import grabData from '../content/cards/grab-01.json';
import shopData from '../content/cards/shop-01.json';

import { FlashcardsHome } from './screens/FlashcardsHome';
import { CardScreen } from './screens/Card';
import { SettingsScreen } from './screens/Settings';
import { OnboardingScreen } from './screens/Onboarding';
import { orderStarterScenarios } from './lib/learningPath';
import { getPathProgress } from './lib/learningPath';
import { SurvivalMalay } from './screens/SurvivalMalay';
import { Phrasebook } from './screens/Phrasebook';

type BrowseTab = 'path' | 'explore';
type LessonRoute = { screen: 'card'; cardId: string; tab: BrowseTab };
type HomeRoute = { screen: 'deck'; tab: BrowseTab };
type AppRoute = LessonRoute | HomeRoute;

function routeFromLocation(): AppRoute {
  const match = window.location.hash.match(/^#lesson\/([^/]+)\/(path|explore)$/);
  if (match) return { screen: 'card', cardId: decodeURIComponent(match[1]), tab: match[2] as BrowseTab };
  return { screen: 'deck', tab: window.location.hash === '#explore' ? 'explore' : 'path' };
}

function routeHref(route: AppRoute): string {
  const hash = route.screen === 'card'
    ? `#lesson/${encodeURIComponent(route.cardId)}/${route.tab}`
    : route.tab === 'explore' ? '#explore' : '#path';
  return `${window.location.pathname}${window.location.search}${hash}`;
}

const ALL_CARDS: Card[] = orderStarterScenarios([
  mamakData as Card,
  grabData as Card,
  shopData as Card
]);

export const App: React.FC = () => <LearningApp />;

const LearningApp: React.FC = () => {
  const initialRoute = useRef(routeFromLocation()).current;
  const [currentScreen, setCurrentScreen] = useState<'deck' | 'card' | 'settings' | 'onboarding' | 'survival' | 'phrasebook'>(() =>
    hasCompletedOnboarding() ? initialRoute.screen : 'onboarding'
  );
  const [activeCardId, setActiveCardId] = useState<string | null>(initialRoute.screen === 'card' ? initialRoute.cardId : null);
  const [homeTab, setHomeTab] = useState<BrowseTab>(initialRoute.tab);
  const [cardBrowseTab, setCardBrowseTab] = useState<BrowseTab>(initialRoute.screen === 'card' ? initialRoute.tab : 'path');
  // Read saved progress before first render so direct lesson URLs resume the saved step.
  const [progress, setProgress] = useState<ProgressMap>(loadProgress);
  const [settings, setSettings] = useState<UserSettings>(loadSettings);
  const onboardingReturnScreen = useRef<'deck' | 'card' | 'settings'>(initialRoute.screen);

  const refreshProgress = useCallback(() => {
    setProgress(loadProgress());
  }, []);

  useEffect(() => {
    refreshProgress();
    track('app_opened');
    const initialCardExists = initialRoute.screen === 'card' && ALL_CARDS.some((card) => card.id === initialRoute.cardId);
    if (initialCardExists) {
      const alreadyManagedLessonEntry = window.history.state?.screen === 'card'
        && window.history.state?.cardId === initialRoute.cardId;
      if (!alreadyManagedLessonEntry) {
        const homeRoute: HomeRoute = { screen: 'deck', tab: initialRoute.tab };
        window.history.replaceState(homeRoute, '', routeHref(homeRoute));
        window.history.pushState(initialRoute, '', routeHref(initialRoute));
      }
    } else {
      const tab = initialRoute.screen === 'card' ? 'path' : initialRoute.tab;
      const homeRoute: HomeRoute = { screen: 'deck', tab };
      window.history.replaceState(homeRoute, '', routeHref(homeRoute));
      if (initialRoute.screen === 'card') {
        setCurrentScreen('deck');
        setActiveCardId(null);
        setHomeTab(tab);
      }
    }

    const handlePopState = () => {
      const route = routeFromLocation();
      if (route.screen === 'card' && ALL_CARDS.some((card) => card.id === route.cardId)) {
        setCardBrowseTab(route.tab);
        setActiveCardId(route.cardId);
        setCurrentScreen('card');
      } else {
        const tab = route.screen === 'deck' ? route.tab : 'path';
        setHomeTab(tab);
        setActiveCardId(null);
        setCurrentScreen('deck');
      }
      refreshProgress();
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const setHomeRoute = (tab: BrowseTab) => {
    const route: HomeRoute = { screen: 'deck', tab };
    window.history.replaceState(route, '', routeHref(route));
    setHomeTab(tab);
  };

  const handleSelectCard = (cardId: string, browseTab: BrowseTab = homeTab) => {
    setCardBrowseTab(browseTab);
    setActiveCardId(cardId);
    setCurrentScreen('card');
    const route: LessonRoute = { screen: 'card', cardId, tab: browseTab };
    window.history.pushState(route, '', routeHref(route));
  };

  const handleBackToDeck = () => {
    const route = routeFromLocation();
    if (route.screen === 'card' && window.history.state?.screen === 'card') {
      window.history.back();
      return;
    }
    const homeRoute: HomeRoute = { screen: 'deck', tab: cardBrowseTab };
    window.history.replaceState(homeRoute, '', routeHref(homeRoute));
    setHomeTab(cardBrowseTab);
    setCurrentScreen('deck');
    setActiveCardId(null);
    refreshProgress();
  };

  const handleContinuePath = () => {
    const nextScenario = getPathProgress(ALL_CARDS, loadProgress()).recommendedCard;
    if (nextScenario && nextScenario.id !== activeCardId) {
      const homeRoute: HomeRoute = { screen: 'deck', tab: 'path' };
      window.history.replaceState(homeRoute, '', routeHref(homeRoute));
      setHomeTab('path');
      handleSelectCard(nextScenario.id, 'path');
      return;
    }
    const homeRoute: HomeRoute = { screen: 'deck', tab: 'path' };
    window.history.replaceState(homeRoute, '', routeHref(homeRoute));
    setHomeTab('path');
    setCurrentScreen('deck');
    setActiveCardId(null);
    refreshProgress();
  };

  const handleOpenOnboarding = () => {
    onboardingReturnScreen.current = currentScreen === 'settings' ? 'settings' : currentScreen === 'card' ? 'card' : 'deck';
    setCurrentScreen('onboarding');
  };

  const handleFinishOnboarding = (startStarter = false) => {
    completeOnboarding();
    refreshProgress();
    setCurrentScreen(startStarter && onboardingReturnScreen.current !== 'settings' ? 'survival' : onboardingReturnScreen.current);
  };

  const handleFinishSurvival = () => {
    completeSurvival();
    setCurrentScreen('deck');
    setHomeTab('path');
    refreshProgress();
  };

  const activeCard = ALL_CARDS.find((c) => c.id === activeCardId) || ALL_CARDS[0];

  return (
    <div className="app-container">
      {currentScreen === 'onboarding' && <OnboardingScreen onStart={() => handleFinishOnboarding(true)} onSkip={() => handleFinishOnboarding(false)} />}
      {currentScreen === 'survival' && <SurvivalMalay cards={ALL_CARDS} onFinish={handleFinishSurvival} onSkip={() => { setCurrentScreen('deck'); setHomeTab('path'); }} />}
      {currentScreen === 'phrasebook' && <Phrasebook cards={ALL_CARDS} onBack={() => { setCurrentScreen('deck'); }} />}
      {currentScreen === 'deck' && (
        <FlashcardsHome
          cards={ALL_CARDS}
          progress={progress}
          initialTab={homeTab}
          onActiveTabChange={setHomeRoute}
          onSelectCard={(cardId, sourceTab) => handleSelectCard(cardId, sourceTab)}
          onOpenSettings={() => setCurrentScreen('settings')}
          onOpenSurvival={() => setCurrentScreen('survival')}
          onOpenPhrasebook={() => setCurrentScreen('phrasebook')}
        />
      )}

      {currentScreen === 'card' && activeCard && (
        <CardScreen
          key={activeCard.id}
          card={activeCard}
          progress={progress}
          settings={settings}
          onBackToDeck={handleBackToDeck}
          onContinuePath={handleContinuePath}
          returnToBrowseLabel={cardBrowseTab === 'explore' ? 'Back to Explore' : 'Back to Path'}
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
          onOpenOrientation={handleOpenOnboarding}
          totalCards={ALL_CARDS.length}
        />
      )}
    </div>
  );
};
