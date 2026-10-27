# Everyday Malay — Native-Speaker Review Pack

**Pack date:** 2026-10-25  |  **Purpose:** Review the current draft content line by line before audio recording.

> This is a review instrument, not certification. Source Malay and translations below are copied from the current JSON. The pack records user-reported native-speaker feedback, but does not independently approve all added alternatives. Matcher tests demonstrate software behavior only; they do not establish linguistic correctness.

**User-reported native-speaker feedback:** The app owner reports that a native-speaker friend confirmed the then-current core phrases and meanings and suggested the alternatives and teaching order recorded below. This note records that feedback; it is not an independent review or a blanket approval of every newly added alternative. All source scenarios remain `draft`.

## Source manifest

| Scenario ID | Current source filename | Status in source | Duration |
|---|---|---|---:|
| `shop-01` | [`shop-01.json`](../cards/shop-01.json) | `draft` | 5 min |
| `mamak-01` | [`mamak-01.json`](../cards/mamak-01.json) | `draft` | 6 min |
| `grab-01` | [`grab-01.json`](../cards/grab-01.json) | `draft` | 5 min |

**Matcher source reviewed:** [`src/lib/matcher.ts`](../../src/lib/matcher.ts) and [`src/lib/normalize.ts`](../../src/lib/normalize.ts).

## How to review

- Mark every dialogue line, comparison, core phrase, role-play turn, and auxiliary reference item individually as **Approve**, **Revise**, or **Needs discussion**.
- Assess intended meaning, naturalness in the stated situation, politeness/address terms, regional/register fit, and cross-part consistency. Record a proposed correction only when needed; leave the original wording visible.
- The `accept` lists and `keywords` are the current software configuration, not a recommendation that every listed form is linguistically appropriate.
- Keep each source scenario marked `draft` until the separate editorial approval workflow is complete.

## Matcher behavior recorded for review

- Keyword arrays use **AND of OR-groups**: every bracketed group must match at least one of its alternatives. For example, `[a OR b] AND [c]` requires one of `a`/`b` and also `c`.
- Keyword matching checks normalized tokens. A keyword token may match exactly, or with edit distance at most one when the keyword has five or more characters.
- Normalization applies NFKC, lowercases, replaces listed punctuation with spaces, maps digits 1–10 to Malay number words, and collapses whitespace. For exact matching on turns without keyword groups, leading/trailing address terms may also be stripped. Keyword-constrained turns do not use address stripping in the exact-match shortcut.
- **Software behavior is not linguistic validation.** A passing test means the current matcher accepts that input under these rules; it does not mean a Malaysian Malay speaker has approved the phrase.

---

## At the shop counter — `shop-01`

**Situation:** You're at a mini-market with a bottle of water.
**Scenario learning objective (current task goal):** Ask for water, say no to a bag, pay by card, and decline a receipt.
**Stated variety / register:** KL spoken Malay
**Estimated duration:** 5 minutes
**Source review status:** `draft`

### Scenario framing review

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Objective and situation are clear and appropriate?** [ ] Yes  [ ] No  **Notes:** ____________________
- **Variety / register label is accurate and appropriately scoped?** [ ] Yes  [ ] No  **Specify / explain:** ____________________
- **Proposed correction / reviewer comments:** ____________________

### Dialogue — exact current source text

#### line-1 — you

**Malay:** Maaf, ada air mineral?
**Current English translation:** Excuse me, do you have bottled water?

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### line-2 — npc

**Malay:** Ada. Kat belakang sana.
**Current English translation:** Yes. Over at the back.

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### line-3 — you

**Malay:** Terima kasih.
**Current English translation:** Thank you.

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### line-4 — npc

**Malay:** Nak beg plastik?
**Current English translation:** Want a plastic bag?

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### line-5 — you

**Malay:** Tak nak plastik.
**Current English translation:** I don't want a plastic bag.

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### line-6 — npc

**Malay:** Semua lapan ringgit lima puluh sen.
**Current English translation:** Eight ringgit fifty altogether.

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### line-7 — you

**Malay:** Boleh bayar guna kad?
**Current English translation:** Can I pay by card?

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### line-8 — npc

**Malay:** Boleh.
**Current English translation:** Yes.

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### line-9 — npc

