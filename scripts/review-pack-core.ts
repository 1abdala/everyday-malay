import type { Card } from '../src/types';

export type ReviewRecord = Record<string, any> & { scenarioId: string; reviewStatus: string };
export type AudioManifest = { assets: Array<Record<string, any>> };
export type ReviewRow = {
  scenarioId: string; scenarioTitle: string; itemType: string; itemId: string; itemStatus: string;
  malay: string; english: string; context: string; register: string; glosses: string;
  taskPrompt: string; acceptedAnswers: string; closeAnswers: string; rejectedAlternatives: string;
  hint: string; modelResponse: string; feedbackText: string; comprehension: string;
  audioRequirement: string; audioStatus: string;
  reviewerVerdict: string; revisedMalay: string; revisedEnglish: string; reviewerNotes: string; regionalRegisterComments: string;
};

type ExpectedReview = { type: string; id: string; sourceId: string; text: string };


export function expectedReviewItems(card: Card): ExpectedReview[] {
  const rows: ExpectedReview[] = [];
  card.dialogue.forEach((line) => rows.push({ type: 'dialogue', id: `dialogue:${line.id}`, sourceId: line.id, text: line.ms }));
  card.phrases.forEach((phrase) => rows.push({ type: 'phrase', id: `phrase:${phrase.id}`, sourceId: phrase.id, text: phrase.ms }));
  (card.referencePhrases ?? []).forEach((phrase) => rows.push({ type: 'reference phrase', id: `reference:${phrase.id}`, sourceId: phrase.id, text: phrase.ms }));
  card.chips.forEach((chip, index) => {
    const comparisonId = chip.id ?? `${card.id}-comparison-${String(index + 1).padStart(3, '0')}`;
    rows.push({ type: 'comparison', id: `comparison:${comparisonId}`, sourceId: comparisonId, text: `${chip.spoken} / ${chip.formal}` });
  });
  card.task.turns.forEach((turn, index) => {
    const taskId = turn.id ?? `${card.id}-task-${String(index + 1).padStart(3, '0')}`;
    if (turn.type === 'npc') rows.push({ type: 'task dialogue', id: `task-dialogue:${taskId}`, sourceId: taskId, text: turn.ms });
    rows.push({ type: 'task model response', id: `task-model:${taskId}`, sourceId: taskId, text: turn.model });
    turn.accept.forEach((answer, altIndex) => rows.push({
      type: 'accepted alternative', id: `alternative:${taskId}-alt-${String(altIndex + 1).padStart(3, '0')}`,
      sourceId: answer, text: answer
    }));
  });
  if (card.task.conclusion) rows.push({ type: 'task conclusion', id: `conclusion:${card.id}`, sourceId: card.id, text: card.task.conclusion.ms });
  card.comprehensionQuestions.forEach((question) => rows.push({ type: 'comprehension question', id: `question:${question.id}`, sourceId: question.id, text: question.prompt }));
  [...card.phrases, ...(card.referencePhrases ?? [])].forEach((phrase) => (phrase.wordGlosses ?? []).forEach((gloss, index) => {
    rows.push({ type: 'word gloss', id: `gloss:${phrase.id}:${String(index + 1).padStart(3, '0')}`, sourceId: phrase.id, text: `${gloss.malay} — ${gloss.english}` });
  }));
  return rows;
}

function reviewEntry(record: ReviewRecord, item: ExpectedReview): any {
  if (item.type === 'dialogue') return (record.lineReviews ?? []).find((x: any) => x.lineId === item.sourceId);
  if (item.type === 'phrase') return (record.phraseReviews ?? []).find((x: any) => x.phraseId === item.sourceId);
  if (item.type === 'reference phrase') return (record.referencePhraseReviews ?? []).find((x: any) => x.phraseId === item.sourceId);
  if (item.type === 'comparison') return (record.comparisonReviews ?? []).find((x: any) => x.comparisonId === item.sourceId);
  if (item.type === 'task dialogue' || item.type === 'task model response') return (record.taskTurnReviews ?? []).find((x: any) => x.taskId === item.sourceId && x.itemType === item.type);
  if (item.type === 'accepted alternative') return (record.taskAlternativeReviews ?? []).find((x: any) => x.alternativeId === item.id.slice('alternative:'.length));
  if (item.type === 'task conclusion') return (record.conclusionReviews ?? []).find((x: any) => x.conclusionId === item.sourceId);
  if (item.type === 'comprehension question') return (record.comprehensionReviews ?? []).find((x: any) => x.questionId === item.sourceId);
  return (record.glossReviews ?? []).find((x: any) => x.glossId === item.id.slice('gloss:'.length));
}

