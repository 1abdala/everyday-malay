import { describe, expect, it } from 'vitest';
import { AUDIO_RUNTIME_CACHE, audioManifest, selectNativeAudio, validateAudioManifest, type NativeAudioAsset } from './audioManifest';

const asset = (patch: Partial<NativeAudioAsset> = {}): NativeAudioAsset => ({
  id: 'shop-01-phrase-01', scenarioId: 'shop-01', malay: 'Ada plastik tak?', english: 'Do you have a plastic bag?', type: 'phrase',
  normal: '/audio/shop-01/shop-01-phrase-01_normal.mp3', slow: '/audio/shop-01/shop-01-phrase-01_slow.mp3',
  status: 'planned', speaker: '', recordedAt: null, license: '', reviewStatus: 'draft', ...patch
});

describe('audio manifest and playback selection', () => {
  it('validates the current draft manifest without asserting recordings exist', () => {
    expect(validateAudioManifest(audioManifest)).toEqual([]);
    expect(audioManifest.assets.every((item) => ['planned', 'recorded', 'reviewed', 'approved'].includes(item.status))).toBe(true);
    expect(audioManifest.assets.filter((item) => item.pilot && item.type === 'phrase')).toHaveLength(12);
    expect(audioManifest.assets.filter((item) => item.pilot && item.type === 'dialogue')).toHaveLength(29);
    expect(audioManifest.assets.filter((item) => item.pilot && item.type === 'phrase').every((item) => item.normal && item.slow)).toBe(true);
    expect(audioManifest.assets.filter((item) => item.pilot && item.type === 'dialogue').every((item) => item.normal && !item.slow)).toBe(true);
  });
  it('rejects missing/duplicate IDs and approvals without metadata', () => {
    expect(validateAudioManifest({ schemaVersion: 2, assets: [asset(), asset()] }).join(' ')).toContain('duplicate id');
    expect(validateAudioManifest({ schemaVersion: 2, assets: [asset({ status: 'approved', reviewStatus: 'approved' })] }).join(' ')).toContain('normal file, speaker');
  });
  it('does not select planned audio and chooses the normal or slow recorded variant', () => {
    expect(selectNativeAudio(asset(), 'normal')).toBeUndefined();
    const recorded = asset({ status: 'recorded', speaker: 'reviewer supplied', recordedAt: '2026-11-07', license: 'documented grant' });
    expect(selectNativeAudio(recorded, 'normal')).toBe(recorded.normal);
    expect(selectNativeAudio(recorded, 'slow')).toBe(recorded.slow);
    expect(selectNativeAudio({ ...recorded, slow: '' }, 'slow')).toBe(recorded.normal);
    expect(selectNativeAudio({ ...recorded, status: 'reviewed' }, 'normal')).toBe(recorded.normal);
    expect(selectNativeAudio({ ...recorded, status: 'approved', reviewStatus: 'approved' }, 'normal')).toBe(recorded.normal);
  });
  it('sets an on-demand bounded audio cache and does not request precache', () => {
    expect(AUDIO_RUNTIME_CACHE.name).toBe('everyday-malay-audio-v2');
    expect(AUDIO_RUNTIME_CACHE.maxEntries).toBeLessThan(100);
    expect(audioManifest.preload).toEqual([]);
    expect(audioManifest.cachePolicy).toContain('only');
  });
});
