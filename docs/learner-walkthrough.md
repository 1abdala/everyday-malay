# Learner workflow walkthrough

**Date:** 2026-11-07
**Environment:** isolated local Vite origin `http://127.0.0.1:5174/everyday-malay/` in a new in-app browser tab. This origin has its own localStorage namespace, separate from `https://1abdala.github.io/everyday-malay/` and `localhost:5173`.

This was an observed browser walkthrough, not a claim about every browser or device.

## First visit and Path

1. Opened the app at `#path` with an empty QA origin. The Path showed “Start with real life,” Starter Chapter “First Conversations,” an objective, 0/3 progress, and Shop 01 as the next conversation.
2. The screen did not present a separate onboarding flow, proficiency placement, or explanation of the six lesson steps. The Path headline and objective were the only first-visit orientation.
3. Path cards showed the same canonical order and numbering as the scenario data: Shop 01, Mamak 02, Grab 03. Explore listed the same three scenarios and stated they remain open for independent practice.

## Shop 01 — At the shop counter

- Step 1 showed the draft banner, bottled-water purchase setting, and Shop video. Observed source was `storecheckput.mp4`; it was muted, playing, looping, and 16:9.
- Step 2 displayed 10 dialogue lines with English visible and Normal/Slow controls. Clicking a dialogue control did not produce audible playback in this browser. The browser reported no `speechSynthesis` or `SpeechSynthesisUtterance`; the lesson exposed no unavailable message at baseline.
- Step 3 showed 4 spoken/formal comparison items.
- Step 4 showed 7 phrase cards with Normal/Slow and Record Practice controls.
- Step 5 used four turns. An unrelated English answer (“hello”) was rejected and showed “Try again” plus a hint. “Maaf, ada air mineral tak?” passed. “takpe” passed as a decline. “Boleh bayar pakai kad?” passed. On the receipt turn, two incorrect inputs led to a suggested response and still allowed task completion.
- Step 6 showed 2/4 first try, 1 with hint, 1 assisted, +10 XP, total 10 XP, and two phrases to revisit. No claim of mastery was made.
- Returning to Path showed 1/3 completed and Mamak as the recommendation.

## Mamak 02 — Ordering at a mamak stall

- Step 1 showed the draft banner, Mamak waiter artwork/video, and Klang Valley / West Coast spoken-variety label. `tehtarekorder.mp4` was muted, playing, looping, and 16:9.
- Step 2 displayed 10 lines including dine-in/takeaway, full “Itu saja,” and contextual “Bang, kira.”
- Step 3 presented `Itu saja`/`Tu je` order and contextual note for `kira` versus `minta bil`.
- Step 4 contained 8 phrases, including quantity patterns, dhal alternatives, and the bill-request phrase.
- Step 5 used five turns. “teh” was rejected with a hint; “teh tarik satu kurang manis” passed. Word Bank composed and accepted “Makan sini” and “Roti canai dua.” “tu je” and “Bang, tolong kira” passed. The final total (“Semua tujuh ringgit”) was displayed before completion.
- Step 6 showed 4/5 first try, 1 with hint, 0 assisted, +10 XP, total 20 XP. Returning to Path showed 2/3 completed.

## Grab 03 — Taking a Grab

- Step 1 showed the draft banner, ride setting, and Grab illustration/video. `graborder.mp4` was muted, playing, looping, and 16:9.
- Step 2 displayed 9 lines, including “Ikut jalan mana ya?” / “Ikut GPS je.” and the separate landmark stop dialogue.
- Step 3 distinguishes `depan sikit` (a little farther ahead by a landmark) from `Turun sini` (get off here).
- Step 4 displayed five core phrases. Auxiliary `referencePhrases` were not displayed, as documented in the schema.
- Step 5 accepted “ya betul” and “Boleh pasang aircond?”. The unrelated route answer “nak makan apa” was rejected; “Ikut GPS je.” passed. “depan” alone was rejected for the get-off-here turn; “Turun sini” passed.
- Step 6 showed 2/4 first try, 2 with hint, 0 assisted, +10 XP, total 30 XP.
- Returning to Path showed 3/3 completed and 100% chapter scenario progress.

## Revisit, refresh, and interruption

- Reopening completed Mamak returned to its Results screen with the existing 30 XP total and no fresh +10 reward.
- Retrying a completed Mamak opened the Task Test from turn 1. After passing turn 1 and advancing to turn 2, a page refresh kept the app on Step 5 but returned the task to turn 1 with an empty response. **This is a reproduced defect:** task state and counters are not persisted.
- Refreshing the Path after completion kept 3/3 completed and all statuses.

## Responsive checks

Measured browser viewport widths: 320, 360, 390, and 430 CSS px; height 844 px. Tested Path, Step 1, and Task Test. The document/body content widths did not exceed the effective CSS viewport. The Step 1 media box retained 16:9 dimensions and card, task input, and footer bounds stayed within the viewport. Long Path content remains vertically scrollable. These were browser viewport overrides, not tests on physical phones.

## Not tested in this pass

- Real device audio output, native Malay voice quality, microphone permissions, MediaRecorder MIME support or saved recording playback.
- Real-browser reduced-motion video fallback or a real media request failure; the existing component tests cover these branches.
- Physical iOS Safari, Android Chrome, PWA installation/offline behavior, screen reader, keyboard-only navigation, browser history Back/Forward, and OS-level safe-area behaviour.

The QA instance was intentionally separate from the GitHub Pages origin. Its local test progress was not written to the learner’s production origin.

## Follow-up fixes verified after the walkthrough

- Added optional `taskDraft` data inside the existing `em.progress.v1` scenario record. In the same isolated QA origin, Mamak was advanced to turn 2, the partial input `makan` was entered, and the page was refreshed. The lesson returned to turn 2 with `makan` restored. A component test also verifies turn/counter/input restoration after remount.
- When neither an audio file nor Web Speech API is available, the audio controls and NPC prompt now show “Audio unavailable on this device.” This was observed on the QA browser. It is an error explanation, not a successful audio playback test.
- No scenario JSON, matcher, XP rule, scenario ID, or draft status was changed by these fixes.