**Malay:** Nak resit?
**Current English translation:** Want a receipt?

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### line-10 — you

**Malay:** Tak nak resit.
**Current English translation:** I don't want a receipt.

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

### Spoken / formal comparisons — exact current source text

#### Comparison 1

**Spoken:** tak payah
**Formal / alternate form:** tidak perlu
**Current teaching note:** spoken, very common

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### Comparison 2

**Spoken:** tak nak
**Formal / alternate form:** tidak mahu
**Current teaching note:** spoken

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### Comparison 3

**Spoken:** kat belakang
**Formal / alternate form:** di belakang
**Current teaching note:** "kat" is everyday speech

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### Comparison 4

**Spoken:** guna
**Formal / alternate form:** menggunakan
**Current teaching note:** spoken drops me-

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

### Core Key Phrases step — exact current source text

**These are the phrases currently supplied to the lesson’s core Key Phrases step, in teaching order.**

#### Core phrase 1

**Malay:** Ada plastik tak?
**Current English translation:** Do you have a plastic bag?

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### Core phrase 2

**Malay:** Tak nak plastik.
**Current English translation:** I don't want a plastic bag.

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### Core phrase 3

**Malay:** Boleh bayar guna kad?
**Current English translation:** Can I pay by card?

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### Core phrase 4

**Malay:** Nak resit.
**Current English translation:** I'd like a receipt.

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### Core phrase 5

**Malay:** Tak nak resit.
**Current English translation:** I don't want a receipt.

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

### Role-play objective and turns — exact current task configuration

**Task objective:** Ask for water, say no to a bag, pay by card, and decline a receipt.

#### Turn 1 — prompt

**Learner prompt (English):** Ask if the shop has bottled water.
**Expected / model response:** Maaf, ada air mineral?
**Current hint:** Ask: do you have ___?
**Currently accepted exact-answer entries:**
- ada air mineral
- maaf ada air mineral
- ada air mineral tak
- bang ada air mineral
- kak ada air mineral
**Current matcher keyword condition:** [ada] AND [air] AND [mineral]

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Matcher accepts suitable responses and rejects unsuitable ones?** [ ] Yes  [ ] No  **Examples / notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### Turn 2 — npc

**Other speaker (Malay):** Nak beg plastik?
**Current English translation:** Want a plastic bag?
**Expected / model response:** Tak nak plastik.
**Current hint:** Say 'no need'.
**Currently accepted exact-answer entries:**
- tak payah
- tak apa
- takpe
- takpe terima kasih
- tak payah terima kasih
- tak apa terima kasih
- tak nak plastik
**Current matcher keyword condition:** No keyword groups; this turn relies on the accepted-answer list (after the app’s normalization rules).

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Matcher accepts suitable responses and rejects unsuitable ones?** [ ] Yes  [ ] No  **Examples / notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### Turn 3 — prompt

**Learner prompt (English):** Ask if you can pay by card.
**Expected / model response:** Boleh bayar guna kad?
**Current hint:** Ask: can I pay ___ card?
**Currently accepted exact-answer entries:**
- boleh bayar guna kad
- boleh bayar pakai kad
- boleh guna kad
- boleh bayar kad
**Current matcher keyword condition:** [boleh] AND [bayar OR guna OR pakai] AND [kad]

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Matcher accepts suitable responses and rejects unsuitable ones?** [ ] Yes  [ ] No  **Examples / notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### Turn 4 — npc

**Other speaker (Malay):** Nak resit?
**Current English translation:** Want a receipt?
**Expected / model response:** Tak nak resit.
**Current hint:** Say no thanks.
**Currently accepted exact-answer entries:**
- tak nak
- tak nak terima kasih
- tak payah
- tak payah terima kasih
- tak apa
- takpe
- takpe terima kasih
- tak nak resit
**Current matcher keyword condition:** No keyword groups; this turn relies on the accepted-answer list (after the app’s normalization rules).

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Matcher accepts suitable responses and rejects unsuitable ones?** [ ] Yes  [ ] No  **Examples / notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

## Ordering at a mamak stall — `mamak-01`

**Situation:** You sit down at a mamak stall. A waiter walks over.
**Scenario learning objective (current task goal):** Order a drink and food, and ask for the bill.
**Stated variety / register:** Klang Valley / West Coast Colloquial Spoken Malay
**Estimated duration:** 6 minutes
**Source review status:** `draft`

