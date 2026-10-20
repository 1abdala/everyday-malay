# Everyday Malay (PWA)

A mobile-first, installable Progressive Web App (PWA) teaching **colloquial Malaysian Malay** (*bahasa pasar*) through swipeable scenario cards, native dialogue recordings, and scripted role-play task tests.

Built with **Vite + React + TypeScript**, `vite-plugin-pwa`, plain CSS (CSS variables, dark mode, reduced motion), and `Vitest`. 100% static front-end; no backend or third-party trackers.

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Start the local dev server
```bash
npm run dev
```
Open `http://localhost:5173` on your browser or mobile device on the same local network.

### 3. Run unit tests
```bash
npm test
```
Executes the Vitest suite covering normalizers, digit mapping, address-term stripping, edit-distance fuzziness, and role-play turn matching.

### 4. Validate content JSON
```bash
npm run validate
```
Validates all cards in `/content/cards/*.json` for required schema fields, unique IDs, model answers, and audio completeness.

### 5. Production build
```bash
npm run build
```
Typechecks with `tsc` and generates the static production bundle in `dist/`, including service worker (`sw.js`) and web app manifest (`manifest.webmanifest`).

---

## Static Deployment

The project has zero server dependencies and requires no environment variables.

### Deploying to Netlify
1. Connect your GitHub repository to [Netlify](https://www.netlify.com).
2. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
3. Click **Deploy site**.

Or via Netlify CLI:
```bash
npx netlify-cli deploy --prod --dir=dist
```

### Deploying to Vercel
1. Import repository in [Vercel](https://vercel.com).
2. Framework Preset: **Vite**
3. Build command: `npm run build`
4. Output directory: `dist`
5. Click **Deploy**.

---

## Key Features & Architecture

### 1. Scenario Flow
Each scenario card is structured as a 6-step horizontal swipe flow (CSS scroll-snap + keyboard arrows + navigation buttons + progress dots):
- **Scene:** One-line scene setting and icon.
- **Listen:** Line-by-line dialogue chat bubbles (NPC on left, learner on right) with Normal and Slow audio playback and an English toggle.
- **Say it like locals:** Side-by-side comparison chips highlighting spoken vs. textbook formal forms.
- **Key phrases:** 5 essential phrases with audio, plus an in-browser voice recorder (`MediaRecorder`) for self-practice.
- **Task test:** Scored role-play where the user acts as the customer/passenger against NPC prompts. Supports both keyboard typing and word-bank tile mode.
- **Result:** Performance breakdown (first-try passes, hint-assisted, turns assisted), phrases to revisit, and quick actions to retry or move to the next card.

### 2. Offline PWA & Voice Fallback
- **Service Worker:** Powered by `vite-plugin-pwa` with Workbox runtime caching for `/audio/*` (status 200).
- **Synthetic Speech Fallback:** When actual audio files are not yet recorded (or in offline draft testing), speech smoothly falls back to the Web Speech API (`SpeechSynthesisUtterance` with `lang = "ms-MY"`) accompanied by a clear `🤖 device voice` badge.

### 3. Matcher & Data Integrity
- Pure algorithmic matcher in `src/lib/matcher.ts`:
  - Unicode NFKC normalization, punctuation stripping, digit conversion (`1` -> `satu`, `2` -> `dua`, etc.).
  - Contextual address-term stripping (`bang`, `kak`, `boss`, `abang`).
  - Levenshtein distance $\le 1$ allowed on tokens of length $\ge 5$ (e.g. `canay` matches `canai`).
  - Strict exact matching for short words.
  - Near-miss detection for targeted guidance.
- Failed attempts are logged locally to `em.failed.v1` (capped at 500 entries) and can be exported as JSON in Settings for native speakers to review and add missing acceptable variants.
- User progress stored in `localStorage` under `em.progress.v1`.
- Settings includes **Copy my progress** for single-tap copying of summary stats to paste in WhatsApp.

---

## Content Authoring
- Card JSON files live in [`content/cards/`](file:///content/cards/).
- See [`content/README.md`](file:///content/README.md) for data schemas.
- Flagged questions for native Malaysian speakers are tracked in [`CONTENT_TODO.md`](file:///CONTENT_TODO.md).
