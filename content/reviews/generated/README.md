# Generated native-speaker review packs

These files are generated from `content/cards/`, `content/reviews/records/`, and `content/audio/manifest.json`. They are review aids, not source content and not evidence of approval. Do not edit a generated pack as the authoritative record; keep the historical hand-written review documents unchanged.

## Generate

Run `npm run generate:reviews`. This validates source IDs and required item coverage before writing one Markdown pack per scenario plus `review-responses.jsonl` here. Generated files begin with a warning comment so they are identifiable.

## Review

For each item, choose exactly one verdict: `Approve`, `Revise`, or `Needs discussion`. Add any proposed Malay or English revision and reviewer notes, especially about intended meaning, naturalness in this setting, politeness/address terms, regional/register fit, and dialogue/translation/task consistency. The current text and answer keys are shown for comparison; they are not pre-approved. Software matcher outcomes do not establish linguistic correctness.

Please do not mark a whole scenario approved merely because most lines look acceptable. Review each line, task prompt/model/accepted alternative, comparison, comprehension question, gloss (if any), and audio item separately. The overall scenario stays `draft` until an editor applies the decisions and the documented approval workflow is complete.

## Return structured responses

The JSONL file contains one JSON object per review item with stable `scenarioId`, `itemType`, and `itemId`. Fill in `reviewerVerdict`, `revisedMalay`, `revisedEnglish`, `reviewerNotes`, `regionalRegisterComments`, `reviewer`, and `reviewedAt`; leave the source identity fields unchanged. Keep one line per item and valid JSON on every line. The JSONL is a response template. An editor must inspect and merge responses into the matching record in `content/reviews/records/`; it does not directly edit scenario JSON or publish content.

The generator intentionally writes only into this `generated/` directory. It never overwrites the historical Markdown pack or source review records.
