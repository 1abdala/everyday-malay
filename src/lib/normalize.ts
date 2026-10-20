const DIGIT_MAP: Record<string, string> = {
  '1': 'satu',
  '2': 'dua',
  '3': 'tiga',
  '4': 'empat',
  '5': 'lima',
  '6': 'enam',
  '7': 'tujuh',
  '8': 'lapan',
  '9': 'sembilan',
  '10': 'sepuluh'
};

const ADDRESS_TERMS = new Set(['bang', 'kak', 'boss', 'abang']);

/**
 * Normalizes text:
 * 1. NFKC normalization
 * 2. Lowercase
 * 3. Replace punctuation (. , ! ? ' " ( )) with space
 * 4. Replace digits 1-10 with Malay words
 * 5. Collapse whitespace and trim
 * 6. Optionally strip leading or trailing address term (bang, kak, boss, abang)
 */
export function normalize(text: string, stripAddress: boolean = false): string {
  if (!text) return '';

  let res = text.normalize('NFKC').toLowerCase();

  // Strip punctuation (. , ! ? ' " ( ))
  res = res.replace(/[.,!?'"()]/g, ' ');

  // Replace digit numbers 1-10 (handle 10 before 1)
  res = res.replace(/\b10\b/g, DIGIT_MAP['10']);
  for (let i = 9; i >= 1; i--) {
    const reg = new RegExp(`\\b${i}\\b`, 'g');
    res = res.replace(reg, DIGIT_MAP[String(i)]);
  }

  // Collapse whitespace
  res = res.replace(/\s+/g, ' ').trim();

  if (stripAddress && res.length > 0) {
    const tokens = res.split(' ');
    // Leading address term
    if (tokens.length > 1 && ADDRESS_TERMS.has(tokens[0])) {
      tokens.shift();
    }
    // Trailing address term
    if (tokens.length > 1 && ADDRESS_TERMS.has(tokens[tokens.length - 1])) {
      tokens.pop();
    }
    res = tokens.join(' ');
  }

  return res;
}

export function isAddressTerm(word: string): boolean {
  return ADDRESS_TERMS.has(word.toLowerCase());
}
