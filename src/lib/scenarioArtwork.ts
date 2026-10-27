import { appAssetPath } from './assets';

export type ScenarioArtwork = {
  category: string;
  art: 'shop' | 'mamak' | 'grab';
  src: string;
  videoSrc?: string;
};

const scenarioArtwork: Record<string, ScenarioArtwork> = {
  'shop-01': { category: 'EVERYDAY ERRANDS', art: 'shop', src: appAssetPath('/images/shop-checkout.png'), videoSrc: appAssetPath('/videos/storecheckput.mp4') },
  'mamak-01': { category: 'EAT & DRINK', art: 'mamak', src: appAssetPath('/images/mamak-waiter.png'), videoSrc: appAssetPath('/videos/tehtarekorder.mp4') },
  'grab-01': { category: 'GETTING AROUND', art: 'grab', src: appAssetPath('/images/grab-ordering.png'), videoSrc: appAssetPath('/videos/graborder.mp4') }
};

export function getScenarioArtwork(cardId: string): ScenarioArtwork {
  return scenarioArtwork[cardId] ?? { category: 'EVERYDAY MALAY', art: 'shop', src: '' };
}
