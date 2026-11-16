import { normalize, isAddressTerm } from './normalize';
import type { TurnAnswer, MatchResult } from '../types';

export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const row = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) {
    row[j] = j;
  }

  for (let i = 1; i <= a.length; i++) {
    let prev = i - 1;
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const temp = row[j];
      if (a[i - 1] === b[j - 1]) {
        row[j] = prev;
      } else {
        row[j] = Math.min(prev + 1, row[j] + 1, row[j - 1] + 1);
      }
      prev = temp;
    }
  }

  return row[b.length];
}

/**
 * Checks if the address term is specifically the point of the turn.
 * It is the point of the turn if any keyword group consists solely of address terms,
 * or if every accepted answer consists solely of address terms.
 */
function isAddressPointOfTurn(turn: TurnAnswer): boolean {
  if (turn.keywords && turn.keywords.length > 0) {
    const hasAddressOnlyGroup = turn.keywords.some((group) =>
      group.length > 0 && group.every((word) => isAddressTerm(normalize(word)))
    );
    if (hasAddressOnlyGroup) return true;
  }

  return false;
}

/**
 * Matcher for task turns.
 */
export function matchTurn(input: string, turn: TurnAnswer): MatchResult {
  const normInput = normalize(input, false);
  if (!normInput || normInput.length > 500) {
    return { status: 'incorrect', pass: false, by: 'none', nearMiss: false };
  }

  const addressIsPoint = isAddressPointOfTurn(turn);
  const normInputNoAddress = addressIsPoint ? normInput : normalize(input, true);

  // 1. Exact match check against all accepted answers
  for (const acc of turn.accept) {
    const normAcc = normalize(acc, false);
    const normAccNoAddress = addressIsPoint ? normAcc : normalize(acc, true);
    const allowAddressStripping = !turn.keywords || turn.keywords.length === 0;

    if (
      normInput === normAcc ||
      (allowAddressStripping && (
        normInputNoAddress === normAcc ||
        normInput === normAccNoAddress ||
        normInputNoAddress === normAccNoAddress
      ))
    ) {
      return { status: 'accepted', pass: true, by: 'exact', nearMiss: false };
    }
  }

  // 2. Keyword groups check (AND of OR-groups)
  if (turn.keywords && turn.keywords.length > 0) {
    // Check against tokens of input (using both with and without address terms)
    const tokens = Array.from(new Set([...normInput.split(' '), ...normInputNoAddress.split(' ')]));

    let matchedGroups = 0;
    const missingGroupIndices: number[] = [];

    turn.keywords.forEach((group, idx) => {
      const groupMatched = group.some((keyword) => {
        const normKey = normalize(keyword);
        return tokens.some((token) => {
          if (token === normKey) return true;
          // Token match = exact, or edit distance <= 1 when the word length >= 5
          if (normKey.length >= 5 && levenshtein(normKey, token) <= 1) {
            return true;
          }
          return false;
        });
      });

      if (groupMatched) {
        matchedGroups++;
      } else {
        missingGroupIndices.push(idx);
      }
    });

    if (matchedGroups === turn.keywords.length) {
      return { status: 'accepted', pass: true, by: 'keywords', nearMiss: false };
    }

    const nearMiss =
      matchedGroups >= Math.ceil(turn.keywords.length / 2) &&
      matchedGroups < turn.keywords.length;

    return { status: nearMiss ? 'close' : 'incorrect', pass: false, by: 'none', nearMiss };
  }

  // 3. If no keywords defined, check for token overlap with accepted answers for nearMiss
  const inputTokens = normInput.split(' ');
  let nearMiss = false;
  for (const acc of turn.accept) {
    const accTokens = normalize(acc).split(' ');
    if (accTokens.length > 1) {
      const matchCount = accTokens.filter((t) => inputTokens.includes(t)).length;
      if (matchCount >= Math.ceil(accTokens.length / 2)) {
        nearMiss = true;
        break;
      }
    }
  }

  return { status: nearMiss ? 'close' : 'incorrect', pass: false, by: 'none', nearMiss };
}
