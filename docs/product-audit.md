# Everyday Malay product audit

**Audit date:** 2026-11-07
**Scope:** current Vite/React application, the three draft scenarios, and a browser walkthrough on the isolated local QA origin `http://127.0.0.1:5174/everyday-malay/`.

## Executive summary

The existing app is a coherent, mobile-first prototype with a distinctive dark visual identity, illustrated scenario cards, a useful guided/independent split, and a functional six-step lesson. All three current role-plays can be completed and their completion/XP appears on Path. This audit reproduced two critical defects, now fixed in the current working tree: refresh no longer loses an in-progress role-play draft, and unavailable audio now reports a visible status. The product still lacks authentic packaged recordings; synthetic speech is only a device fallback and may be missing or unsuitable.

The browser pass and current automated checks support a strong prototype baseline. This is not yet a release-ready beginner course: there is no onboarding or comprehension assessment, only three draft scenarios, no working listening in this browser, no review system, no chapter challenge, and no documented native-speaker approvals.

## What already works well

- The Path starts with the recommended first scene, shows chapter objective, completion progress, next action, status labels, and planned future content. Explore exposes all three current scenarios independently.
- Scenario order and numbering are consistent: `shop-01` 01, `mamak-01` 02, `grab-01` 03 (`src/lib/learningPath.ts`). IDs remain stable.
- The lesson has one visible step at a time, a clear 01/06–06/06 indicator, action-labelled Continue buttons, one-step Back, and a persistent footer on the first five steps (`src/screens/Card.tsx`).
- Task input supports typed Malay and a word bank. A wrong first answer gives a hint; a second wrong answer reveals a neutral suggested response; the learner can continue and complete without penalty.
- Completion and first-completion XP persist together in `em.progress.v1`; repeated opening of an already completed Mamak result did not show a fresh reward. The QA run showed +10 XP per first completion and 30 XP after all three.
- Results summarize the actual role-play's first-try, hint, and assisted counts and provide Path, retry, and browse-return actions.
- Step 1 uses the mapped scenario video; the observed Shop, Mamak, and Grab videos played muted, looped, and at 16:9. The visible scenario cards remain static.
- The three current content records all remain `draft` and pass the content validator.

## What works but needs improvement

| Priority | Finding | Evidence and impact |
|---|---|---|
| P0 — fixed, automated + isolated browser verified | Role-play progress was not resumable within a task. | Originally reproduced by answering Mamak turn 1, advancing to turn 2, and refreshing. `CardProgress` now has an optional `taskDraft`; the isolated QA browser confirmed it returned to turn 2 with the partial response restored. XP/completion flow remains separate. |
| P0 — feedback fixed; real audio still missing | Audio controls previously failed without learner feedback. | No real recordings exist under `public/audio/`, despite scenario JSON referencing `/audio/...`. The QA browser has no Web Speech API. Speech fallback now emits an error and the lesson/audio control displays “Audio unavailable on this device.” This fixes silent failure but does not provide usable audio in that browser. |
| P1 | Feedback confirms matching, not communicative quality. | Incorrect answers get a generic hint and then one suggested response. There is no explanation of missing meaning/intent, and string keyword match is not an assessment of spoken language or proficiency. Avoid labelling these results as mastery. |
| P1 | The role-plays are scripted checks rather than adaptive conversations. | Each task uses a fixed `accept` list and keyword conditions in the JSON; NPC flow does not respond dynamically to the learner's meaning beyond pass/fail. This is reliable for the current small draft set but does not yet model open conversation. |
| P1 | Some lesson steps introduce many items at once. | The Key Phrases step contains 7 Shop, 8 Mamak, and 5 Grab phrases. Mamak includes core expressions that are not all practiced in the task. There is no quick comprehension check before the scored role-play. |
| P1 | Audio confidence and record-practice behaviour need a capability-aware design. | `src/components/PhraseList.tsx` uses `getUserMedia` and `MediaRecorder`, hardcodes `audio/webm`, discards errors, and keeps Blob URLs only in component state. Browser permission/MIME/playback was not tested in this pass. |
| P2 | Retry history is not retained. | The progress model stores one `bestTask`, but `completeScenario` replaces it with the latest run; the name implies best-attempt semantics while implementation behaves like latest result. Learner history and trend are unavailable. |
| P2 | A task component is mounted while its step is hidden. | `CardScreen` renders the hidden TaskTest section from the start. TaskTest tracks `task_started` on mount regardless of `isActive`; analytics can therefore record a task start before the learner enters Step 5. |

## Incomplete

