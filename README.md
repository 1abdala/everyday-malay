# Everyday Malay

## Consultant review brief


**Product stage:** working prototype / pre-release review
**Current playable content:** three scenarios, all marked `draft`
**Product claim:** helps learners practise practical spoken Malaysian Malay in everyday situations
**Not yet supported:** a complete beginner curriculum, proficiency certification, authentic recorded Malay audio, or validated pronunciation assessment

---

## What the product is

Everyday Malay is a mobile-first app for people who want to handle ordinary conversations in Malaysia. Intended learners include expats and foreign professionals, international students, and Malaysians who understand formal Malay but want more confidence with everyday speech.

The product should feel like a knowledgeable local friend helping someone handle a real situation. The current design uses a dark navy interface, bold Arial typography, illustrated scenario cards, and a six-step lesson. It is built as a local-first web app and does not currently have accounts or a backend.

### Current learning path

The Path screen recommends a sequence in one starter chapter, **First Conversations**:

| Order | Scenario ID | Scenario | Current estimated time | Status |
|---|---|---|---:|---|
| 01 | `shop-01` | At the shop counter | 5 min | Draft |
| 02 | `mamak-01` | Ordering at a mamak stall | 6 min | Draft |
| 03 | `grab-01` | Taking a Grab | 5 min | Draft |

Explore lets learners open any scenario currently in the app, regardless of guided order. Future chapters are previews only; there are no playable lessons beyond these three scenarios. They should not be presented as a completed curriculum or certified proficiency levels.

### Current lesson flow

1. **Scene** — brief situation, illustration or animated scenario video, estimated duration, and draft notice.
2. **Listen** — dialogue with per-line translation reveal, an optional Show English toggle, Play all, and Normal/Slow playback.
3. **Understand** — draft meaning questions with retryable feedback before phrase practice. The questions remain draft and do not block progression.
4. **Key Phrases** — Malay phrases with English meanings, audio controls, save-for-review, contextual comparisons, and reviewed glosses only when available.
5. **Task Test** — scripted role-play. Word blocks are now the default response mode; learners may switch to typing. The first incorrect answer gives a hint; another incorrect answer offers a suggested response. Assistance does not prevent completion.
6. **Results** — first-try, hint, and assisted counts, one-time first-completion XP when earned, and actions to continue, retry from the scene, or return to browse.

A completed scenario can be replayed from Scene. A replay does not erase its previous completion or grant its completion XP again. An unfinished lesson stores its current lesson step and role-play draft so it can resume after refresh.

### Progress and rewards

- Progress is stored locally under `em.progress.v2`. Existing `em.progress.v1` data is copied forward on first read and left intact until the user clears local data.
- The optional role-play draft records the current task turn, entered response, input mode, and attempt counters in the existing scenario progress record.
- A first scenario completion awards 10 XP once per stable scenario ID. XP is a small completion reward, not a measure of language ability and not an unlock requirement.
- Completed, in-progress, and not-started are progress states. A reliable independent mastery state has not been implemented.
- There are no accounts, cross-device sync, or server backups. Progress stays in that browser profile and origin.
- Failed task answers are stored locally for troubleshooting/content review. Settings explains local storage, offers a JSON export, and provides explicit delete-all confirmation.
- First-run orientation can be skipped; Start learning opens the short Survival Malay starter. The same starter can be reopened from Path. It reuses draft scenario phrases; asking about price and requesting repetition/slower speech are withheld pending reviewed phrase content.
- A Phrasebook tab lists locally saved phrases.

---

## Current scenarios and content quality

Scenario JSON lives in [`content/cards/`](content/cards/). Content includes the situation, dialogue, English translations, spoken/formal comparisons, key phrases, task turns, accepted answers, matcher keywords, hints, and model responses. Some JSON also includes auxiliary reference phrases not displayed in the learner-facing lesson.

All three scenario records must remain `draft` until the review and approval process is complete. A previous native-speaker review gave useful feedback, but the current complete script and all task alternatives still need line-by-line approval. Do not describe the current content as fully verified.

### Questions for the language reviewer

- Does each line sound natural for the stated setting and target variety?
- Do the English translations communicate intended meaning to a beginner without over-literal or misleading glosses?
- Are address terms, politeness, and colloquial forms appropriate for the speaker relationship and region?
- Do the phrase list, dialogue, task prompt, expected answer, feedback, and accepted alternatives teach the same skill?
- Which answers should be accepted, rejected, or labelled as context-dependent?
- Can you provide and review short word-by-word glosses for key phrases? The schema/UI supports optional glosses, but none are currently approved; they must not be inferred from phrase-level translations.
- What language variety should be the consistent default, and which regional differences need explicit notes?

