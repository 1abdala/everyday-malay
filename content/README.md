# Everyday Malay — Content Structure & Authoring Guide

This directory holds the lesson cards for the Everyday Malay PWA. Non-developer contributors and native speaker reviewers can edit the JSON files in `cards/` directly or add new scenarios.

## File Format

Each card in `cards/<id>.json` must adhere to the schema:

- **`id`** (string): Unique identifier, e.g. `mamak-01`.
- **`title`** (string): Friendly title displayed in the deck (e.g. "Ordering at a mamak stall").
- **`scene`** (string): One-sentence setting describing the context.
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
- **`phrases`** (array of 5 key phrases):
  - `ms`: The key phrase.
  - `en`: Translation.
  - `audio`: Optional `normal` and `slow` audio paths.
- **`task`** (object):
  - `goal`: Clear objective for the learner (e.g. "Order a drink and food, and ask for the bill.").
  - `turns`: Array of turns. Each turn is either:
    - **`npc`** turn: `{ type: "npc", ms: "...", en: "...", audio?: "...", accept: [...], keywords?: [[...]], model: "...", hint: "..." }`
    - **`prompt`** turn: `{ type: "prompt", en: "...", accept: [...], keywords?: [[...]], model: "...", hint: "..." }`
    - `accept`: Array of full phrases that pass exact matching.
    - `keywords`: Array of groups (AND of OR-groups). E.g. `[["teh"], ["tarik"]]` means both "teh" and "tarik" are required.
    - `model`: Canonical response displayed as confirmation and when assisted.
    - `hint`: Helpful nudge shown on the first incorrect attempt.
  - `conclusion` (optional object): Final remark from the NPC ending the task (e.g. `Semua tujuh ringgit.`).

## Content Validation

Run the validator before committing:
```bash
npm run validate
```
This checks for:
1. Duplicate card or dialogue IDs.
2. Missing `accept` or `model` fields in task turns.
3. Audio files for cards marked `approved`.
4. Reviewer name & date for approved cards.
