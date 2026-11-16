# Release readiness status

> This is the current implementation snapshot. The actionable release gate is [`release-checklist.md`](release-checklist.md); checked boxes below refer to prior isolated QA runs, not this implementation turn.

## Current status

**Product stage:** prototype / pre-release review. Three playable draft scenarios are present. Orientation, a limited Survival Malay starter, an Understand step, local phrase saving, data export/delete, and per-item review records are now implemented. The starter is incomplete where reviewed phrases are unavailable; current question content and scenarios remain draft. This app is not a complete beginner course and is not ready to claim broad conversational proficiency.

## Release blockers

- [x] Resume in-progress role-play at the saved turn and preserve entered response/counters after refresh; verified on the isolated QA origin.
- [ ] Add real, licensed, native-speaker Malay recordings. The manifest currently lists 49 planned dialogue/phrase recordings with no assets marked available. Unsupported browsers or browsers without a Malay speech voice receive clear audio-unavailable messaging; do not treat browser speech synthesis as authentic local speech.
- [ ] Send the generated Shop, Mamak and Grab packs to a proficient reviewer; all 187 content rows plus 49 audio records remain pending, and no word glosses are proposed. Merge reviewed responses into source review records and deliberately apply any approved edits.
- [ ] Complete native-speaker review of each line/task/translation/accepted alternative and document approval. Keep statuses `draft` until that process is complete.
- [ ] Record the 12-phrase + 29-dialogue pilot only after wording review and a completed speaker release/rights record; the 53 audio files do not yet exist.
- [x] Add concise first-session orientation and explain local storage and hint/assisted practice.
- [ ] Complete and review missing Survival Malay price and repetition/slower-speech phrases; do not invent or teach unreviewed candidates as approved.
- [ ] Test microphone/recorded playback across supported mobile browsers; it is labelled experimental and unavailable with an explanation where unsupported.
- [ ] Decide if public testers should see draft banners/content and what “draft” means to them.
- [ ] Test PWA install/update/offline on supported browsers, including on-demand audio caching and media fallback. Native audio assets are absent; manifest entries are planned only.
- [ ] Complete keyboard, screen-reader, contrast, zoom/text-scale, and real-device safe-area checks.
- [x] Explain local storage limits and add a JSON export and explicit delete-all confirmation.

## Automated checks from this implementation

See final task report for the latest Vitest, content validation, and build results. This implementation was not browser-walked in the shared learner browser or on physical devices.

## Previously verified in isolated local QA pass

- [x] Earlier QA run: 61 passed across 10 files; see the previous task report for its exact scope.
- [x] Earlier production build and content validation passed; latest results are reported separately.
- [x] Shop → Mamak → Grab completed in isolated QA origin; Path reflected 3/3 and 30 XP.
- [x] Incorrect and accepted answers; hints, assisted response, word bank, result actions, and completion persistence.
- [x] Mobile viewport checks at 320/360/390/430 CSS px for Path, Step 1, and Task Test; no horizontal document overflow observed.
- [x] Step 1 media source mapping, muted/loop playback, and 16:9 panel for all three cards.
- [x] Refresh preserves completion/XP. The reproduced Mamak turn-loss defect is fixed; isolated browser refresh restored turn 2 and a partial typed answer.
- [x] All scenarios still `draft`.

## Not yet verified

- [ ] Browser history Back/Forward policy.
- [ ] Physical Android Chrome and iOS Safari.
- [ ] Real Malay audio quality or offline playback; current browser lacked packaged recordings and speech synthesis, though playback failure is now visible.
- [ ] Microphone permission, MIME support, recording, and playback.
- [ ] Real browser reduced-motion and video-error visuals (component tests exist).
- [ ] Installed PWA and offline navigation.
- [ ] Screen-reader semantics and keyboard-only completion.
- [ ] Learning outcomes from a beginner pilot.
- [ ] Physical-device completion of the new device QA checklist, including VoiceOver, TalkBack, microphone, 200% scaling, audio cache/storage failure, export/delete, and offline cases.

## Known limitations

- Text matching measures overlap with accepted strings/keywords, not intelligibility or language proficiency.
- Current feedback is a hint or suggested response, not a detailed diagnostic explanation.
- Results store one task summary rather than attempt history; the field name `bestTask` is not currently guaranteed to be best-performing.
- Only three scenarios exist; future chapter labels are planned previews.
- Reference phrases are stored in JSON but not displayed in the learner UI.
- MP4 assets are not part of the PWA precache set; offline Step 1 uses static artwork if playback fails.
- Native-speaker review status remains draft; prior feedback does not itself imply formal approval of every current string.

## Deployment and local setup

The project is Vite + React + TypeScript with localStorage persistence and GitHub Pages deployment under `/everyday-malay/`. See [`README.md`](../README.md). Do not treat `localhost` as a public test URL; share the deployed site URL only after a verified deployment. Do not publish or promote scenario statuses as part of QA.