- There is no explicit first-visit onboarding, placement check, or explanation of how to use the app. Path copy communicates the purpose but not the learning method, audio limitations, or draft status beyond each lesson banner.
- The app has a single starter chapter of three scenarios. Future chapter names are previews only; there is no playable chapter challenge, unlock flow, test-out, or mastery criterion.
- There is no phrasebook, retrieval review, due-item scheduling, learning history, or meaningful skill dashboard.
- The six steps cover a scene, dialogue, register comparisons, phrase list, scripted task, and result. Comprehension is not independently checked; listening and speaking do not yet have authentic audio or validated speech assessment.
- The lesson accepts typing or selectable phrase tiles. There is no pronunciation score, speech recognition, or evidence that a free-form answer is intelligible to a listener.
- The PWA precache patterns include JS/CSS/HTML/PNG/SVG/JSON but not MP4. Offline video playback is therefore not guaranteed; the static artwork fallback is the intended graceful result if video cannot play.
- `referencePhrases` is intentionally not rendered in the current lesson UI, so auxiliary Grab items are not learner-facing.

## Broken or concretely defective

1. **Unfinished Task Test cannot be resumed at its saved turn.** Reproduced as described above. This is the first implementation fix.
2. **Audio remains unavailable in the tested browser.** The missing capability is now explained to the learner. Authentic audio still requires licensed, quality-controlled recordings; real speaker output remains unverified.

## Missing for public release

- Native-speaker approval recorded per scenario, line, task, accepted alternative, and relevant translation. The three scenario `review.status` values are still `draft`.
- A minimum accessible listening experience and a fallback statement that is accurate on browsers without a Malay voice.
- A first-session introduction to what is taught, what a learner should do in each step, and what the completion score means.
- A content-backed beginner sequence with enough lessons to support a progression claim. The current Path chapter is a useful pilot grouping, not a full beginner curriculum.
- Accessibility pass with keyboard-only use, screen-reader review, contrast verification, system text scaling, and real mobile browser testing. Automated tests do not establish these.
- A real microphone/MediaRecorder compatibility test matrix, user-visible permission errors, and object URL/recording cleanup.
- Offline/PWA verification on installed browsers and production hosting; no offline behavior is claimed from this dev-server audit.
- Privacy review of failed-answer export and progress sharing copy, as these features copy locally stored learner input to the clipboard when the learner activates them.
- Release checks for mobile Safari/Chrome and desktop browsers, plus a decision about whether draft content should remain accessible to public testers.

## QA evidence (2026-11-07)

- Final Vitest after this implementation: **61 tests passed across 10 files** (single worker).
- Production build and content validation passed; the three scenario records remain `draft`.
- Baseline `npm run build`: **passed**, including TypeScript and Vite/PWA output.
- Baseline `npm run validate`: **passed** for all three scenario JSON files; all reported `draft`.
- Browser walkthrough: isolated QA origin on port 5174, fresh app storage by origin, not the GitHub Pages origin. Shop → Mamak → Grab completed. Path showed 3/3 after reload; results showed 30 total XP. A return to Path reflected completed states.
- Correct and incorrect typed answers, hints, assisted answer, word-bank composition, and representative accepted variants were exercised. `depan` failed the Grab get-off-here task; `Turun sini` passed. An unrelated route response failed; `Ikut GPS je.` passed.
- Step 1 media was observed on Shop, Mamak, and Grab; all were playing, muted, looping, `readyState=4`, with source and panel ratios 16:9. On Step 2, the hidden Step 1 DOM still contains the video element but it is paused and visually hidden.
- Path, Step 1, and Task Test were measured at 320, 360, 390, and 430 viewport widths. Document/body content widths did not exceed the available CSS viewport; card/media/footer bounds remained inside the viewport. This was not a native-device test.
- Reduced-motion and media-error fallback have automated component test coverage from the existing suite but were not visually re-tested in this browser pass.
- Microphone permission/recording, real screen-reader behaviour, browser history Back/Forward, installed PWA offline mode, and device-specific Safari playback were not tested.

## Prioritized next work

1. Add and test a safe migration/validation policy for malformed or future task-draft values if the schema evolves; current optional task drafts are backward-compatible and malformed turn indexes fall back to a fresh task.
2. Prepare a small native-speaker recording set only after script and usage rights are agreed; the current unsupported-browser state is now visible.
3. Add an onboarding/first-session explanation and one real comprehension activity to a reviewed scenario.
4. Define a chapter curriculum in documentation first; add playable chapters only as reviewed scenario content becomes available.
5. Add review scheduling only after the item model, objective evidence, and local-data migration behavior are specified.

See [`learner-walkthrough.md`](learner-walkthrough.md), [`learning-research.md`](learning-research.md), [`curriculum-map.md`](curriculum-map.md), and [`release-readiness.md`](release-readiness.md).