### Scenario framing review

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Objective and situation are clear and appropriate?** [ ] Yes  [ ] No  **Notes:** ____________________
- **Variety / register label is accurate and appropriately scoped?** [ ] Yes  [ ] No  **Specify / explain:** ____________________
- **Proposed correction / reviewer comments:** ____________________

### Dialogue — exact current source text

#### line-1 — npc

**Malay:** Nak minum apa?
**Current English translation:** What would you like to drink?

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### line-2 — you

**Malay:** Teh tarik satu. Kurang manis.
**Current English translation:** One teh tarik. Less sweet.

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### line-3 — npc

**Malay:** Makan sini ke tapau?
**Current English translation:** Eat here or takeaway?

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### line-4 — you

**Malay:** Makan sini.
**Current English translation:** Eat here.

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### line-5 — npc

**Malay:** Nak makan apa?
**Current English translation:** What would you like to eat?

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### line-6 — you

**Malay:** Roti canai dua. Kuah dhal sikit.
**Current English translation:** Two roti canai. A little dhal curry.

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### line-7 — npc

**Malay:** Okey. Itu saja?
**Current English translation:** Okay. That's all?

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### line-8 — you

**Malay:** Itu saja.
**Current English translation:** That's all.

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### line-9 — you

**Malay:** Bang, kira.
**Current English translation:** Bro, the bill please.

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### line-10 — npc

**Malay:** Semua tujuh ringgit.
**Current English translation:** Seven ringgit altogether.

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

### Spoken / formal comparisons — exact current source text

#### Comparison 1

**Spoken:** nak
**Formal / alternate form:** hendak, mahu
**Current teaching note:** daily speech vs. writing and speeches

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### Comparison 2

**Spoken:** tu je
**Formal / alternate form:** itu saja
**Current teaching note:** Teach the full form ‘Itu saja’ first, followed by the colloquial shortened form ‘Tu je’.

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### Comparison 3

**Spoken:** sikit
**Formal / alternate form:** sedikit
**Current teaching note:** In this order, ‘kuah dhal sikit’ requests a small amount of dhal gravy with the roti canai. ‘Tambah dhal sikit’ is another natural alternative.

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### Comparison 4

**Spoken:** ke
**Formal / alternate form:** atau
**Current teaching note:** "or" in questions: makan sini ke tapau?

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### Comparison 5

**Spoken:** tapau
**Formal / alternate form:** bungkus
**Current teaching note:** takeaway, at stalls

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### Comparison 6

**Spoken:** kira
**Contextual comparison under review — equivalence not assumed:** minta bil (contextual)
**Current teaching note:** In this mamak exchange, ‘kira’ asks the staff to total the bill; it is not a universal synonym for bayar or minta bil.

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

### Core Key Phrases step — exact current source text

**These are the phrases currently supplied to the lesson’s core Key Phrases step, in teaching order.**

**Teaching order:** The full form “Itu saja.” is presented before the colloquial shortened form “Tu je.”

#### Core phrase 1

**Malay:** Nak ___ satu.
**Current English translation:** I want one ___.

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### Core phrase 2

**Malay:** Makan sini ke tapau?
**Current English translation:** Eat here or takeaway?

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### Core phrase 3

**Malay:** Kurang manis.
**Current English translation:** Less sweet.

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### Core phrase 4

**Malay:** Kuah dhal sikit.
**Current English translation:** A little dhal gravy.

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### Core phrase 5

**Malay:** Tambah dhal sikit.
**Current English translation:** Add a little dhal gravy.

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### Core phrase 6

**Malay:** Itu saja.
**Current English translation:** That's all.

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### Core phrase 7

**Malay:** Tu je.
**Current English translation:** That's all. Colloquial shortened form; taught after ‘Itu saja’.

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### Core phrase 8

**Malay:** Bang, kira.
**Current English translation:** Bro, the bill please.

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

### Auxiliary reference phrases — not part of the core Key Phrases step

**These items are stored under `referencePhrases` in the current JSON, separate from core phrases and task turns. They are not currently displayed in the learner-facing lesson UI.**

#### Auxiliary reference 1

**Malay:** Bang, tolong kira.
**Current English translation:** Please tally the bill. A contextual request; usage may vary by situation.

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### Auxiliary reference 2

