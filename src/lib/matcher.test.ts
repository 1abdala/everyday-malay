import { describe, it, expect } from 'vitest';
import { matchTurn } from './matcher';
import { normalize } from './normalize';
import type { TurnAnswer } from '../types';
import mamakCard from '../../content/cards/mamak-01.json';

describe('Matcher Core Rules', () => {
  it('normalizes case and punctuation properly', () => {
    expect(normalize('Teh Tarik, Satu! (Kurang Manis)?')).toBe(
      'teh tarik satu kurang manis'
    );
  });

  it('maps digits to Malay number words 1-10', () => {
    expect(normalize('roti 2 teh 1')).toBe('roti dua teh satu');
    expect(normalize('meja 10')).toBe('meja sepuluh');
  });

  it('handles address-term stripping when requested', () => {
    expect(normalize('bang kira', true)).toBe('kira');
    expect(normalize('kira bang', true)).toBe('kira');
    expect(normalize('boss teh tarik satu', true)).toBe('teh tarik satu');
    expect(normalize('teh tarik kak', true)).toBe('teh tarik');
  });

  it('handles empty input correctly by failing', () => {
    const dummyTurn: TurnAnswer = {
      accept: ['teh tarik'],
      keywords: [['teh'], ['tarik']],
      model: 'Teh tarik.',
      hint: 'Say teh tarik.'
    };
    const res = matchTurn('   ', dummyTurn);
    expect(res.pass).toBe(false);
    expect(res.by).toBe('none');
    expect(res.nearMiss).toBe(false);
  });

  it('passes on case/punctuation insensitivity', () => {
    const dummyTurn: TurnAnswer = {
      accept: ['teh tarik satu'],
      keywords: [['teh'], ['tarik']],
      model: 'Teh tarik satu.',
      hint: 'Order drink'
    };
    const res = matchTurn('TEH TARIK, SATU!', dummyTurn);
    expect(res.pass).toBe(true);
  });

  it('passes digit-to-word mapped input', () => {
    const dummyTurn: TurnAnswer = {
      accept: ['roti canai dua'],
      keywords: [['roti'], ['canai']],
      model: 'Roti canai dua.',
      hint: 'Food'
    };
    const res = matchTurn('roti canai 2', dummyTurn);
    expect(res.pass).toBe(true);
  });

  it('allows address-term stripping to pass', () => {
    const dummyTurn: TurnAnswer = {
      accept: ['teh tarik satu'],
      keywords: [['teh'], ['tarik']],
      model: 'Teh tarik satu.',
      hint: 'Order'
    };
    // User adds "bang" or "boss" at beginning or end
    expect(matchTurn('bang teh tarik satu', dummyTurn).pass).toBe(true);
    expect(matchTurn('teh tarik satu boss', dummyTurn).pass).toBe(true);
  });

  it('supports fuzzy matching on long words (length >= 5, dist <= 1)', () => {
    const dummyTurn: TurnAnswer = {
      accept: ['roti canai'],
      keywords: [['roti'], ['canai']],
      model: 'Roti canai.',
      hint: 'Order roti'
    };
    // "canay" has distance 1 from "canai" (length 5)
    const res = matchTurn('roti canay', dummyTurn);
    expect(res.pass).toBe(true);
    expect(res.by).toBe('keywords');
  });

  it('rejects fuzzy matching on short words (< 5 chars)', () => {
    const dummyTurn: TurnAnswer = {
      accept: ['teh tarik'],
      keywords: [['teh'], ['tarik']],
      model: 'Teh tarik.',
      hint: 'Drink'
    };
    // "tek" vs "teh" distance 1, but length is 3 (< 5), so must reject
    const res = matchTurn('tek tarik', dummyTurn);
    expect(res.pass).toBe(false);
  });

  it('allows extra words if keyword requirements are met', () => {
    const dummyTurn: TurnAnswer = {
      accept: ['teh tarik'],
      keywords: [['teh'], ['tarik']],
      model: 'Teh tarik.',
      hint: 'Drink'
    };
    const res = matchTurn('saya nak order teh tarik ais sedap', dummyTurn);
    expect(res.pass).toBe(true);
    expect(res.by).toBe('keywords');
  });

  it('detects near misses when at least half the keyword groups match', () => {
    const dummyTurn: TurnAnswer = {
      accept: ['teh tarik satu'],
      keywords: [['teh'], ['tarik']],
      model: 'Teh tarik satu.',
      hint: 'Drink'
    };
    // 1 of 2 groups matched -> 50% >= half -> nearMiss true
    const res = matchTurn('teh panas', dummyTurn);
    expect(res.pass).toBe(false);
    expect(res.nearMiss).toBe(true);
  });
});

