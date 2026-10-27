import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getScenarioArtwork } from './scenarioArtwork';

const playableScenarioIds = ['shop-01', 'mamak-01', 'grab-01'];

describe('scenario artwork', () => {
  it('maps each playable scenario to its own intro video and existing card fallback', () => {
    expect(getScenarioArtwork('shop-01')).toMatchObject({
      src: `${import.meta.env.BASE_URL}images/shop-checkout.png`,
      videoSrc: `${import.meta.env.BASE_URL}videos/storecheckput.mp4`
    });
    expect(getScenarioArtwork('grab-01')).toMatchObject({
      src: `${import.meta.env.BASE_URL}images/grab-ordering.png`,
      videoSrc: `${import.meta.env.BASE_URL}videos/graborder.mp4`
    });
    expect(getScenarioArtwork('mamak-01')).toMatchObject({
      src: `${import.meta.env.BASE_URL}images/mamak-waiter.png`,
      videoSrc: `${import.meta.env.BASE_URL}videos/tehtarekorder.mp4`
    });
  });

  it('provides no video for an unmapped scenario so the intro can use its fallback', () => {
    expect(getScenarioArtwork('unknown-scene').videoSrc).toBeUndefined();
  });

  it('ships every mapped video and static fallback as a valid local asset', () => {
    for (const scenarioId of playableScenarioIds) {
      const artwork = getScenarioArtwork(scenarioId);
      const videoPath = resolve(process.cwd(), 'public', artwork.videoSrc!.replace(import.meta.env.BASE_URL, ''));
      const imagePath = resolve(process.cwd(), 'public', artwork.src.replace(import.meta.env.BASE_URL, ''));
      const video = readFileSync(videoPath);

      expect(video.byteLength, `${scenarioId} video should not be empty`).toBeGreaterThan(8);
      expect(video.subarray(4, 8).toString('ascii'), `${scenarioId} should be an MP4`).toBe('ftyp');
      expect(readFileSync(imagePath).byteLength, `${scenarioId} fallback image should not be empty`).toBeGreaterThan(0);
    }
  });
});
