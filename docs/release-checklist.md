# Everyday Malay v1 beta release checklist

This checklist is a release gate, not evidence that an item has passed. Record the date, device/browser, tester, and evidence for every checked item.

## Product and content

- [ ] The product promise is limited to short practical practice for shopping, ordering food, and taking a ride.
- [ ] `shop-01`, `mamak-01`, and `grab-01` remain `draft` until their review records document native-speaker approval.
- [ ] Native-speaker review is complete at dialogue-line, phrase, task-alternative, question, and feedback level.
- [ ] Word glosses are reviewed or explicitly omitted; no guessed glosses are shown.
- [ ] Regional, register, politeness, and situational notes are reviewed.
- [ ] Listening-comprehension questions and answer explanations are reviewed.
- [ ] Task alternatives and close-answer feedback are reviewed individually.
- [ ] Feedback copy has been reviewed for clarity and non-shaming language.
- [ ] Survival Malay phrases and exercises are complete, reviewed, and accurately labelled before release.

## Audio and recording

- [ ] Native audio is recorded, licensed for intended use, reviewed, and attributed in `content/audio/manifest.json`, or interim device speech is clearly labelled.
- [ ] Normal and slow variants are checked for intelligibility and natural rhythm.
- [ ] Unavailable and failed audio states are understandable and do not block lessons.
- [ ] Audio is cached after first playback; large videos are not precached by default.
- [ ] Microphone permission is requested only after an explicit tap.
- [ ] Microphone permission denial, unsupported format, recording failure, and playback failure are tested.
- [ ] Recording is not uploaded or retained after the lesson view closes.
- [ ] Microphone feature remains labelled experimental until physical-device QA passes.

## Privacy and data

- [ ] Privacy notice accurately describes local storage and origin/device limitations.
- [ ] JSON export includes progress, XP, failed answers, unfinished role-play drafts, preferences, onboarding, and saved phrases.
- [ ] Export is tested without exposing another learner's browser profile.
- [ ] Delete-all flow requires explicit confirmation and removes all documented local categories.
- [ ] Migration from `em.progress.v1` to `em.progress.v2` preserves old records and leaves the source intact until deletion.
- [ ] Storage-disabled/full behavior degrades safely and does not claim persistence when unavailable.

## Accessibility and devices

- [ ] Keyboard-only flow works for onboarding, Path/Explore, all lesson steps, task word blocks, Settings, export, and delete confirmation.
- [ ] Screen-reader landmarks, headings, labels, progress, task feedback, audio state, and completion are understandable.
- [ ] VoiceOver tested on physical iOS Safari.
- [ ] TalkBack tested on physical Android Chrome.
- [ ] Text scaling at 200% does not hide controls or content.
- [ ] WCAG 2.2 contrast, focus visibility, and target-size checks are complete.
- [ ] Reduced-motion and video/audio failure behavior are checked on device.
- [ ] iOS Safari and Android Chrome tested at narrow and large phone widths.
- [ ] Safe areas, keyboard visibility, clipping, horizontal overflow, and fixed-footer overlap are checked.
- [ ] Offline launch and a lesson with cached/uncached media are checked.
- [ ] Browser Back/Forward and refresh/resume are checked.

## Release engineering

- [ ] Content validation passes.
- [ ] Full automated test suite passes.
- [ ] Production build passes.
- [ ] PWA install, manifest, service-worker update, and cache versioning are checked.
- [ ] Production deployment is verified at its actual URL and subpath.
- [ ] No scenario is promoted automatically by validation or migration.
- [ ] Known limitations are visible in the app and release notes.
