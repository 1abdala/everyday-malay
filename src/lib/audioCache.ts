import { AUDIO_RUNTIME_CACHE } from './audioManifest';

export async function fetchAudioOnDemand(
  url: string,
  cacheStorage: Pick<CacheStorage, 'open'> | undefined = typeof window !== 'undefined' ? window.caches : undefined,
  fetcher: typeof fetch = fetch
): Promise<Response> {
  let cache: Cache | undefined;
  if (cacheStorage) {
    try {
      cache = await cacheStorage.open(AUDIO_RUNTIME_CACHE.name);
      const cached = await cache.match(url);
      if (cached) return cached;
    } catch {
      // Cache is an optimization. Continue with the network if storage is blocked/full.
      cache = undefined;
    }
  }
  const response = await fetcher(url);
  if (response.ok && cache) {
    try { await cache.put(url, response.clone()); } catch { /* Keep the playable network response if caching fails. */ }
  }
  return response;
}
