import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'content/audio/manifest.json'), 'utf8'));
const assets = manifest.assets.filter((asset: any) => asset.pilot);
const rows = assets.map((asset: any) => {
  const normal = asset.normal || 'Not in pilot';
  const slow = asset.slow || 'Not required for this dialogue line';
  return `| ${asset.id} | ${asset.type} | ${asset.malay.replaceAll('|', '\\|')} | ${asset.english.replaceAll('|', '\\|')} | Conversational and context-appropriate; reviewer confirms exact tone/register before recording | Normal: clear natural pace; Slow: ${asset.type === 'phrase' ? 'slower and clearly segmented without changing the wording or sounding unnatural' : 'not required for dialogue pilot'} | ${normal} | ${slow} |`;
});
const body = [
  '<!-- GENERATED FROM CURRENT SCENARIO JSON AND content/audio/manifest.json. Do not edit source wording here. -->',
  '# Everyday Malay — Native Audio Pilot Recording Script', '',
  `Pilot set: ${assets.filter((x: any) => x.type === 'phrase').length} phrases (normal + slow) and ${assets.filter((x: any) => x.type === 'dialogue').length} full dialogue lines (normal).`,
  'All Malay text and English meanings below are copied from current draft scenario content. A reviewer and speaker should confirm wording, pronunciation, register, and performance before recording. These scripts are not evidence of approval.', '',
  '## Recording setup', '',
  '- Record in a quiet room with the same microphone, position, gain, and room setup for the full session.',
  '- Keep a consistent microphone distance (about a hand span); avoid clipping, room echo, music, and noise reduction artifacts.',
  '- Record the exact Malay text as written. Do not silently “correct” it during recording; pause and flag proposed edits for the content editor.',
  '- Normal: natural, conversational Malaysian Malay at a clear everyday pace. Slow: carefully articulated and slower, while preserving natural phrasing and stress; do not insert artificial pauses between every word.',
  '- Do a slate/take separately; deliver clean audio without spoken labels. Export mono MP3 at the agreed project settings only after the team records those settings in the rights/QC record.',
  '- Do not record until the reviewer has approved the exact line and the speaker release/license terms are completed.', '',
  '## Exact recording queue', '',
  '| Stable ID | Kind | Exact Malay | English meaning | Intended tone | Pace and take | Normal filename | Slow filename |',
  '|---|---|---|---|---|---|---|---|', ...rows, '',
  '## File convention', '',
  '`/audio/{scenarioId}/{stable-id}_normal.mp3` and, for pilot phrases, `/audio/{scenarioId}/{stable-id}_slow.mp3`. Dialogue lines require normal recordings for this pilot. Phrase IDs require both normal and slow takes. Do not create unlisted variants or substitute files without updating the manifest.',
  '', 'No duration, recording date, speaker, file size, license, or reviewer value is assumed by this script.'
].join('\n');
const output = path.join(root, 'content/audio/pilot-recording-script.md');
fs.writeFileSync(output, `${body}\n`);
console.log(`Generated ${output} with ${assets.length} pilot items.`);