export function validateReviewPackSources(cards: Card[], records: ReviewRecord[], manifest: AudioManifest): string[] {
  const errors: string[] = [];
  const cardIds = new Set<string>();
  for (const card of cards) {
    if (!card.id?.trim() || cardIds.has(card.id)) errors.push(`Missing or duplicate scenario ID: ${card.id || '(empty)'}`);
    cardIds.add(card.id);
    const allIds = expectedReviewItems(card).map((item) => item.id);
    const seen = new Set<string>();
    for (const id of allIds) {
      if (seen.has(id)) errors.push(`${card.id}: duplicated review item ID ${id}`);
      seen.add(id);
    }
  }
  const recordMap = new Map<string, ReviewRecord>();
  for (const record of records) {
    if (!record.scenarioId || recordMap.has(record.scenarioId)) errors.push(`Missing or duplicate review record scenario ID: ${record.scenarioId || '(empty)'}`);
    recordMap.set(record.scenarioId, record);
    if (record.reviewStatus === 'approved' && (!record.reviewer || !record.reviewedAt)) errors.push(`${record.scenarioId}: approved review record lacks reviewer metadata`);
    for (const [field, entries] of Object.entries(record)) if (Array.isArray(entries)) {
      for (const entry of entries as any[]) {
        if (!['pending', 'approved', 'revise', 'needs-discussion'].includes(entry.status)) errors.push(`${record.scenarioId}: item in ${field} has invalid review status ${entry.status}`);
        if (entry.status === 'approved' && (!entry.reviewer || !entry.reviewedAt)) errors.push(`${record.scenarioId}: approved item in ${field} lacks reviewer metadata`);
      }
    }
  }
  for (const card of cards) {
    const record = recordMap.get(card.id);
    if (!record) { errors.push(`${card.id}: missing review record`); continue; }
    const expected = expectedReviewItems(card);
    const expectedAlternatives = new Set(card.task.turns.flatMap((turn, index) => turn.accept.map((_, altIndex) => `${turn.id ?? `${card.id}-task-${String(index + 1).padStart(3, '0')}`}-alt-${String(altIndex + 1).padStart(3, '0')}`)));
    const recordedAlternatives = new Set((record.taskAlternativeReviews ?? []).map((item: any) => item.alternativeId));
    for (const id of expectedAlternatives) if (!recordedAlternatives.has(id)) errors.push(`${card.id}: missing review record for task alternative ${id}`);
    for (const item of expected) {
      const entry = reviewEntry(record, item);
      if (!entry) errors.push(`${card.id}: missing review record for ${item.id}`);
      else if (entry.status === 'approved' && (!entry.reviewer || !entry.reviewedAt)) errors.push(`${card.id}: ${item.id} is approved without reviewer metadata`);
    }
    for (const collection of ['lineReviews', 'phraseReviews', 'referencePhraseReviews', 'comparisonReviews', 'taskTurnReviews', 'taskAlternativeReviews', 'conclusionReviews', 'comprehensionReviews', 'glossReviews'] as const) {
      const entries = record[collection] ?? [];
      const ids = entries.map((entry: any) => collection === 'lineReviews' ? entry.lineId
        : collection === 'phraseReviews' || collection === 'referencePhraseReviews' ? entry.phraseId
          : collection === 'comparisonReviews' ? entry.comparisonId
              : collection === 'taskTurnReviews' ? `${entry.taskId}:${entry.itemType ?? 'model'}`
              : collection === 'taskAlternativeReviews' ? entry.alternativeId
                : collection === 'conclusionReviews' ? entry.conclusionId
                  : collection === 'comprehensionReviews' ? entry.questionId : entry.glossId);
      if (ids.some((id: string) => !id) || new Set(ids).size !== ids.length) errors.push(`${card.id}: missing or duplicate IDs in ${collection}`);
    }
    const ids = (manifest.assets ?? []).filter((asset) => asset.scenarioId === card.id).map((asset) => asset.id);
    if (new Set(ids).size !== ids.length) errors.push(`${card.id}: duplicate audio manifest ID`);
    const reviewedAudioIds = new Set((record.audioReviews ?? []).map((item: any) => item.assetId));
    for (const audioId of ids) if (!reviewedAudioIds.has(audioId)) errors.push(`${card.id}: missing audio review record for ${audioId}`);
    for (const asset of (manifest.assets ?? []).filter((candidate) => candidate.scenarioId === card.id)) {
      const audioReview = (record.audioReviews ?? []).find((item: any) => item.assetId === asset.id);
      if (asset.status === 'approved' && asset.reviewStatus !== 'approved') errors.push(`${card.id}: ${asset.id} audio status is approved without approved reviewStatus.`);
      if (asset.reviewStatus === 'approved' && (audioReview?.status !== 'approved' || !audioReview.reviewer || !audioReview.reviewedAt)) errors.push(`${card.id}: ${asset.id} is marked audio-review approved without reviewer metadata in the review record.`);
    }
    const currentAudioIds = new Set((manifest.assets ?? []).filter((asset) => asset.scenarioId === card.id).map((asset) => asset.id));
    for (const audioId of reviewedAudioIds) if (!currentAudioIds.has(audioId)) errors.push(`${card.id}: stale audio review record ${audioId}`);
  }
  const allAudioIds = (manifest.assets ?? []).map((asset) => asset.id);
  if (allAudioIds.some((id) => !id) || new Set(allAudioIds).size !== allAudioIds.length) errors.push('Audio manifest has missing or duplicate asset IDs');
  return errors;
}

