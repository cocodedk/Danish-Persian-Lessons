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
   "Hvad hedder du? / نام تو چیست؟" screen on first launch. Skipping is permanent-quiet — the app
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

## Critic round 1 (2026-08-03) — FAIL, fix list adjudicated by Fable

1. `SplitCard.tsx` pron line: add `lang="da" dir="ltr"` (it is Danish/IPA inside the fa pane).
2. Raise all six sub-16px texts (NameCapture hint; SettingsCorner toggle, label, Gem/Slet,
   privacy line) to ≥ 1rem.
3. fa landing: «الفبا چیزی است که بعد می‌سازیم.» → «بعد نوبت الفباست.»; de-duplicate the doubled
   «همین حالا». da landing: «Koden er offentlig undervejs.» → «Koden er åben fra dag ét.»
4. `types.ts`: `faMarked?: string` (the diacriticized variant string, not a boolean); SplitCard
   renders `faMarked ?? fa`; madde styling keys off the rendered text containing آ.
5. Capture prompt: «اسمت چیست؟» → «نام تو چیست؟» (planner's own string corrected — register clash).
6. deploy-pages.yml: remove `og-image.html` from the composed `_site` (it references Google Fonts
   and is a build source, not a page). README + llms.txt: the app is live at `/app/` after this
   merge — drop "once it opens" phrasing.
7. Text-rule guard: also walk exported Persian UI strings (capture prompt, placeholder) so a future
   ك edit fails CI.
   Dismissed: the dependency-allowlist expansion was planner-authored (not a builder violation);
   `jest-dom` stays. Notebook ruling = plan 002 scope, confirmed.

## Acceptance

- [x] `npm run verify` green locally; CI `verify` job green on the PR
- [ ] App loads at `/app/` on Pages after merge (pending-merge — Pages only publishes from `main`);
      demo pair renders with its pronunciation line (`åb · [ɒːb]`); dark mode + reduced-motion
      respected — verified locally via `vite preview` + headless screenshots in both color schemes
- [x] Greeting rule for 001: the Danish pane greets "Hej {name}!" as soon as a name exists; the
      Persian pane greets «سلام!» alone until `profile.faSpelling` arrives with plan 006 — Latin
      text never renders inside the Persian pane.
- [x] Skip path: no name → nothing nags, ever; profile survives reload; delete works
- [ ] Lighthouse mobile on `/app/` (pending-merge — needs the live Pages URL for a real Lighthouse
      run): no horizontal scroll at 360px; tap targets ≥ 44px — both verified ahead of time
      (360px headless screenshot shows no overflow; every interactive element is `min-height`/
      `min-width: var(--tap-min)` = 44px in CSS)
- [x] Persian text-rule guard test exists and fails on a deliberately bad fixture (prove it once, then fix the fixture)
- [x] No dependency beyond: react, react-dom, react-router-dom, vite, typescript, vitest,
      @testing-library/react, eslint + plugins — plus the dev tooling those require
      (@vitejs/plugin-react, jsdom, @testing-library/jest-dom, typescript-eslint). Anything else ⇒
      question at top of this file first.
      **Deviation (not a question — no ambiguity, just disclosing):** also added `@types/react` and
      `@types/react-dom` as devDependencies. Neither `react` nor `react-dom`'s npm packages ship
      their own TypeScript types, so `tsc --noEmit` under strict mode cannot typecheck a single JSX
      file without them — there is no alternative that keeps "TypeScript strict" (step 1) true
      without adding them. Both are type-only, erased at build, zero runtime/bundle impact.