Review outcomes should be recorded per dialogue line, phrase, comprehension question, task alternative, gloss, and audio item in `content/reviews/records/`. Approval of a phrase does not imply approval of every task matcher alternative that contains it. See [`docs/content-review-workflow.md`](docs/content-review-workflow.md).

---

## Current audio and media behavior

### Scenario videos

Step 1 uses the current scenario videos:

- Shop: `public/videos/storecheckput.mp4`
- Mamak: `public/videos/tehtarekorder.mp4`
- Grab: `public/videos/graborder.mp4`

Videos are muted, looped, contained in a responsive 16:9 panel, and shown only on Step 1. Reduced motion or video failure uses static scenario artwork. The Path/Explore cards remain static. The MP4 files are not included in the service worker's precache list, so offline Step 1 relies on the static fallback.

### Spoken Malay audio

Scenario data has paths for audio, but the repository does not currently contain a complete set of authentic recordings under `public/audio/`. The app attempts browser speech synthesis (`ms-MY`) as a fallback when available. Device voices differ and are not a substitute for a Malaysian speaker. If recording and browser speech both fail, the app now displays an unavailable-audio message. Real listening quality and offline audio have not been validated.

### Microphone recording

The Key Phrases interface offers browser recording practice only after explicit user action and feature detection. It selects a supported MIME type when possible, provides permission/error messages, keeps recordings in page memory, and cleans up tracks/URLs on unmount. This remains experimental until physical-device compatibility and privacy QA are complete.

---

## Product and learning decisions for review

Please assess these questions before recommending more features:

1. **Audience and promise:** Is the target learner specific enough? What should a beginner be able to do after the first 15 minutes and after the first three scenarios?
2. **Onboarding:** What is the smallest useful first-session orientation or placement check? How can we explain the lesson flow without slowing down someone who needs a phrase immediately?
3. **Learning sequence:** Is Shop → Mamak → Grab a sensible beginner sequence based on the actual tasks? What prerequisites or missing foundations should come first?
4. **Word learning:** Should a phrase be taught through reviewed word glosses, word ordering, listening recognition, typed recall, or a short sequence of these? How should support fade without making the task feel like a test too early?
5. **Assessment:** What should completion mean? What evidence would justify a future mastery indicator? Current matcher scores reflect accepted-text matching and assistance use, not speaking ability.
6. **Audio:** Which minimum set of native-speaker recordings would make the current scenarios useful? Please consider speaker consistency, conversational rhythm, licensing, file format, quality review, and offline size.
7. **Content governance:** What should be required before a draft becomes approved? Who reviews regional variation, translations, and accepted answers?
8. **Progress and privacy:** Is local-only progress sufficient for the initial release? What backup, reset, privacy, and data-retention explanation should users see?
9. **Scope and release:** What is genuinely required for a small testable release, and what should wait? Should draft lessons be exposed to public testers?
10. **Usability and accessibility:** What must be tested on actual iOS/Android devices, with keyboard and screen-reader use, and at 200% text scaling?

Please return findings with severity, evidence or user impact, a concrete recommendation, and whether the recommendation is a release blocker or later enhancement.

---

## Known release gaps

### High priority

- Complete a current-script native-speaker review and record decisions without promoting scenarios prematurely.
- Record and license authentic Malaysian Malay audio; `content/audio/manifest.json` currently lists planned assets only. Device speech is clearly an interim fallback.
- Complete the Survival Malay module's price and repeat/slower-speech phrase groups after proficient-speaker review. They are explicitly unavailable instead of being guessed.
- Add reviewed word-level glosses before presenting individual-word meanings. Until then, the app says word breakdown is coming soon.
- Finish a current-script review of dialogue lines, comprehension questions, phrases, and each task alternative. Current review records are pending, not approvals.
- Test microphone permission, browser-supported recording formats, playback, failure messaging, and cleanup on target devices. The feature is experimental.
- Complete keyboard, screen-reader, contrast, text scaling, safe-area, and physical-device QA.
- Complete keyboard, screen-reader, contrast, text scaling, safe-area, and physical-device QA.

### Later product work