export function buildReviewRows(card: Card, record: ReviewRecord, manifest: AudioManifest): ReviewRow[] {
  const audioFor = (text: string) => (manifest.assets ?? []).filter((asset) => asset.scenarioId === card.id && asset.malay === text);
  const row = (item: ExpectedReview, fields: Partial<ReviewRow> = {}): ReviewRow => {
    const entry = reviewEntry(record, item);
    const audio = audioFor(item.text);
    return {
      scenarioId: card.id, scenarioTitle: card.title, itemType: item.type, itemId: item.id,
      itemStatus: entry?.status ?? 'MISSING REVIEW RECORD', malay: item.text, english: '', context: '', register: '', glosses: '',
      taskPrompt: '', acceptedAnswers: '', closeAnswers: '', rejectedAlternatives: '', hint: '', modelResponse: '', feedbackText: '', comprehension: '',
      audioRequirement: audio.length ? audio.map((asset) => `${asset.type}: normal=${asset.normal || 'not planned'}, slow=${asset.slow || 'not planned'} (${asset.status})`).join('; ') : 'No matching audio asset planned; reviewer may request one.',
      audioStatus: audio.map((asset) => asset.status).join(', ') || 'not planned', reviewerVerdict: '', revisedMalay: '', revisedEnglish: '', reviewerNotes: '', regionalRegisterComments: '',
      ...fields
    };
  };
  const rows: ReviewRow[] = [];
  for (const line of card.dialogue) {
    const item = { type: 'dialogue', id: `dialogue:${line.id}`, sourceId: line.id, text: line.ms };
    rows.push(row(item, { english: line.en, context: `Dialogue speaker: ${line.who}. Scenario variety: ${card.variety}. Assess register and speaker relationship.` }));
  }
  for (const phrase of card.phrases) {
    const item = { type: 'phrase', id: `phrase:${phrase.id}`, sourceId: phrase.id, text: phrase.ms };
    rows.push(row(item, { english: phrase.en, register: phrase.register ?? 'Reviewer to assess; not specified', context: phrase.usageNote ?? 'Core lesson phrase', glosses: (phrase.wordGlosses ?? []).map((g) => `${g.malay} = ${g.english} [${g.reviewStatus}]`).join('; ') || 'No proposed gloss; do not infer one.', audioRequirement: audioFor(phrase.ms).map((asset) => `${asset.normal || 'normal not planned'}; ${asset.slow || 'slow not planned'} [${asset.status}]`).join('; ') || 'Phrase audio not planned.' }));
  }
  for (const phrase of card.referencePhrases ?? []) {
    const item = { type: 'reference phrase', id: `reference:${phrase.id}`, sourceId: phrase.id, text: phrase.ms };
    rows.push(row(item, { english: phrase.en, register: phrase.register ?? 'Reviewer to assess; not specified', context: 'Auxiliary reference phrase; currently stored in JSON but not displayed in the learner lesson UI.', glosses: (phrase.wordGlosses ?? []).map((g) => `${g.malay} = ${g.english} [${g.reviewStatus}]`).join('; ') || 'No proposed gloss; do not infer one.', audioRequirement: audioFor(phrase.ms).map((asset) => `${asset.normal || 'normal not planned'}; ${asset.slow || 'slow not planned'} [${asset.status}]`).join('; ') || 'Reference phrase audio not planned.' }));
  }
  for (const chip of card.chips) {
    const comparisonId = chip.id ?? `${card.id}-comparison-${String(card.chips.indexOf(chip) + 1).padStart(3, '0')}`;
    const item = { type: 'comparison', id: `comparison:${comparisonId}`, sourceId: comparisonId, text: `${chip.spoken} / ${chip.formal}` };
    rows.push(row(item, { english: chip.note, context: 'Spoken/formal comparison. Confirm whether the forms are equivalent in this situation; assess register and regional fit.' }));
  }
  card.task.turns.forEach((turn, index) => {
    const taskId = turn.id ?? `${card.id}-task-${String(index + 1).padStart(3, '0')}`;
    if (turn.type === 'npc') {
      const dialogueItem = { type: 'task dialogue', id: `task-dialogue:${taskId}`, sourceId: taskId, text: turn.ms };
      rows.push(row(dialogueItem, { english: turn.en, taskPrompt: turn.ms, context: `Role-play line (${index + 1} of ${card.task.turns.length}); assess speech, translation and context.`, audioRequirement: audioFor(turn.ms).map((asset) => `${asset.normal || 'normal not planned'}; ${asset.slow || 'slow not planned'} [${asset.status}]`).join('; ') || 'Task line audio not separately planned.' }));
    }
    const acceptedAnswers = turn.accept.join(' | ');
    const closeAnswers = turn.keywords?.length
      ? `No explicit close-answer list. Current matcher may return close when at least ceil(${turn.keywords.length}/2) keyword groups match. Groups: ${turn.keywords.map((group) => `[${group.join(' OR ')}]`).join(' AND ')}`
      : 'No explicit close-answer list; partial phrase overlap may be shown as close.';
    const modelItem = { type: 'task model response', id: `task-model:${taskId}`, sourceId: taskId, text: turn.model };
    rows.push(row(modelItem, {
      english: turn.type === 'prompt' ? turn.en : turn.en,
      taskPrompt: turn.type === 'prompt' ? turn.en : turn.ms,
      acceptedAnswers,
      closeAnswers,
      rejectedAlternatives: (turn as any).reject?.join(' | ') || 'None explicitly configured in scenario source; reviewer may suggest examples.',
      hint: turn.hint,
      modelResponse: turn.model,
      context: `Role-play goal: ${card.task.goal}; task ${index + 1} of ${card.task.turns.length}.`,
      feedbackText: 'Success: “Betul! (Correct)” and “One suggested answer”. On second incorrect attempt: “Suggested response” followed by a reconstruction requirement.'
    }));
    turn.accept.forEach((answer, altIndex) => {
      const altId = `${taskId}-alt-${String(altIndex + 1).padStart(3, '0')}`;
      const altItem = { type: 'accepted alternative', id: `alternative:${altId}`, sourceId: answer, text: answer };
      rows.push(row(altItem, { english: 'Reviewer: assess whether this response meets the task goal in this context.', taskPrompt: turn.type === 'prompt' ? turn.en : turn.ms, acceptedAnswers: answer, context: `Configured accepted alternative for ${taskId}. Software tests do not establish linguistic appropriateness.` }));
    });
  });
  for (const question of card.comprehensionQuestions) {
    const item = { type: 'comprehension question', id: `question:${question.id}`, sourceId: question.id, text: question.prompt };
    const correct = question.choices.find((choice) => choice.id === question.correctChoiceId);
    rows.push(row(item, { english: question.prompt, comprehension: `Options: ${question.choices.map((choice) => `${choice.id}. ${choice.text}${choice.id === question.correctChoiceId ? ' [correct key; reviewer to verify]' : ''}`).join(' | ')}. Explanation: ${question.explanation}`, context: `Comprehension question status: ${question.reviewStatus}. Validate the keyed answer and explanation against the dialogue. Correct option currently keyed: ${correct?.text ?? 'MISSING'}.` }));
  }
  if (card.task.conclusion) {
    const item = { type: 'task conclusion', id: `conclusion:${card.id}`, sourceId: card.id, text: card.task.conclusion.ms };
    rows.push(row(item, { english: card.task.conclusion.en, context: 'Scenario wrap-up response; assess meaning and fit with the completed role-play.', audioRequirement: audioFor(card.task.conclusion.ms).map((asset) => `${asset.normal || 'normal not planned'}; ${asset.slow || 'slow not planned'} [${asset.status}]`).join('; ') || 'No dedicated conclusion audio in the pilot manifest.' }));
  }
  for (const phrase of [...card.phrases, ...(card.referencePhrases ?? [])]) {
    (phrase.wordGlosses ?? []).forEach((gloss, index) => {
      const item = { type: 'word gloss', id: `gloss:${phrase.id}:${String(index + 1).padStart(3, '0')}`, sourceId: phrase.id, text: `${gloss.malay} — ${gloss.english}` };
      rows.push(row(item, { english: gloss.english, glosses: `${gloss.malay} = ${gloss.english}`, context: `Current gloss status: ${gloss.reviewStatus}; reviewer metadata: ${gloss.reviewer ?? 'none'} / ${gloss.reviewedAt ?? 'none'}.` }));
    });
  }
  return rows;
}