**Malay:** Tolong kira ni.
**Current English translation:** Please total this. The bill is understood from context.

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### Auxiliary reference 3

**Malay:** Nak bil.
**Current English translation:** I'd like the bill. A direct bill request; usage is not identical to ‘kira’.

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### Auxiliary reference 4

**Malay:** Semua berapa?
**Current English translation:** How much is everything? Asks for the total; it is not the same as requesting the bill.

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

### Role-play objective and turns — exact current task configuration

**Task objective:** Order a drink and food, and ask for the bill.

#### Turn 1 — npc

**Other speaker (Malay):** Nak minum apa?
**Current English translation:** What would you like to drink?
**Expected / model response:** Teh tarik satu.
**Current hint:** Say the drink, then the number.
**Currently accepted exact-answer entries:**
- teh tarik satu
- satu teh tarik
- nak teh tarik
- teh tarik satu kurang manis
- teh tarik satu je
**Current matcher keyword condition:** [teh] AND [tarik]

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Matcher accepts suitable responses and rejects unsuitable ones?** [ ] Yes  [ ] No  **Examples / notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### Turn 2 — npc

**Other speaker (Malay):** Makan sini ke tapau?
**Current English translation:** Eat here or takeaway?
**Expected / model response:** Makan sini.
**Current hint:** Choose: eat here, or takeaway.
**Currently accepted exact-answer entries:**
- makan sini
- sini
- tapau
- bungkus
- makan sini je
**Current matcher keyword condition:** [sini OR tapau OR bungkus]

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Matcher accepts suitable responses and rejects unsuitable ones?** [ ] Yes  [ ] No  **Examples / notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### Turn 3 — npc

**Other speaker (Malay):** Nak makan apa?
**Current English translation:** What would you like to eat?
**Expected / model response:** Roti canai dua.
**Current hint:** Say the food, then the number.
**Currently accepted exact-answer entries:**
- roti canai dua
- dua roti canai
- nak roti canai dua
- roti canai dua kuah dhal sikit
**Current matcher keyword condition:** [roti] AND [canai]

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Matcher accepts suitable responses and rejects unsuitable ones?** [ ] Yes  [ ] No  **Examples / notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### Turn 4 — npc

**Other speaker (Malay):** Okey. Itu saja?
**Current English translation:** Okay. That's all?
**Expected / model response:** Itu saja.
**Current hint:** Say that's all.
**Currently accepted exact-answer entries:**
- itu je
- itu saja
- tu je
- itu sahaja
- ya itu je
- itu je terima kasih
- dah cukup
- cukup
**Current matcher keyword condition:** No keyword groups; this turn relies on the accepted-answer list (after the app’s normalization rules).

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Matcher accepts suitable responses and rejects unsuitable ones?** [ ] Yes  [ ] No  **Examples / notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### Turn 5 — prompt

**Learner prompt (English):** You finished eating. Call the waiter and ask for the bill.
**Expected / model response:** Bang, kira.
**Current hint:** Call the waiter and ask him to tally the bill.
**Currently accepted exact-answer entries:**
- bang kira
- kira bang
- bang nak kira
- ane kira
- bang tolong kira
- tolong kira ni
- nak bil
- minta bil
- boleh minta bil
- bang minta bil
**Current matcher keyword condition:** [kira OR minta] AND [bang OR ane OR bil]

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Matcher accepts suitable responses and rejects unsuitable ones?** [ ] Yes  [ ] No  **Examples / notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### Task conclusion

**Speaker:** npc
**Malay:** Semua tujuh ringgit.
**Current English translation:** Seven ringgit altogether.

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

## Taking a Grab — `grab-01`

**Situation:** Your Grab has arrived. You get in.
**Scenario learning objective (current task goal):** Confirm the trip, get the aircon on, and tell the driver where to stop.
**Stated variety / register:** KL spoken Malay
**Estimated duration:** 5 minutes
**Source review status:** `draft`

### Scenario framing review

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Objective and situation are clear and appropriate?** [ ] Yes  [ ] No  **Notes:** ____________________
- **Variety / register label is accurate and appropriately scoped?** [ ] Yes  [ ] No  **Specify / explain:** ____________________
- **Proposed correction / reviewer comments:** ____________________

