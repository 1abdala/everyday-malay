import { describe, expect, it, vi } from 'vitest';
import { fetchAudioOnDemand } from './audioCache';

describe('on-demand audio cache', () => {
  it('returns a cached recording without fetching the network', async () => {
    const cached = new Response('cached', { status: 200 });
    const match = vi.fn().mockResolvedValue(cached);
    const fetcher = vi.fn();
    const cacheStorage = { open: vi.fn().mockResolvedValue({ match, put: vi.fn() }) } as unknown as CacheStorage;
    await expect(fetchAudioOnDemand('/audio/a.mp3', cacheStorage, fetcher as typeof fetch)).resolves.toBe(cached);
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('caches a successful requested file and returns it even if cache writes fail', async () => {
    const response = new Response('audio', { status: 200 });
    const put = vi.fn().mockRejectedValue(new Error('quota exceeded'));
    const cacheStorage = { open: vi.fn().mockResolvedValue({ match: vi.fn().mockResolvedValue(undefined), put }) } as unknown as CacheStorage;
    const fetcher = vi.fn().mockResolvedValue(response);
    await expect(fetchAudioOnDemand('/audio/a.mp3', cacheStorage, fetcher as typeof fetch)).resolves.toBe(response);
    expect(put).toHaveBeenCalledOnce();
  });

  it('continues with a network request when CacheStorage cannot open', async () => {
    const response = new Response('audio', { status: 200 });
    const cacheStorage = { open: vi.fn().mockRejectedValue(new Error('storage unavailable')) } as unknown as CacheStorage;
    const fetcher = vi.fn().mockResolvedValue(response);
    await expect(fetchAudioOnDemand('/audio/a.mp3', cacheStorage, fetcher as typeof fetch)).resolves.toBe(response);
    expect(fetcher).toHaveBeenCalledOnce();
  });
});