function md(value: string): string { return value.replace(/\|/g, '\\|').replace(/\n/g, '<br>'); }
export function renderScenarioMarkdown(card: Card, record: ReviewRecord, rows: ReviewRow[]): string {
  const reviewRecordStatus = record.reviewStatus;
  const out = [
    '<!-- GENERATED FILE. Do not edit this file as source; edit the review record or source JSON, then regenerate. -->',
    `# ${card.title} — native-speaker review`, '',
    `- Scenario ID: \`${card.id}\``, `- Status: **${card.review.status.toUpperCase()}**`, `- Setting: ${card.scene}`,
    `- Learner goal: ${card.learnerGoal}`, `- Target variety: ${card.variety}`, `- Estimated lesson time: ${card.minutes} minutes`,
    `- Review record: \`content/reviews/records/${card.id}-review-record.json\` (record status: ${reviewRecordStatus})`, '',
    'This is a generated review aid, not an approval. Keep the scenario draft until each required item has been reviewed and the app content is updated deliberately.',
    '', '## Dialogue', '',
    '| ID | Speaker | Malay | Current English | Gloss (if supplied) | Register / relationship context | Audio requirement | Status | Verdict | Revised Malay | Revised English | Notes / regional comments |',
    '|---|---|---|---|---|---|---|---|---|---|---|---|'
  ];
  const add = (r: ReviewRow) => out.push(`| ${md(r.itemId)} | ${md(r.context)} | ${md(r.malay)} | ${md(r.english)} | ${md(r.glosses)} | ${md(r.register)} | ${md(r.audioRequirement)} | ${md(r.itemStatus)} |  |  |  |  |`);
  rows.filter((r) => r.itemType === 'dialogue').forEach(add);
  out.push('', '## Spoken / formal comparisons', '', '| ID | Malay forms | Usage note | Review status | Verdict | Revised wording | Register / regional notes |', '|---|---|---|---|---|---|---|');
  rows.filter((r) => r.itemType === 'comparison').forEach((r) => out.push(`| ${md(r.itemId)} | ${md(r.malay)} | ${md(r.english)} | ${md(r.itemStatus)} |  |  |  |`));
  out.push('', '## Core phrases', '', '| ID | Malay | Current English | Proposed gloss | Register / usage context | Audio | Status | Verdict | Revised Malay | Revised English | Notes |', '|---|---|---|---|---|---|---|---|---|---|---|');
  rows.filter((r) => r.itemType === 'phrase').forEach((r) => out.push(`| ${md(r.itemId)} | ${md(r.malay)} | ${md(r.english)} | ${md(r.glosses)} | ${md(`${r.register}; ${r.context}`)} | ${md(r.audioRequirement)} | ${md(r.itemStatus)} |  |  |  |  |`));
  out.push('', '## Role-play tasks', '');
  card.task.turns.forEach((turn, index) => {
    const taskId = turn.id ?? `${card.id}-task-${String(index + 1).padStart(3, '0')}`;
    const r = rows.find((item) => item.itemType === 'task model response' && item.itemId === `task-model:${taskId}`)!;
    out.push(`### ${taskId}`, '', `- Prompt: ${turn.type === 'prompt' ? turn.en : `${turn.ms} — ${turn.en}`}`, `- Accepted answers (configured): ${turn.accept.map((x) => `\`${x}\``).join(', ')}`, `- Close answers: ${r.closeAnswers}`, `- Rejected alternatives: ${(turn as any).reject?.join(', ') || 'None explicitly stored; reviewer may suggest responses that should fail.'}`, `- Hint: ${turn.hint}`, `- Model response: \`${turn.model}\``, `- Feedback copy: ${r.feedbackText}`, `- Matcher keywords: ${turn.keywords?.map((g) => `[${g.join(' OR ')}]`).join(' AND ') || 'none'}`, `- Review status: ${r.itemStatus}`, '', '| Item ID | Response | Verdict | Revised Malay | Notes: intended meaning, naturalness, politeness, region/register, task alignment |', '|---|---|---|---|---|');
    out.push('', '| Item ID / kind | Current Malay / context | Verdict | Revised Malay | Revised English | Reviewer notes: meaning, naturalness, politeness, region/register, task alignment |');
    out.push('|---|---|---|---|---|---|');
    rows.filter((item) => ['task dialogue', 'task model response', 'accepted alternative'].includes(item.itemType)
      && (item.itemId.includes(taskId))).forEach((item) => out.push(`| ${md(item.itemId)} (${md(item.itemType)}) | ${md(item.malay)}${item.english ? ` — ${md(item.english)}` : ''} |  |  |  |  |`));
  });
  out.push('', '## Comprehension questions', '', '| ID | Prompt | Options and current answer key | Explanation | Review status | Verdict | Revised Malay | Revised English | Reviewer notes / regional-register comments |', '|---|---|---|---|---|---|---|---|---|');
  rows.filter((r) => r.itemType === 'comprehension question').forEach((r) => out.push(`| ${md(r.itemId)} | ${md(r.english)} | ${md(r.comprehension)} | ${md(r.context)} | ${md(r.itemStatus)} |  |  |  |  |`));
  out.push('', '## Scenario wrap-up', '');
  if (card.task.conclusion) {
    const item = rows.find((r) => r.itemType === 'task conclusion');
    out.push(`- ID: \`${item?.itemId ?? `conclusion:${card.id}`}\``, `- Malay: ${card.task.conclusion.ms}`, `- English: ${card.task.conclusion.en}`, `- Review status: ${item?.itemStatus ?? 'MISSING REVIEW RECORD'}`, '- Verdict: Approve / Revise / Needs discussion', '- Revised Malay / English: ____________________', '- Reviewer notes (meaning, naturalness, politeness, regional/register fit): ____________________');
  } else out.push('No scenario wrap-up line is configured.');
  out.push('', '## Reference phrases', '', card.referencePhrases?.length ? 'These are stored in JSON and are not currently shown in the learner lesson UI. Review them as references, not taught phrases.' : 'No auxiliary reference phrases are present.', '', '| ID | Malay | English | Status | Verdict | Revised Malay | Revised English | Notes / regional-register comments |', '|---|---|---|---|---|---|---|---|');
  rows.filter((r) => r.itemType === 'reference phrase').forEach((r) => out.push(`| ${md(r.itemId)} | ${md(r.malay)} | ${md(r.english)} | ${md(r.itemStatus)} |  |  |  |  |`));
  out.push('', '## Reviewer sign-off', '', '- Reviewer name: ____________________', '- Review date: ____________________', '- Overall recommendation: Approve / Revise / Needs discussion', '- Scenario status remains `draft` until an editor applies approved decisions and validation passes.', '');
  return out.join('\n');
}

export function renderResponseJsonl(rows: ReviewRow[]): string {
  return rows.map((row) => JSON.stringify({ ...row, reviewerVerdict: '', revisedMalay: '', revisedEnglish: '', reviewerNotes: '', regionalRegisterComments: '', reviewer: '', reviewedAt: '' })).join('\n') + '\n';
}
