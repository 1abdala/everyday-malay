# Everyday Malay — Content Structure & Authoring Guide

This directory holds the lesson cards for the Everyday Malay PWA. Non-developer contributors and native speaker reviewers can edit the JSON files in `cards/` directly or add new scenarios.

## File Format

Each card in `cards/<id>.json` must adhere to the schema:

- **`id`** (string): Unique identifier, e.g. `mamak-01`.
- **`title`** (string): Friendly title displayed in the deck (e.g. "Ordering at a mamak stall").
- **`scene`** (string): One-sentence setting describing the context.
- **`learnerGoal`** (string): One sentence describing what the learner will practise.
- **`icon`** (string): Single emoji representing the scene.
- **`minutes`** (number): Estimated time to complete (e.g. 5 or 6).
- **`variety`** (string): Dialect / register, e.g. "KL spoken Malay".
- **`review`** (object):
  - `status`: `"draft"` or `"approved"`.
  - `by` (string, optional): Name of native reviewer. Required if status is `"approved"`.
  - `date` (string, optional): ISO date of review (YYYY-MM-DD). Required if status is `"approved"`.
- **`dialogue`** (array of lines):
  - `id`: Unique line id (e.g. `line-1`).
  - `who`: `"npc"` (the stall worker / driver) or `"you"` (the learner).
  - `ms`: Malay spoken line.
  - `en`: English translation.
  - `audio`: Object with `normal` and `slow` audio file paths (`/audio/<cardId>/...`).
- **`chips`** (array of comparisons):
  - `spoken`: The colloquial/spoken phrase.
  - `formal`: The textbook/formal Malay equivalent.
  - `note`: Short usage note explaining when locals say it.
- **`phrases`** (ordered array of key phrases): Order entries in the sequence intended for teaching; the learner-facing list can contain more or fewer than five items.
  - `id`: Stable phrase ID; do not change after release.
  - `ms`: The key phrase.
  - `en`: Translation.
  - `review`: `{ status: "draft" | "approved", reviewer, reviewedAt, notes }`. Phrase approval is separate from scenario and matcher-alternative approval.
  - `register`: Optional `informal`, `neutral`, `polite`, or `formal` label.
  - `wordGlosses`: Optional gloss array. Each item needs Malay text, English meaning, and review status. The app only displays glosses explicitly approved with reviewer/date metadata. Never infer these from a phrase translation.
  - `usageNote`: Optional contextual note.
  - `audio`: Optional `normal` and `slow` audio paths.
- **`referencePhrases`** (optional array): Auxiliary reference items outside the core Key Phrases step and task evaluation. Uses the same fields as `phrases`; the current learner UI does not display these items.
- **`task`** (object):
  - `goal`: Clear objective for the learner (e.g. "Order a drink and food, and ask for the bill.").
  - `turns`: Array of turns. Each turn is either:
    - **`npc`** turn: `{ type: "npc", ms: "...", en: "...", audio?: "...", accept: [...], keywords?: [[...]], model: "...", hint: "..." }`
    - **`prompt`** turn: `{ type: "prompt", en: "...", accept: [...], keywords?: [[...]], model: "...", hint: "..." }`
    - `accept`: Array of full phrases that pass exact matching.
    - `keywords`: Array of groups (AND of OR-groups). E.g. `[["teh"], ["tarik"]]` means both "teh" and "tarik" are required.
    - `model`: Canonical response displayed as confirmation and when assisted.
    - `hint`: Helpful nudge shown on the first incorrect attempt.
- **`comprehensionQuestions`** (array): 2–3 draft/approved questions with stable IDs, prompt, 2–4 choices, correct choice ID, explanation, and their own `reviewStatus`. Questions are shown before Key Phrases and may be retried; they do not block lesson progress.

## Review and audio records

- Scenario review records live in `content/reviews/records/`. Line, phrase, question, gloss, and each accepted task alternative are reviewed independently. Tests confirm matcher behavior, not Malay correctness.
- `content/audio/manifest.json` lists planned phrase/dialogue recordings. Empty speaker/license/reviewer metadata means no recording has been delivered or cleared. Normal and slow assets are cached on demand; the manifest does not mean the files exist.
- Current speech synthesis is device-generated interim audio and is not a native Malaysian Malay recording.
- See [the content review workflow](../docs/content-review-workflow.md) before changing any review status.
  - `conclusion` (optional object): Final remark from the NPC ending the task (e.g. `Semua tujuh ringgit.`).

## Content Validation

Run the validator before committing:
```bash
npm run validate
```
This checks stable and unique content IDs, phrase review metadata, comprehension-question shape, task answer presence, audio manifest records, and that scenario-level approval has complete review metadata. It never promotes draft content.