### Dialogue — exact current source text

#### line-1 — npc

**Malay:** Hi. Nak pergi KLCC, ya?
**Current English translation:** Hi. Going to KLCC, right?

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### line-2 — you

**Malay:** Ya, betul.
**Current English translation:** Yes, that's right.

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### line-3 — you

**Malay:** Boleh pasang aircond?
**Current English translation:** Can you turn on the aircon?

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### line-4 — npc

**Malay:** Boleh.
**Current English translation:** Sure.

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### line-5 — npc

**Malay:** Ikut jalan mana ya?
**Current English translation:** Which route should I take?

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### line-6 — you

**Malay:** Ikut GPS je.
**Current English translation:** Just follow the GPS.

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### line-7 — you

**Malay:** Berhenti depan sikit, tepi kedai tu.
**Current English translation:** Stop a bit ahead, next to that shop.

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### line-8 — npc

**Malay:** Kat sini boleh?
**Current English translation:** Here okay?

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### line-9 — you

**Malay:** Boleh. Terima kasih, bang.
**Current English translation:** Okay. Thanks, bro.

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

### Spoken / formal comparisons — exact current source text

#### Comparison 1

**Spoken:** nak pergi
**Formal / alternate form:** hendak pergi
**Current teaching note:** spoken

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### Comparison 2

**Spoken:** ni / tu
**Formal / alternate form:** ini / itu
**Current teaching note:** spoken

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### Comparison 3

**Spoken:** kat sini
**Formal / alternate form:** di sini
**Current teaching note:** "kat" is everyday speech

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### Comparison 4

**Spoken:** depan sikit
**Formal / alternate form:** sedikit ke hadapan
**Current teaching note:** giving directions

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### Comparison 5

**Spoken:** boleh?
**Formal / alternate form:** bolehkah?
**Current teaching note:** In this spoken question, boleh is used without -kah.

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### Comparison 6

**Spoken:** je
**Formal / alternate form:** sahaja
**Current teaching note:** spoken

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

### Core Key Phrases step — exact current source text

**These are the phrases currently supplied to the lesson’s core Key Phrases step, in teaching order.**

#### Core phrase 1

**Malay:** Boleh pasang aircond?
**Current English translation:** Can you turn on the aircon?

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### Core phrase 2

**Malay:** Ikut GPS je.
**Current English translation:** Just follow the GPS.

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### Core phrase 3

**Malay:** Turun sini.
**Current English translation:** Get off here.

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### Core phrase 4

**Malay:** Depan sikit.
**Current English translation:** A bit ahead.

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### Core phrase 5

**Malay:** Boleh. Terima kasih, bang.
**Current English translation:** Okay. Thanks, bro.

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

### Auxiliary reference phrases — not part of the core Key Phrases step

**These items are stored under `referencePhrases` in the current JSON, separate from core phrases and task turns. They are not currently displayed in the learner-facing lesson UI.**

#### Auxiliary reference 1

**Malay:** Kiri / kanan / lurus.
**Current English translation:** Left / right / straight.

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### Auxiliary reference 2

**Malay:** Lalu mana ya?
**Current English translation:** Which way should I go? Optional route-question alternative; commonness in this exact Grab-driver context has not been confirmed.

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

### Role-play objective and turns — exact current task configuration

**Task objective:** Confirm the trip, get the aircon on, and tell the driver where to stop.

#### Turn 1 — npc

**Other speaker (Malay):** Hi. Nak pergi KLCC, ya?
**Current English translation:** Hi. Going to KLCC, right?
**Expected / model response:** Ya, betul.
**Current hint:** Say yes.
**Currently accepted exact-answer entries:**
- ya
- ya betul
- betul
- ya betul klcc
**Current matcher keyword condition:** No keyword groups; this turn relies on the accepted-answer list (after the app’s normalization rules).

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Matcher accepts suitable responses and rejects unsuitable ones?** [ ] Yes  [ ] No  **Examples / notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### Turn 2 — prompt

**Learner prompt (English):** You're hot. Ask the driver to turn on the aircon.
**Expected / model response:** Boleh pasang aircond?
**Current hint:** Ask: can you ___ the aircon?
**Currently accepted exact-answer entries:**
- boleh pasang aircond
- boleh pasang aircon
- boleh buka aircond
- boleh pasang aircond tak
**Current matcher keyword condition:** [boleh] AND [pasang OR buka] AND [aircond OR aircon]

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Matcher accepts suitable responses and rejects unsuitable ones?** [ ] Yes  [ ] No  **Examples / notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### Turn 3 — npc

