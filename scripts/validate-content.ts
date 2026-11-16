import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Card } from '../src/types';
import { validateAudioManifest } from '../src/lib/audioManifest';
import { expectedReviewItems, validateReviewPackSources } from './review-pack-core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const cardsDir = path.resolve(projectRoot, 'content/cards');
const publicDir = path.resolve(projectRoot, 'public');
const reviewRecordsDir = path.resolve(projectRoot, 'content/reviews/records');

let hasErrors = false;
const seenCardIds = new Set<string>();
const cardsForReview: Card[] = [];
const recordsForReview: any[] = [];

if (!fs.existsSync(cardsDir)) {
  console.error(`Error: Cards directory does not exist at ${cardsDir}`);
  process.exit(1);
}

const files = fs.readdirSync(cardsDir).filter((f) => f.endsWith('.json'));

if (files.length === 0) {
  console.error(`Error: No JSON card files found in ${cardsDir}`);
  process.exit(1);
}

console.log(`Validating ${files.length} card file(s)...`);

for (const file of files) {
  const filePath = path.join(cardsDir, file);
  let card: Card;
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    card = JSON.parse(raw);
  } catch (err) {
    console.error(`[FAIL] ${file}: Invalid JSON - ${err}`);
    hasErrors = true;
    continue;
  }

  // 1. Check duplicate card ID
  if (seenCardIds.has(card.id)) {
    console.error(`[FAIL] ${file}: Duplicate card id "${card.id}" found.`);
    hasErrors = true;
  } else {
    seenCardIds.add(card.id);
  }

  // 2. Check approved card metadata
  const isApproved = card.review?.status === 'approved';
  if (!card.review || !['draft', 'approved'].includes(card.review.status)) {
    console.error(`[FAIL] ${file}: Scenario review status must be draft or approved.`);
    hasErrors = true;
  }
  if (isApproved) {
    if (!card.review?.by || !card.review?.date) {
      console.error(
        `[FAIL] ${file}: Approved card is missing "review.by" or "review.date".`
      );
      hasErrors = true;
    }
  }

  if (!card.learnerGoal?.trim()) {
    console.error(`[FAIL] ${file}: Missing learnerGoal.`);
    hasErrors = true;
  }
  const comparisonIds = (card.chips ?? []).map((chip: any) => chip.id);
  if (comparisonIds.some((id: string) => !id?.trim()) || new Set(comparisonIds).size !== comparisonIds.length) {
    console.error(`[FAIL] ${file}: Every spoken/formal comparison needs a unique stable ID.`); hasErrors = true;
  }
  if (!Array.isArray(card.comprehensionQuestions) || card.comprehensionQuestions.length < 2 || card.comprehensionQuestions.length > 3) {
    console.error(`[FAIL] ${file}: Add 2–3 reviewed-schema comprehension questions.`);
    hasErrors = true;
  } else {
    const questionIds = new Set<string>();
    for (const question of card.comprehensionQuestions) {
      const choiceIds = new Set((question.choices ?? []).map((choice) => choice.id));
      if (!question.id?.trim() || questionIds.has(question.id) || !question.prompt?.trim()
        || (question.choices?.length ?? 0) < 2 || (question.choices?.length ?? 0) > 4
        || !choiceIds.has(question.correctChoiceId) || !question.explanation?.trim()
        || !['draft', 'approved'].includes(question.reviewStatus)) {
        console.error(`[FAIL] ${file}: Malformed comprehension question "${question.id}".`);
        hasErrors = true;
      }
      if (choiceIds.size !== (question.choices ?? []).length || (question.choices ?? []).some((choice) => !choice.id?.trim() || !choice.text?.trim())) {
        console.error(`[FAIL] ${file}: Comprehension choices need unique stable IDs and non-empty text.`);
        hasErrors = true;
      }
      if (question.audio && Object.values(question.audio).some((audioPath) => typeof audioPath !== 'string' || !audioPath.startsWith('/audio/'))) {
        console.error(`[FAIL] ${file}: Comprehension audio paths must use /audio/... paths.`);
        hasErrors = true;
      }
      questionIds.add(question.id);
    }
  }

  const recordPath = path.join(reviewRecordsDir, `${card.id}-review-record.json`);
  let reviewRecord: any = null;
  try { reviewRecord = JSON.parse(fs.readFileSync(recordPath, 'utf-8')); }
  catch { console.error(`[FAIL] ${file}: Missing or invalid review record ${recordPath}.`); hasErrors = true; }
  if (reviewRecord) {
    cardsForReview.push(card);
    recordsForReview.push(reviewRecord);
    if (reviewRecord.scenarioId !== card.id || !['draft', 'approved'].includes(reviewRecord.reviewStatus)) {
      console.error(`[FAIL] ${file}: Review record identity/status is invalid.`); hasErrors = true;
    }
    const expectedLineIds = new Set((card.dialogue ?? []).map((line) => line.id));
    const recordedLineIds = new Set((reviewRecord.lineReviews ?? []).map((item: any) => item.lineId));
    const expectedPhraseIds = new Set((card.phrases ?? []).map((phrase) => phrase.id));
    const recordedPhraseIds = new Set((reviewRecord.phraseReviews ?? []).map((item: any) => item.phraseId));
    if (expectedLineIds.size !== recordedLineIds.size || [...expectedLineIds].some((id) => !recordedLineIds.has(id))) {
      console.error(`[FAIL] ${file}: Review record must cover every dialogue line exactly.`); hasErrors = true;
    }
    if (expectedPhraseIds.size !== recordedPhraseIds.size || [...expectedPhraseIds].some((id) => !recordedPhraseIds.has(id))) {
      console.error(`[FAIL] ${file}: Review record must cover every core phrase exactly.`); hasErrors = true;
    }
    const expectedAlternativeIds = new Set<string>();
    card.task.turns.forEach((turn, turnIndex) => (turn.accept ?? []).forEach((response, alternativeIndex) => {
      expectedAlternativeIds.add(`${card.id}-task-${String(turnIndex + 1).padStart(3, '0')}-alt-${String(alternativeIndex + 1).padStart(3, '0')}|${response}`);
    }));
    const recordedAlternativeIds = new Set((reviewRecord.taskAlternativeReviews ?? []).map((item: any) => `${item.alternativeId}|${item.response}`));
    if (expectedAlternativeIds.size !== recordedAlternativeIds.size || [...expectedAlternativeIds].some((id) => !recordedAlternativeIds.has(id))) {
      console.error(`[FAIL] ${file}: Review record must cover every accepted task alternative exactly.`); hasErrors = true;
    }
    const expectedQuestionIds = new Set((card.comprehensionQuestions ?? []).map((question) => question.id));
    const recordedQuestionIds = new Set((reviewRecord.comprehensionReviews ?? []).map((item: any) => item.questionId));
    if (expectedQuestionIds.size !== recordedQuestionIds.size || [...expectedQuestionIds].some((id) => !recordedQuestionIds.has(id))) {
      console.error(`[FAIL] ${file}: Review record must cover every comprehension question exactly.`); hasErrors = true;
    }
    const reviewItems = [...(reviewRecord.lineReviews ?? []), ...(reviewRecord.phraseReviews ?? []), ...(reviewRecord.glossReviews ?? []), ...(reviewRecord.taskAlternativeReviews ?? []), ...(reviewRecord.comprehensionReviews ?? []), ...(reviewRecord.audioReviews ?? [])];
    if (reviewItems.some((item: any) => !['pending', 'approved', 'revise', 'needs-discussion'].includes(item.status))) {
      console.error(`[FAIL] ${file}: Review items must use pending, approved, revise, or needs-discussion.`); hasErrors = true;
    }
    if (isApproved) {
      const unapprovedPhrase = [...(card.phrases ?? []), ...(card.referencePhrases ?? [])].some((phrase) => phrase.review?.status !== 'approved'
        || (phrase.wordGlosses ?? []).some((gloss) => gloss.reviewStatus !== 'approved' || !gloss.reviewer || !gloss.reviewedAt));
      const unapprovedQuestion = (card.comprehensionQuestions ?? []).some((question) => question.reviewStatus !== 'approved');
      if (reviewRecord.reviewStatus !== 'approved' || !reviewRecord.reviewer || !reviewRecord.reviewedAt
        || reviewItems.some((item: any) => item.status !== 'approved') || unapprovedPhrase || unapprovedQuestion) {
        console.error(`[FAIL] ${file}: Scenario cannot be approved until all review items and reviewer metadata are approved.`); hasErrors = true;
      }
    }
  }

  // 3. Check dialogue IDs and audio existence
  const seenLineIds = new Set<string>();
  for (const line of card.dialogue || []) {
    if (seenLineIds.has(line.id)) {
      console.error(`[FAIL] ${file}: Duplicate dialogue line id "${line.id}".`);
      hasErrors = true;
    }
    seenLineIds.add(line.id);

    const audioPaths = [line.audio?.normal, line.audio?.slow].filter(Boolean) as string[];
    for (const relAudio of audioPaths) {
      const fullPath = path.join(publicDir, relAudio);
      if (!fs.existsSync(fullPath)) {
        if (isApproved) {
          console.error(
            `[FAIL] ${file}: Missing audio file for approved card: ${relAudio}`
          );
          hasErrors = true;
        } else {
          // Warning for draft cards
          // console.warn(`[WARN] ${file}: Missing audio file (draft): ${relAudio}`);
        }
      }
    }
  }

  // 3b. Validate stable IDs and explicit review state for learner/reference phrases.
  const seenPhraseIds = new Set<string>();
  for (const [listName, phrases] of [['phrases', card.phrases], ['referencePhrases', card.referencePhrases ?? []]] as const) {
    for (const [index, phrase] of phrases.entries()) {
      const label = `${listName} item #${index + 1}`;
      if (!phrase.id?.trim() || seenPhraseIds.has(phrase.id)) {
        console.error(`[FAIL] ${file}: ${label} is missing a stable ID or duplicates "${phrase.id}".`);
        hasErrors = true;
      } else {
        seenPhraseIds.add(phrase.id);
      }
      if (!phrase.ms?.trim() || !phrase.en?.trim()) {
        console.error(`[FAIL] ${file}: ${label} needs Malay text and an English meaning.`);
        hasErrors = true;
      }
      if (!phrase.review || !['draft', 'approved'].includes(phrase.review.status)) {
        console.error(`[FAIL] ${file}: ${label} needs a draft/approved review status.`);
        hasErrors = true;
      } else if (phrase.review.status === 'approved' && (!phrase.review.reviewer || !phrase.review.reviewedAt)) {
        console.error(`[FAIL] ${file}: approved ${label} needs reviewer and reviewedAt metadata.`);
        hasErrors = true;
      }
      if (phrase.register && !['informal', 'neutral', 'polite', 'formal'].includes(phrase.register)) {
        console.error(`[FAIL] ${file}: ${label} has an unsupported register value.`);
        hasErrors = true;
      }
      for (const gloss of phrase.wordGlosses ?? []) {
        if (!gloss.malay?.trim() || !gloss.english?.trim() || !['draft', 'approved'].includes(gloss.reviewStatus)) {
          console.error(`[FAIL] ${file}: ${label} contains a malformed word gloss.`);
          hasErrors = true;
        }
        if (gloss.reviewStatus === 'approved' && (!gloss.reviewer || !gloss.reviewedAt)) {
          console.error(`[FAIL] ${file}: approved word gloss in ${label} needs reviewer and reviewedAt metadata.`);
          hasErrors = true;
        }
      }
    }
  }

  // 4. Check task turns have accept and model
  if (!card.task || !Array.isArray(card.task.turns) || card.task.turns.length === 0) {
    console.error(`[FAIL] ${file}: Card task has no turns.`);
    hasErrors = true;
  } else {
    const taskIds = new Set<string>();
    card.task.turns.forEach((turn, idx) => {
      if (!turn.id?.trim() || taskIds.has(turn.id)) {
        console.error(`[FAIL] ${file}: Task turn #${idx + 1} needs a unique stable ID.`); hasErrors = true;
      }
      if (turn.id) taskIds.add(turn.id);
      if (!turn.accept || !Array.isArray(turn.accept) || turn.accept.length === 0) {
        console.error(
          `[FAIL] ${file}: Task turn #${idx + 1} is missing non-empty "accept" list.`
        );
        hasErrors = true;
      }
      if (!turn.model || typeof turn.model !== 'string' || !turn.model.trim()) {
        console.error(
          `[FAIL] ${file}: Task turn #${idx + 1} is missing valid "model" answer.`
        );
        hasErrors = true;
      }
    });
  }

  console.log(`[PASS] ${file} (status: ${card.review?.status || 'draft'})`);
}

