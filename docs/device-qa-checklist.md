# Everyday Malay — Real-device beta QA checklist

Use a clean, isolated test origin/profile. Do not clear a learner's real progress. Record actual device/browser details in [qa-findings-template.md](qa-findings-template.md). Scenarios are draft content; QA does not approve them.

## Device and browser matrix

Record at least one physical iPhone with current iOS Safari and one physical Android phone with current Chrome. Also test a desktop Chromium browser and a desktop keyboard-only run. Add older supported OS/browser versions where available.

| Device | OS version | Browser/version | Width / text scale | Accessibility tool | Network | Tester/date | Result |
|---|---|---|---|---|---|---|---|
| iPhone (physical) | | Safari | | VoiceOver | Online / offline | | |
| Android phone (physical) | | Chrome | | TalkBack | Online / offline | | |
| Desktop | | Chrome/Edge/Firefox | | Keyboard / screen reader | Online / offline | | |

## iOS Safari and Android Chrome

- [ ] Open the deployed test build in a fresh isolated profile; verify orientation can be completed or skipped and reopened from Settings.
- [ ] Complete Survival Malay, open Phrasebook, save/remove a phrase, and return to Path.
- [ ] Complete Shop → Mamak → Grab; verify Listen, Understand, Key Phrases, Task Test, Results and resume state.
- [ ] Try correct, incorrect, close, hinted, assisted, and reconstructed responses; verify feedback explains the state without claiming mastery.
- [ ] Verify native-audio status is honest. Until approved recordings exist, device-generated speech must be labeled as such and never described as native audio.
- [ ] Check bottom controls, safe areas, keyboard, scrolling, dialogue translations, and no horizontal overflow at 320, 360, 390, and 430 CSS px where emulation is available.
- [ ] Refresh and return to the app; progress, draft role-play state, saved phrases, and XP remain consistent.

## VoiceOver (iOS) and TalkBack (Android)

- [ ] Navigate from orientation through Path and a complete lesson using swipe navigation only.
- [ ] Confirm headings and landmarks expose a useful hierarchy; focus order follows visible order.
- [ ] Check names/states for audio speed controls, reveal-English, save phrase, word tiles, answer input, hints, result actions, export and delete.
- [ ] Confirm answer correctness, audio loading/unavailability, completion, and delete confirmation are announced without requiring color perception.
- [ ] Ensure focus does not disappear behind the fixed footer, modal, or virtual keyboard.

## Keyboard-only desktop

- [ ] Use Tab / Shift+Tab / Enter / Space through onboarding, Path, every lesson step, phrase saving, word blocks, typing mode, results, Settings, export and delete dialog.
- [ ] Verify visible focus, logical order, no keyboard trap, and Escape closes dismissible dialogs where supported.
- [ ] Confirm word blocks and task controls can be operated without pointer input and status changes are announced.
- [ ] Test browser Back/Forward from Path → lesson → Results; verify predictable destination and no duplicated completion/reward.

## Microphone permission (experimental)

- [ ] Confirm explanatory copy appears before permission is requested and permission is requested only after Record is tapped.
- [ ] Test allow, deny, unavailable device, unsupported recording MIME, interrupted recording, and playback failure.
- [ ] Confirm errors are human-readable; recordings are only playable in the current browser session, not uploaded or persisted.
- [ ] Stop/unmount the recorder and verify microphone indicator turns off and object URLs/tracks are released.
- [ ] Keep this feature labeled experimental until these cases pass on both mobile platforms.

## Offline behavior

- [ ] Load the app and current lesson online, then enable airplane mode and reload.
- [ ] Confirm app shell and already cached lesson content remain usable.
- [ ] Play previously fetched audio offline; uncached audio gives clear unavailable/device-speech fallback messaging.
- [ ] Confirm large videos are not precached by default and cache/storage failures do not crash lessons.
- [ ] Restore network and verify online playback recovers without clearing progress.

## Large text (200%)

- [ ] Set OS/browser text scaling to 200% (or equivalent zoom).
- [ ] Check headings, dialogue translations, question choices, role-play prompt/input, feedback, results, Settings and dialogs.
- [ ] Confirm no text clipping, overlap, hidden buttons, or loss of function; content scrolls instead of being cut off.

## Reduced motion

- [ ] Enable OS/browser `prefers-reduced-motion: reduce` before opening the app.
- [ ] Confirm scenario video is replaced by static artwork and no video playback starts.
- [ ] Confirm transitions and decorative motion are absent or reduced; controls remain usable.
- [ ] Restore the original setting after test.

## Video and audio failure states

- [ ] In a test build/profile, block or fail a scenario MP4 request without altering source assets; confirm static fallback and intact layout.
- [ ] Block or fail a native audio request; confirm loading ends, fallback is labeled device-generated if used, otherwise “Audio unavailable” is announced.
- [ ] Confirm native audio controls show loading while data is pending, and normal/slow selections resolve to the manifest's respective files.
- [ ] Confirm audio is cached only after playback request; simulate full/unavailable storage if the device permits and verify playback still degrades safely.

## Navigation, data export, and deletion

- [ ] Use browser Back and Forward from lesson steps, Path/Explore and Results; progress and originating destination remain coherent.
- [ ] Export progress; inspect the downloaded JSON for progress, failed-answer logs, role-play drafts, onboarding, XP and saved phrases without unexpected secrets.
- [ ] Trigger delete progress; cancel and confirm data stays; repeat and explicitly confirm; verify the app restarts cleanly with empty learner data.
- [ ] Never test deletion against a real learner profile.

## Severity scale

- **Blocker:** prevents core learning or causes data loss.
- **Major:** significantly impairs usability or accessibility.
- **Minor:** cosmetic or non-core inconvenience.
- **Observation:** potential improvement.

## Exit criteria

Log every failure with the bug-report template. Beta should remain limited until all Blockers and Majors are fixed or explicitly accepted, the three draft scenarios have item-level native-speaker approval, and native audio rights and quality review are documented. A code/test pass is not physical-device sign-off.
