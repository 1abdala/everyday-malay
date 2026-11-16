import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Card } from '../src/types';
import { buildReviewRows, renderResponseJsonl, renderScenarioMarkdown, validateReviewPackSources } from './review-pack-core';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ids = ['shop-01', 'mamak-01', 'grab-01'];
const cards = ids.map((id) => JSON.parse(fs.readFileSync(path.join(root, `content/cards/${id}.json`), 'utf8')) as Card);
const records = ids.map((id) => JSON.parse(fs.readFileSync(path.join(root, `content/reviews/records/${id}-review-record.json`), 'utf8')));
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'content/audio/manifest.json'), 'utf8'));
const errors = validateReviewPackSources(cards, records, manifest);
if (errors.length) {
  console.error('Review-pack source validation failed:\n' + errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}
const generated = path.join(root, 'content/reviews/generated');
fs.mkdirSync(generated, { recursive: true });
const allRows = cards.flatMap((card, index) => buildReviewRows(card, records[index], manifest));
for (let i = 0; i < cards.length; i++) {
  const card = cards[i];
  const rows = buildReviewRows(card, records[i], manifest);
  fs.writeFileSync(path.join(generated, `${card.id}-review-pack.md`), renderScenarioMarkdown(card, records[i], rows));
}
fs.writeFileSync(path.join(generated, 'review-responses.jsonl'), renderResponseJsonl(allRows));
console.log(`Generated ${cards.length} Markdown packs and ${allRows.length} structured review rows in content/reviews/generated/.`);
