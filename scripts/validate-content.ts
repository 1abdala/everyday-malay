import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Card } from '../src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const cardsDir = path.resolve(projectRoot, 'content/cards');
const publicDir = path.resolve(projectRoot, 'public');

let hasErrors = false;
const seenCardIds = new Set<string>();

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
  if (isApproved) {
    if (!card.review?.by || !card.review?.date) {
      console.error(
        `[FAIL] ${file}: Approved card is missing "review.by" or "review.date".`
      );
      hasErrors = true;
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

  // 4. Check task turns have accept and model
  if (!card.task || !Array.isArray(card.task.turns) || card.task.turns.length === 0) {
    console.error(`[FAIL] ${file}: Card task has no turns.`);
    hasErrors = true;
  } else {
    card.task.turns.forEach((turn, idx) => {
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

if (hasErrors) {
  console.error('\nContent validation FAILED. Fix issues above.');
  process.exit(1);
} else {
  console.log('\nAll content files validated successfully!');
}