const audioManifestPath = path.resolve(projectRoot, 'content/audio/manifest.json');
try {
  const manifest = JSON.parse(fs.readFileSync(audioManifestPath, 'utf-8'));
  const schemaErrors = validateAudioManifest(manifest);
  if (schemaErrors.length) throw new Error(schemaErrors.join(' '));
  const audioIds = new Set<string>();
  for (const asset of manifest.assets) {
    if (!asset.id || audioIds.has(asset.id)) {
      throw new Error(`Malformed or duplicate audio manifest item: ${asset.id ?? '(missing ID)'}`);
    }
    audioIds.add(asset.id);
  }
  const coverageErrors = validateReviewPackSources(cardsForReview, recordsForReview, manifest);
  if (coverageErrors.length) throw new Error(coverageErrors.join('\n'));
  for (const item of manifest.assets) {
    if (item.status === 'planned') continue;
    for (const field of ['normal', 'slow'] as const) {
      const rel = item[field];
      if (rel && !fs.existsSync(path.join(publicDir, rel.replace(/^\//, '')))) throw new Error(`Recorded audio is missing from public assets: ${rel}`);
    }
  }
  const plannedCount = manifest.assets.filter((asset: any) => asset.status === 'planned').length;
  const recordedCount = manifest.assets.length - plannedCount;
  console.log(`[PASS] Audio manifest (${audioIds.size} assets: ${plannedCount} planned, ${recordedCount} recorded/reviewed/approved; no fabricated recordings)`);
  const generatedDir = path.join(projectRoot, 'content/reviews/generated');
  const responsePath = path.join(generatedDir, 'review-responses.jsonl');
  if (!fs.existsSync(responsePath)) throw new Error('Generated review response JSONL is missing; run npm run generate:reviews.');
  const responseRows = fs.readFileSync(responsePath, 'utf8').split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
  const responseIds = new Set(responseRows.map((row: any) => `${row.scenarioId}|${row.itemId}`));
  if (responseIds.size !== responseRows.length) throw new Error('Generated JSONL has duplicate scenario/item IDs.');
  for (const card of cardsForReview) {
    const markdownPath = path.join(generatedDir, `${card.id}-review-pack.md`);
    if (!fs.existsSync(markdownPath)) throw new Error(`Generated pack missing for ${card.id}; run npm run generate:reviews.`);
    const markdown = fs.readFileSync(markdownPath, 'utf8');
    for (const item of expectedReviewItems(card)) {
      if (!markdown.includes(item.id) || !responseIds.has(`${card.id}|${item.id}`)) throw new Error(`${card.id}: generated reviewer output omits ${item.id}.`);
    }
  }
} catch (err) {
  console.error(`[FAIL] content/audio/manifest.json: ${err}`);
  hasErrors = true;
}

if (hasErrors) {
  console.error('\nContent validation FAILED. Fix issues above.');
  process.exit(1);
} else {
  console.log('\nAll content files validated successfully!');
}