**Other speaker (Malay):** Ikut jalan mana ya?
**Current English translation:** Which route should I take?
**Expected / model response:** Ikut GPS je.
**Current hint:** Tell him to follow the GPS.
**Currently accepted exact-answer entries:**
- ikut gps je
- ikut gps
- ikut gps je bang
- ikut gps je ya
**Current matcher keyword condition:** [ikut] AND [gps]

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Matcher accepts suitable responses and rejects unsuitable ones?** [ ] Yes  [ ] No  **Examples / notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

#### Turn 4 — prompt

**Learner prompt (English):** You're almost there. Tell the driver you want to get off here.
**Expected / model response:** Turun sini.
**Current hint:** Say that you want to get off here.
**Currently accepted exact-answer entries:**
- berhenti kat sini
- berhenti sini
- stop kat sini
- stop sini
- turun sini
**Current matcher keyword condition:** [berhenti OR stop] AND [sini]

- **Review decision:** [ ] Approve  [ ] Revise  [ ] Needs discussion
- **Intended meaning confirmed?** [ ] Yes  [ ] No  **Clarify:** ____________________
- **Natural in the target situation?** [ ] Yes  [ ] No  **Context / notes:** ____________________
- **Politeness / address terms appropriate?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Regional / register fit:** ____________________
- **Consistent with dialogue, translation, phrase list, and task?** [ ] Yes  [ ] No  [ ] N/A  **Notes:** ____________________
- **Matcher accepts suitable responses and rejects unsuitable ones?** [ ] Yes  [ ] No  **Examples / notes:** ____________________
- **Proposed correction (if needed):** ____________________
- **Reviewer comments:** ____________________

## Context-sensitive expressions and focused reviewer questions

These flags identify expressions that need a context-sensitive judgment. They are not declarations that the forms are wrong or approved.

### Shop Counter (`shop-01`)

- **Primary declines and retained alternatives:** “Tak nak plastik.” and “Tak nak resit.” are the current core forms; the task also retains “tak payah”, “tak apa”, and “takpe” alternatives. Are these clear and appropriate for declining each item in this exchange?
- **“Kat belakang sana.” → “Yes. Over at the back.”** Does the English preserve the intended location and emphasis of `sana`?
- **Payment scope:** The current phrase/task teaches card payment only. Does the dialogue, phrase list, translation, and task objective consistently represent that scope?
- **Phrase alignment:** Review the current core list (“Ada plastik tak?”, “Tak nak plastik.”, “Boleh bayar guna kad?”, “Nak resit.”, “Tak nak resit.”) against the dialogue and task. “Ada plastik tak?” and “Nak resit.” are standalone useful expressions, not turns currently spoken in the scripted exchange.

### Mamak Stall (`mamak-01`)

- **“Ane kira”:** The current task explicitly lists this as an accepted answer. Is `Ane` appropriate for the intended Klang Valley / West Coast speaker, audience, and mamak setting? What register or community context does it carry? Do not treat it as universally interchangeable with “Bang, kira.”
- **Bill-request alternatives:** The task now accepts “Bang, tolong kira.”, “Tolong kira ni.”, and “Nak bil.” as exact alternatives. Review their suitability in this situation; preserve the distinction between asking staff to total the bill and directly asking for a bill. The stored reference “Semua berapa?” asks for the total and is deliberately not accepted as a bill-request answer.
- **“minta bil” / “boleh minta bil” / “bang minta bil”:** These forms remain in the task acceptance configuration, and `minta bil (contextual)` remains a comparison label. Are they natural in this exact setting and register? Do not treat them as universally interchangeable with contextual `kira`.
- **Matcher boundary:** The task retains explicit accepted answers and now requires `[kira OR minta] AND [bang OR ane OR bil] AND [kira OR bil]`. The added final group blocks `bang minta` as an incomplete request while the listed complete alternatives pass. The keyword configuration still accepts some unlisted combinations containing the required terms; review the balance between flexibility and precision.

#### Bill-request matcher examples