describe('Mamak-01 Task Turns Acceptance & Rejection Tests', () => {
  const turns = mamakCard.task.turns;

  // Turn 1: Nak minum apa?
  describe('Turn 1: Drink order', () => {
    const turn = turns[0];

    it('passes on at least 3 accepted variants', () => {
      expect(matchTurn('teh tarik satu', turn).pass).toBe(true);
      expect(matchTurn('satu teh tarik', turn).pass).toBe(true);
      expect(matchTurn('nak teh tarik', turn).pass).toBe(true);
      expect(matchTurn('teh tarik 1 kurang manis', turn).pass).toBe(true);
    });

    it('fails on 3 wrong answers', () => {
      expect(matchTurn('kopi o panas', turn).pass).toBe(false);
      expect(matchTurn('nasi lemak satu', turn).pass).toBe(false);
      expect(matchTurn('nak bayar bil', turn).pass).toBe(false);
    });
  });

  // Turn 2: Makan sini ke tapau?
  describe('Turn 2: Dine-in or takeaway', () => {
    const turn = turns[1];

    it('passes on at least 3 accepted variants', () => {
      expect(matchTurn('makan sini', turn).pass).toBe(true);
      expect(matchTurn('tapau', turn).pass).toBe(true);
      expect(matchTurn('bungkus', turn).pass).toBe(true);
      expect(matchTurn('makan sini je', turn).pass).toBe(true);
    });

    it('fails on 3 wrong answers', () => {
      expect(matchTurn('tidak mahu', turn).pass).toBe(false);
      expect(matchTurn('roti canai', turn).pass).toBe(false);
      expect(matchTurn('terima kasih banyak', turn).pass).toBe(false);
    });
  });

  // Turn 3: Nak makan apa?
  describe('Turn 3: Food order', () => {
    const turn = turns[2];

    it('passes on at least 3 accepted variants', () => {
      expect(matchTurn('roti canai dua', turn).pass).toBe(true);
      expect(matchTurn('dua roti canai', turn).pass).toBe(true);
      expect(matchTurn('roti canai 2 kuah dhal sikit', turn).pass).toBe(true);
      expect(matchTurn('roti canay dua', turn).pass).toBe(true);
    });

    it('fails on 3 wrong answers', () => {
      expect(matchTurn('mee goreng basah', turn).pass).toBe(false);
      expect(matchTurn('teh tarik ais', turn).pass).toBe(false);
      expect(matchTurn('air suam satu', turn).pass).toBe(false);
    });
  });

  // Turn 4: Okey. Itu je?
  describe('Turn 4: Confirmation', () => {
    const turn = turns[3];

    it('passes on at least 3 accepted variants', () => {
      expect(matchTurn('itu je', turn).pass).toBe(true);
      expect(matchTurn('ya itu je', turn).pass).toBe(true);
      expect(matchTurn('dah cukup', turn).pass).toBe(true);
      expect(matchTurn('cukup', turn).pass).toBe(true);
    });

    it('fails on 3 wrong answers', () => {
      expect(matchTurn('tambah lagi satu', turn).pass).toBe(false);
      expect(matchTurn('belum siap', turn).pass).toBe(false);
      expect(matchTurn('berapa harga', turn).pass).toBe(false);
    });
  });

  // Turn 5: Call waiter & ask bill
  describe('Turn 5: Ask for bill', () => {
    const turn = turns[4];

    it('passes on at least 3 accepted variants', () => {
      expect(matchTurn('bang kira', turn).pass).toBe(true);
      expect(matchTurn('kira bang', turn).pass).toBe(true);
      expect(matchTurn('bang nak kira', turn).pass).toBe(true);
      expect(matchTurn('kira', turn).pass).toBe(true);
    });

    it('fails on 3 wrong answers', () => {
      expect(matchTurn('terima kasih bro', turn).pass).toBe(false);
      expect(matchTurn('nak order lagi', turn).pass).toBe(false);
      expect(matchTurn('buka aircond', turn).pass).toBe(false);
    });
  });
});
