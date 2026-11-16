import manifest from '../../content/audio/manifest.json';

export type NativeAudioStatus = 'planned' | 'recorded' | 'reviewed' | 'approved';
export type NativeAudioAsset = {
  id: string; scenarioId: string; malay: string; english: string;
  type: 'phrase' | 'dialogue' | 'prompt' | 'model_response';
  normal: string; slow: string; status: NativeAudioStatus; speaker: string;
  recordedAt: string | null; license: string; reviewStatus: 'draft' | 'approved'; pilot?: boolean;
};
export type NativeAudioManifest = { schemaVersion: number; assets: NativeAudioAsset[]; preload?: string[]; cachePolicy?: string };

export const audioManifest = manifest as NativeAudioManifest;
export const AUDIO_RUNTIME_CACHE = { name: 'everyday-malay-audio-v2', maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 } as const;

export function validateAudioManifest(value: NativeAudioManifest): string[] {
  const errors: string[] = [];
  if (value.schemaVersion !== 2 || !Array.isArray(value.assets)) return ['Audio manifest must use schemaVersion 2 and an assets array.'];
  const ids = new Set<string>();
  value.assets.forEach((asset, index) => {
    const label = `Audio asset #${index + 1}`;
    if (!asset.id?.trim() || ids.has(asset.id)) errors.push(`${label} has a missing or duplicate id: ${asset.id || '(empty)'}`);
    ids.add(asset.id);
    if (!asset.scenarioId?.trim() || !asset.malay?.trim() || !asset.english?.trim()) errors.push(`${label} requires scenarioId, Malay, and English text.`);
    if (!['phrase', 'dialogue', 'prompt', 'model_response'].includes(asset.type)) errors.push(`${label} has invalid type.`);
    if (!['planned', 'recorded', 'reviewed', 'approved'].includes(asset.status)) errors.push(`${label} has invalid status.`);
    if (!['draft', 'approved'].includes(asset.reviewStatus)) errors.push(`${label} has invalid reviewStatus.`);
    for (const field of ['normal', 'slow'] as const) if (asset[field] && (!asset[field].startsWith('/audio/') || !asset[field].endsWith('.mp3'))) errors.push(`${label} ${field} must be an /audio/... .mp3 path or empty.`);
    if (asset.status !== 'planned' && (!asset.speaker?.trim() || !asset.recordedAt || !asset.license?.trim() || !asset.normal)) errors.push(`${label} needs a normal file, speaker, recordedAt, and license details once recording has begun.`);
    if (asset.status === 'approved' && (asset.reviewStatus !== 'approved' || !asset.normal)) errors.push(`${label} cannot be approved without an approved review and normal recording.`);
    if (asset.reviewStatus === 'approved' && asset.status !== 'approved') errors.push(`${label} needs approved audio status before reviewStatus can be approved.`);
  });
  return errors;
}

export function findNativeAudioAsset(options: { id?: string; scenarioId?: string; text?: string }): NativeAudioAsset | undefined {
  return audioManifest.assets.find((asset) => options.id ? asset.id === options.id
    : asset.scenarioId === options.scenarioId && asset.malay === options.text);
}

export function selectNativeAudio(asset: NativeAudioAsset | undefined, speed: 'normal' | 'slow'): string | undefined {
  if (!asset || !['recorded', 'reviewed', 'approved'].includes(asset.status)) return undefined;
  return speed === 'slow' ? (asset.slow || asset.normal || undefined) : (asset.normal || undefined);
}
