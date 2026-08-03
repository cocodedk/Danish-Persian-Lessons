# Plan 001 — Scaffold the React App

Executor: Opus or Sonnet. Scope: exactly this file. Invoke `karpathy-guidelines` before coding.

## Questions
(none yet — add here and stop if blocked)

## Goal

A running Vite + React + TypeScript app deployed at
https://cocodedk.github.io/Danish-Persian-Lessons/app/ showing the split-screen shell with one
hardcoded demo pair (آب / vand) and the first-run name capture, with storage, tests, lint, and the
upgraded CI/deploy/hook gates all green. No lesson content yet — that's plans 003/004.

## Steps

1. **Scaffold at repo root** (do not disturb `website/` or `docs/`): `package.json`, `index.html`,
   `vite.config.ts`, `tsconfig.json`, `src/`, `public/`. React 18+, Vite 5+, TypeScript strict.
   - `vite.config.ts`: `base: '/Danish-Persian-Lessons/app/'`, `build.outDir: 'dist'`.
   - Routing: `HashRouter` (react-router-dom). Routes: `#/` (home) and `#/lesson/:id` (placeholder).
2. **Fonts, self-hosted** in `public/fonts/` as woff2 with an `OFL.txt`: Vazirmatn 400/700,
   Noto Naskh Arabic 700, Andika 400/700 (all SIL OFL). `@font-face` in `src/styles/fonts.css`
   with `font-display: swap`. No runtime Google Fonts in the app.
3. **Tokens**: `src/styles/tokens.css` — transcribe the palette/type/spacing rules from
   `docs/design/ART-DIRECTION.md` as CSS custom properties, light + dark (`prefers-color-scheme`).
4. **SplitCard shell**: `src/components/SplitCard.tsx` — Persian pane top (~55%, `lang="fa" dir="rtl"`,
   Noto Naskh display), notebook rule divider, Danish pane below (`lang="da"`, Andika). Red margin
   line per ART-DIRECTION. Demo pair آب / vand on `#/`, with the pronunciation line under the
   Persian word: `åb · [ɒːb]` (dansk lydskrift + IPA, per ART-DIRECTION).
5. **Storage**: `src/progress/storage.ts` — get/set over `localStorage`, keys `dpl.v1.<lessonId>`,
   JSON-safe, wrapped in try/catch (private-mode denial ⇒ in-memory fallback), schema version field.
   Plus `src/progress/profile.ts` — `{ name?: string, faSpelling?: string }` under `dpl.v1.profile`,
   same safety guarantees.
6. **First-run name capture** (the 001 slice of `006-your-name.md`): a skippable, warm
   "Hvad hedder du? / اسمت چیست؟" screen on first launch. Skipping is permanent-quiet — the app
   never asks again. When a name exists, home greets with «سلام، {name}!» over "Hej {name}!" in the
   SplitCard; otherwise «سلام!» / "Hej!". Name is editable and deletable from a small settings corner.
   (Persian-script spelling and all transliteration logic wait for plan 006.)
7. **Lesson types**: `src/lessons/types.ts` — `Letter` (glyph, name fa/da, four positional forms,
   `joinsLeft: boolean`, `sound: { anchorDa, ipa }`), `VowelMark`,
   `WordCard { fa, faMarked?, da, pron: { da: string, ipa: string } }`,
   `Lesson { id, kind: 'alphabet' | 'vocab', items }`. No data files yet.
8. **Tests** (Vitest + @testing-library/react):
   - storage + profile round-trip, corrupt-JSON recovery, denied-storage fallback;
   - name capture: skip path leaves app fully usable and quiet; greeting renders with and without name;
   - **Persian text-rule guard**: helper that rejects Arabic ك (U+0643), ي (U+064A) and ASCII digits
     inside `fa` strings — applied to all current and future lesson data via a single test that walks
     every exported lesson object.
9. **Lint**: ESLint flat config + typescript-eslint. Scripts: `dev`, `build`, `preview`, `lint`,
   `test`, and `verify` = `lint && test -- --run && build && bash scripts/verify.sh`.
10. **Upgrade the gates** (edit in place, keep existing behavior for the site):
    - `.githooks/pre-commit` → `npm run lint && npx tsc --noEmit`;
    - `.githooks/pre-push` part 3 → `npm run verify`;
    - `.github/workflows/ci.yml` job `verify` → setup-node (cache npm) + `npm ci` + `npm run verify`;
    - `.github/workflows/deploy-pages.yml` → add build: `npm ci && npm run build`, then compose
      `_site/` = `website/*` + `dist/` → `_site/app/` + root `llms.txt`; upload `_site`. Add
      `src/**`, `public/**`, `package*.json`, `vite.config.ts`, `index.html` to the paths filter.
11. **Landing CTA**: flip the three landing pages' primary CTA to the live app URL
    (`…/Danish-Persian-Lessons/app/`), keeping the GitHub link as secondary. Switch the landing
    pages to the same self-hosted fonts (drop the Google Fonts requests), then strengthen the
    privacy line to "nothing is fetched from outside servers" — it becomes true at that moment.

## Acceptance

- [ ] `npm run verify` green locally; CI `verify` job green on the PR
- [ ] App loads at `/app/` on Pages after merge; demo pair renders with its pronunciation line
      (`åb · [ɒːb]`); dark mode + reduced-motion respected
- [ ] Greeting rule for 001: the Danish pane greets "Hej {name}!" as soon as a name exists; the
      Persian pane greets «سلام!» alone until `profile.faSpelling` arrives with plan 006 — Latin
      text never renders inside the Persian pane.
- [ ] Skip path: no name → nothing nags, ever; profile survives reload; delete works
- [ ] Lighthouse mobile on `/app/`: no horizontal scroll at 360px; tap targets ≥ 44px
- [ ] Persian text-rule guard test exists and fails on a deliberately bad fixture (prove it once, then fix the fixture)
- [ ] No dependency beyond: react, react-dom, react-router-dom, vite, typescript, vitest,
      @testing-library/react, eslint + plugins. Anything else ⇒ question at top of this file first.
