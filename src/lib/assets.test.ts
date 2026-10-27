import { describe, expect, it } from 'vitest';
import { appAssetPath } from './assets';

describe('appAssetPath', () => {
  it('resolves root-relative app assets inside the GitHub Pages repository base', () => {
    expect(appAssetPath('/videos/graborder.mp4', '/everyday-malay/'))
      .toBe('/everyday-malay/videos/graborder.mp4');
  });

  it('preserves absolute and data URLs', () => {
    expect(appAssetPath('https://example.com/audio.mp3', '/everyday-malay/'))
      .toBe('https://example.com/audio.mp3');
    expect(appAssetPath('data:audio/mpeg;base64,abc', '/everyday-malay/'))
      .toBe('data:audio/mpeg;base64,abc');
  });
});
