# Content review workflow

## Status policy

All current scenarios, phrases, comprehension questions, and alternatives remain draft/pending unless a proficient Malaysian Malay reviewer has explicitly approved that individual item. Implementation tests establish software behavior only; they do not establish linguistic correctness.

## Review order

For each item in `content/reviews/records/<scenarioId>-review-record.json`:

1. Review the Malay line/phrase/response in its full situation and dialogue context.
2. Check intended meaning and English translation.
3. Check naturalness, politeness/address terms, regional variety, and register.
4. Confirm the same communicative goal is taught, prompted, accepted by the matcher, and explained in feedback.
5. Mark that individual record `approved`, `revise`, or `needs-discussion`; add reviewer identity, date, and notes. Never approve alternatives by association with the phrase they resemble.
6. Record audio licensing, speaker/recording details, and audio review separately in the manifest and review record.
7. Only after all required records are explicitly approved may an editor consider changing the scenario-level status. The validator never promotes status.

## Reviewer exports and return

Run `npm run generate:reviews` to create Markdown packs and `content/reviews/generated/review-responses.jsonl`. See [the generated-pack instructions](../content/reviews/generated/README.md). The exports are derived artifacts; the JSON in `content/reviews/records/` remains the review source of record. Reviewers should make one verdict for each stable item ID, including each accepted matcher alternative. An editor may merge a completed JSONL using `npm run merge:reviews -- <file>`; the merge updates review records only and never changes scenario JSON or promotes a scenario.

## Current records

- `shop-01-review-record.json`
- `mamak-01-review-record.json`
- `grab-01-review-record.json`

They are generated from current source IDs and intentionally start as `draft` with item statuses `pending`. They are review instruments, not approval certificates.

## Gloss policy

Do not infer a word-by-word gloss from a phrase translation. A gloss may be shown only when the gloss itself has reviewer identity/date and an approved status. Until then the app displays “Word breakdown coming soon.”

## Audio policy

Every proposed recording has separate normal/slow paths and blank speaker, date, and license metadata until it exists and is cleared for use. Do not label browser speech synthesis as native audio. Do not check recordings into the manifest as available until the files and rights are verified.
