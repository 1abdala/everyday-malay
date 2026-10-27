import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getScenarioArtwork } from './scenarioArtwork';

const playableScenarioIds = ['shop-01', 'mamak-01', 'grab-01'];

describe('scenario artwork', () => {
  it('maps each playable scenario to its own intro video and existing card fallback', () => {
    expect(getScenarioArtwork('shop-01')).toMatchObject({
      src: '/images/shop-checkout.png',
      videoSrc: '/videos/storecheckput.mp4'
    });
    expect(getScenarioArtwork('grab-01')).toMatchObject({
      src: '/images/grab-ordering.png',
      videoSrc: '/videos/graborder.mp4'
    });
    expect(getScenarioArtwork('mamak-01')).toMatchObject({
      src: '/images/mamak-waiter.png',
      videoSrc: '/videos/tehtarekorder.mp4'
    });
  });

  it('provides no video for an unmapped scenario so the intro can use its fallback', () => {
    expect(getScenarioArtwork('unknown-scene').videoSrc).toBeUndefined();
  });

  it('ships every mapped video and static fallback as a valid local asset', () => {
    for (const scenarioId of playableScenarioIds) {
      const artwork = getScenarioArtwork(scenarioId);
      const videoPath = resolve(process.cwd(), 'public', artwork.videoSrc!.slice(1));
      const imagePath = resolve(process.cwd(), 'public', artwork.src.slice(1));
      const video = readFileSync(videoPath);

      expect(video.byteLength, `${scenarioId} video should not be empty`).toBeGreaterThan(8);
      expect(video.subarray(4, 8).toString('ascii'), `${scenarioId} should be an MP4`).toBe('ftyp');
      expect(readFileSync(imagePath).byteLength, `${scenarioId} fallback image should not be empty`).toBeGreaterThan(0);
    }
  });
});