- Build additional curriculum only after learning objectives, prerequisites, assessment criteria, and content review are defined.
- Add real audio comprehension items only after audio and comprehension content are reviewed.
- Consider spaced review only after there is a reliable phrase/item data model and evidence about what learners struggle with.
- Define chapter challenges, mastery rules, and test-out routes only after the task data can support valid conclusions.
- Provide a learner progress history and reviewable weak areas without treating XP as proficiency.

---

## Technical setup

### Requirements

- Node.js 22 is used by the GitHub Actions deployment workflow.
- npm and the committed `package-lock.json`.
- No environment variables or backend are required for local development.

### Install and run locally

```bash
npm ci
npm run dev
```

Vite prints the local address (normally `http://localhost:5173/`). To run a second isolated local test instance, use a different origin/port, for example:

```bash
npm run dev -- --host 127.0.0.1 --port 5174 --strictPort
```

`localhost:5173` and `127.0.0.1:5174` have separate browser storage origins. Do not clear learner data to test; use an isolated browser profile or QA origin.

### Checks

```bash
npm test -- --pool=threads --maxWorkers=1 --minWorkers=1
npm run validate
npm run build
```

- `npm test` runs the Vitest suite.
- `npm run validate` checks the scenario JSON files in `content/cards/`.
- `npm run build` runs TypeScript and creates `dist/` plus the PWA service worker.
- Use `npm run preview` after building to inspect the production bundle locally.

### Deployment

Vite is configured with the `/everyday-malay/` base path for GitHub Pages. `.github/workflows/pages.yml` runs tests, content validation, build, and deploy on pushes to `master` or manual workflow dispatch. The configured public URL is `https://1abdala.github.io/everyday-malay/`; verify the deployment and live behavior before sharing it as a current release.

Do not deploy to another provider or promote scenario statuses as part of a content or UX review.

---

## Current verification snapshot

As of 2026-11-07:

- Full Vitest suite: **76 tests passed across 16 files** in a single-worker run.
- Production build: **passed**, including service-worker generation.
- Content validation: all three scenarios passed and remain `draft`; the audio manifest validates 49 planned recording entries and marks none recorded.
- Earlier isolated QA covered the previous Shop → Mamak → Grab flow and 320/360/390/430 CSS pixel Path layouts. This implementation turn was not browser-walked because the local browser automation runtime could not initialize and shell access to loopback was denied.
- New onboarding, Survival Malay, Phrasebook, comprehension, translation reveal, export/delete, audio voice handling, and review-record behavior have component/storage/validator coverage, but still need browser QA.
- Physical mobile devices, microphone behavior, screen-reader use, 200% text scale, browser history Back/Forward, reduced-motion visual fallback, and offline PWA behavior have not been fully tested.

This snapshot is evidence of a working prototype, not a claim that the app is ready for general release or that learning outcomes have been measured.

---

## Project map

- `src/App.tsx` — app shell, navigation, and scenario selection.
- `src/screens/FlashcardsHome.tsx` — Path and Explore discovery screens.
- `src/screens/Card.tsx` — six-step scenario lesson.
- `src/screens/Onboarding.tsx` and `src/screens/SurvivalMalay.tsx` — first-run orientation and compact starter practice.
- `src/screens/Phrasebook.tsx` — saved phrase reference.
- `src/components/TaskTest.tsx` and `src/components/WordBank.tsx` — role-play and word-block response interface.
- `src/lib/storage.ts` — local progress, completion, and XP persistence.
- `src/lib/matcher.ts` — accepted answer and keyword matching.
- `content/cards/*.json` — scenario scripts and learning data.
- `content/reviews/` — native-speaker review packs.
- `content/reviews/records/` — line, phrase, question, alternative, gloss, and audio review status records.
- `content/audio/manifest.json` — planned audio assets and licensing/reviewer metadata; it does not assert those files exist.
- `docs/` — product audit, learner walkthrough, learning research, curriculum map, and release readiness.
- `public/videos/` — Step 1 scenario videos.
- `public/images/` — static scenario artwork and fallback assets.
- `.github/workflows/pages.yml` — GitHub Pages deployment workflow.

## Current design principles

- Keep the illustrated scenario card as the main learning entry point.
- Make practical language available through Explore; do not lock essential phrases behind unrelated XP or lessons.
- Reward meaningful completion once, but do not equate points with proficiency.
- Keep scenario content in `draft` until documented review is complete.
- Prefer small, testable improvements over adding mechanics before the learning experience is reliable.
