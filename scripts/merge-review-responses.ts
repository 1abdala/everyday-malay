import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const responseFile = process.argv[2];
if (!responseFile) {
  console.error('Usage: npm run merge:reviews -- <completed-review-responses.jsonl>');
  process.exit(2);
}
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fullResponseFile = path.resolve(process.cwd(), responseFile);
const lines = fs.readFileSync(fullResponseFile, 'utf8').split(/\r?\n/).filter((line) => line.trim());
const responses = lines.map((line, index) => {
  try { return JSON.parse(line); } catch { throw new Error(`Invalid JSON on response line ${index + 1}`); }
});
const allowed = new Map([['Approve', 'approved'], ['Revise', 'revise'], ['Needs discussion', 'needs-discussion']]);
const keys = new Set<string>();
const updatesByScenario = new Map<string, any[]>();
for (const response of responses) {
  const key = `${response.scenarioId}|${response.itemType}|${response.itemId}`;
  if (!response.scenarioId || !response.itemId || keys.has(key)) throw new Error(`Missing or duplicate response identity: ${key}`);
  keys.add(key);
  if (!response.reviewerVerdict) throw new Error(`Missing reviewer verdict for ${key}`);
  const status = allowed.get(response.reviewerVerdict);
  if (!status) throw new Error(`Unsupported verdict for ${key}: ${response.reviewerVerdict}`);
  if (!response.reviewer?.trim() || !response.reviewedAt?.trim()) throw new Error(`Reviewer name and date are required for ${key}`);
  const list = updatesByScenario.get(response.scenarioId) ?? [];
  list.push({ ...response, status }); updatesByScenario.set(response.scenarioId, list);
}
const apply = (record: any, response: any) => {
  const id = response.itemId;
  const entries: [string, string, string][] = [
    ['dialogue', 'lineReviews', 'lineId'], ['phrase', 'phraseReviews', 'phraseId'],
    ['reference phrase', 'referencePhraseReviews', 'phraseId'], ['comparison', 'comparisonReviews', 'comparisonId'],
    ['task dialogue', 'taskTurnReviews', 'taskId'], ['task model response', 'taskTurnReviews', 'taskId'],
    ['accepted alternative', 'taskAlternativeReviews', 'alternativeId'], ['task conclusion', 'conclusionReviews', 'conclusionId'],
    ['comprehension question', 'comprehensionReviews', 'questionId'], ['word gloss', 'glossReviews', 'glossId']
  ];
  const mapping = entries.find(([candidate]) => candidate === response.itemType);
  if (!mapping) throw new Error(`Unsupported review item type: ${response.itemType}`);
  const [type, field, identity] = mapping;
  let sourceId = id;
  if (type === 'accepted alternative') sourceId = id.replace(/^alternative:/, '');
  if (type === 'word gloss') sourceId = id.replace(/^gloss:/, '');
  if (type === 'dialogue' || type === 'phrase' || type === 'reference phrase' || type === 'comparison' || type === 'task conclusion' || type === 'comprehension question') sourceId = id.replace(/^[^:]+:/, '');
  if (type === 'task dialogue' || type === 'task model response') sourceId = id.replace(/^task-(?:dialogue|model):/, '');
  const matchValue = (record[field] ?? []).find((item: any) => item[identity] === sourceId
    && (type !== 'task dialogue' && type !== 'task model response' || item.itemType === type));
  if (!matchValue) throw new Error(`No existing ${field} entry for ${id} in ${record.scenarioId}`);
  matchValue.status = response.status;
  matchValue.reviewer = response.reviewer;
  matchValue.reviewedAt = response.reviewedAt;
  const newNotes = [response.reviewerNotes, response.regionalRegisterComments, response.revisedMalay && `Proposed Malay: ${response.revisedMalay}`, response.revisedEnglish && `Proposed English: ${response.revisedEnglish}`].filter(Boolean).join('\n');
  if (newNotes) matchValue.notes = [matchValue.notes, newNotes].filter(Boolean).join('\n');
};

for (const [scenarioId, updates] of updatesByScenario) {
  const recordPath = path.join(root, `content/reviews/records/${scenarioId}-review-record.json`);
  const record = JSON.parse(fs.readFileSync(recordPath, 'utf8'));
  for (const update of updates) apply(record, update);
  fs.writeFileSync(recordPath, `${JSON.stringify(record, null, 2)}\n`);
}
console.log(`Merged ${responses.length} item review response(s) into ${updatesByScenario.size} scenario review record(s). Scenario JSON/status was not changed.`);