The outcomes below are **code-derived expectations from the current matcher configuration**. Exact accepted answers are checked first; other responses must satisfy all three keyword groups. These outcomes describe software behavior only; they do not establish linguistic naturalness or equivalence.

| Test response | Current expected matcher outcome | Reviewer notes |
|---|---|---|
| `Bang, kira.` | PASS — configured accepted answer; satisfies all keyword groups. | Intended pass. Review whether the address term and request are natural in this setting. |
| `Ane kira.` | PASS — configured accepted answer; satisfies all keyword groups. | Configured pass; linguistic appropriateness needs review. |
| `Boleh minta bil.` | PASS — configured accepted answer; satisfies all keyword groups. | Configured pass; contextual equivalence to the bill-tally request needs review. |
| `Bang, tolong kira.` | PASS — configured accepted answer; satisfies all keyword groups. | Suggested alternative; review how the added `tolong` request nuance fits this setting. |
| `Tolong kira ni.` | PASS — configured exact answer; does not satisfy the second group by itself. | “Ni” depends on the bill being clear from context. |
| `Nak bil.` | PASS — configured exact answer; does not satisfy the first group by itself. | Direct bill request; review contextual fit separately from “kira”. |
| `Semua berapa?` | FAIL — not listed and does not satisfy the keyword groups. | It asks for the total; deliberately not accepted as a bill-request answer. |
| `kira` | FAIL — does not satisfy the second keyword group. | Should fail as a standalone response; does it communicate enough in context? |
| `bang minta` | FAIL — matches the first two groups but lacks `kira` or `bil` for the final group. | Intended fail as incomplete. |
| `nak makan apa` | FAIL — does not satisfy the keyword groups. | Should fail as unrelated to the bill request. |
- **Dhal requests:** The core list contains “Kuah dhal sikit.” and the native-speaker-suggested alternative “Tambah dhal sikit.” Review the intended amount and whether the second wording has the intended meaning in this food-order context.
- **“Itu saja” / “Tu je”:** The current dialogue and model use “Itu saja.” first; the key phrase list places the colloquial shortened form “Tu je.” second. Confirm that this beginner-first ordering is clear and that “Tu je” is appropriately labelled as colloquial.
- **Variety metadata:** Is “Klang Valley / West Coast Colloquial Spoken Malay” accurate and not overly broad for all lines and task answers in this scenario?

### Taking a Grab (`grab-01`)

- **Current route exchange:** Driver: “Ikut jalan mana ya?” / “Which route should I take?” Passenger: “Ikut GPS je.” / “Just follow the GPS.” This core exchange is retained. “Lalu mana ya?” is stored as an optional reference alternative; its commonness in this exact Grab-driver context has not been confirmed. Review it without treating it as approved.
- **Current get-off-here task:** The model is now “Turun sini.” and the English prompt asks the learner to tell the driver they want to get off here. The existing keyword groups remain `[berhenti OR stop] AND [sini]`; “Turun sini” is accepted as an explicit exact answer. Does this wording clearly fit the intended task?
- **Core versus auxiliary phrase:** “Kiri / kanan / lurus.” and “Lalu mana ya?” are stored under `referencePhrases`, outside the core Key Phrases step and role-play turns; the current learner UI does not display them. Is that appropriate for optional reference material?
- **“Boleh pasang aircond?” and “Depan sikit.”:** Are these natural in the intended ride context, and do their current dialogue and phrase translations preserve the intended meaning?

## Reviewer summary

**Reviewer:** ____________________  **Date:** ____________________  **Regional / language expertise:** ____________________

| Scenario | Line-level items reviewed? | Open questions / corrections | Recommendation |
|---|---|---|---|
| `shop-01` | [ ] Yes  [ ] No | ____________________ | [ ] Approve  [ ] Revise  [ ] Needs discussion |
| `mamak-01` | [ ] Yes  [ ] No | ____________________ | [ ] Approve  [ ] Revise  [ ] Needs discussion |
| `grab-01` | [ ] Yes  [ ] No | ____________________ | [ ] Approve  [ ] Revise  [ ] Needs discussion |

> Reviewer decisions apply to the reviewed items and context recorded here. They do not automatically change source status. Apply approved editorial decisions separately and retain the draft status until the project’s review workflow is complete.
