import { describe, expect, it } from 'vitest';
import shop from '../content/cards/shop-01.json';
import mamak from '../content/cards/mamak-01.json';
import grab from '../content/cards/grab-01.json';
import shopRecord from '../content/reviews/records/shop-01-review-record.json';
import mamakRecord from '../content/reviews/records/mamak-01-review-record.json';
import grabRecord from '../content/reviews/records/grab-01-review-record.json';
import manifest from '../content/audio/manifest.json';
import { buildReviewRows, expectedReviewItems, renderScenarioMarkdown, renderResponseJsonl, validateReviewPackSources } from './review-pack-core';

const cards = [shop, mamak, grab] as any[];
const records = [shopRecord, mamakRecord, grabRecord] as any[];

describe('review pack generation and coverage', () => {
  it('covers current scenario learner-facing lines, task answers and comprehension items', () => {
    expect(validateReviewPackSources(cards, records, manifest)).toEqual([]);
    for (let i = 0; i < cards.length; i++) {
      const items = expectedReviewItems(cards[i]);
      const rows = buildReviewRows(cards[i], records[i], manifest);
      expect(rows.length).toBeGreaterThanOrEqual(items.length);
      expect(new Set(rows.map((row) => row.itemId)).size).toBe(rows.length);
      const markdown = renderScenarioMarkdown(cards[i], records[i], rows);
      expect(markdown).toContain('Review status:');
      for (const item of items) expect(markdown).toContain(item.id);
      expect(rows.every((row) => row.itemStatus !== 'MISSING REVIEW RECORD')).toBe(true);
      expect(renderResponseJsonl(rows).trim().split('\n')).toHaveLength(rows.length);
    }
  });

  it('rejects missing, duplicate, and unrecorded item IDs', () => {
    expect(validateReviewPackSources([shop, shop] as any[], [shopRecord] as any[], manifest).some((error) => error.includes('duplicate scenario ID'))).toBe(true);
    const missing = structuredClone(shopRecord) as any;
    missing.comparisonReviews.pop();
    expect(validateReviewPackSources([shop] as any[], [missing], manifest).some((error) => error.includes('missing review record for comparison:'))).toBe(true);
    const duplicate = structuredClone(shopRecord) as any;
    duplicate.lineReviews.push(duplicate.lineReviews[0]);
    expect(validateReviewPackSources([shop] as any[], [duplicate], manifest).some((error) => error.includes('duplicate IDs'))).toBe(true);
  });

  it('refuses item approval without reviewer metadata', () => {
    const record = structuredClone(shopRecord) as any;
    record.lineReviews[0].status = 'approved';
    expect(validateReviewPackSources([shop] as any[], [record], manifest).some((error) => error.includes('approved item') && error.includes('reviewer metadata'))).toBe(true);
  });
});
