# Plan 013 — Real lesson images

Status: ready for implementation. Depends on [Plan 012](012-aaa-learner-experience.md).
Normative requirements: [AAA lesson image specification](../specs/AAA-LESSON-IMAGE-SPEC.md).

## Outcome

Use a small set of clear, real photographs to help a Danish beginner connect concrete Persian words
to their meanings. Images support the lesson; they never replace Persian text, sound, or retrieval.
Every image is downloaded and served by the app so the learner makes no request to its source.

## Fixed decisions

1. Use still photographs. Do not use emoji, Unicode picture symbols, clip art, cartoons, animated
   GIFs, or AI-made or AI-extended images.
2. Find images only while authoring. Download the approved file, record its source and rights, remove
   hidden metadata, make small responsive versions, and commit them to the repository. Never hotlink
   or make a runtime image API, CDN, tracking, or source-site request.
3. Use a photo only when one image can show one clear concrete meaning. Keep letters, pronouns,
   grammar, and abstract ideas text-led.
4. Show the photo while first teaching the word and after a learner answers. Hide any photo that
   would reveal the answer during a true Persian reading or meaning check. Image-supported work does
   not count as retained reading.
5. Keep the teaching order Persian, pronunciation, image, then simple Danish. Do not place Persian
   text over a photo or use a photo as a page background.
6. GitHub Actions and other CI checks are not release gates for this plan. The owner records local
   checks and named human reviews.

## First pilot

Start with these eight low-risk, concrete items. Add no other image until the pilot is reviewed.

| Persian | Danish | Photo brief |
|---|---|---|
| آب | vand | Plain water in a clear glass; no brand or writing |
| نان | brød | Iranian flatbread; native cultural review required |
| مِداد | blyant | One ordinary pencil |
| کِتاب | bog | One closed book; no readable title or logo |
| میز | bord | One ordinary table |
| دَر | dør | One clear door |
| خانه | hus | An ordinary home exterior; no address or people |
| گُل | blomst | One clear flower |

Good later candidates are `باران`, `آسمان`, `ماه`, `شب`, and `دست`. Words about people, such as
`بابا`, `مادر`, and `دوست`, and private places such as `مدرسه`, wait for a recorded release review.

## Work

### Milestone 0 — Inventory and baseline

- List every lesson state where an image could appear and whether it teaches, tests, or reveals.
- Record the current route sizes and network requests on a small phone and a desktop.
- Confirm that the eight catalog entries have stable IDs and approved Persian, sound, and Danish.

### Milestone 1 — Rights and source record

- Choose the source order from the image specification; prefer self-made or public-domain work.
- Save an author-time source record for every candidate before editing it.
- Reject uncertain licenses, unclear authors, visible brands, addresses, identifiable people, minors,
  private interiors, or culturally misleading scenes.
- Add a same-origin `Billedkilder` page. Show the creator, source, license, and changes when required.

### Milestone 2 — Private local assets

- Download the original once; save its SHA-256 hash in the source record.
- Remove EXIF, GPS, IPTC, XMP, comments, and embedded previews before the file enters the app.
- Crop without changing the meaning and make the sizes and formats defined by the specification.
- Add a local check for missing variants, over-budget files, hidden metadata, and remote image URLs.

### Milestone 3 — One shared lesson image

- Add a typed image catalog keyed to lesson entry IDs and one shared renderer.
- Give every photo a fixed width and height, responsive sources, simple Danish alternative text, a
  source-record ID, and a declared teaching purpose.
- Keep the route useful when an image is blocked, missing, slow, or unseen.

### Milestone 4 — Learning use

- Add each pilot photo to the first teaching view and the post-answer explanation.
- Hide answer-revealing photos during Persian-to-meaning and Persian-reading retrieval.
- If a task starts from a picture, label its result as guided practice, not successful retrieval or
  retained learning.
- Check that the text and photo always teach the same narrow meaning.

### Milestone 5 — Human review and release

- An Iranian Persian literacy reviewer checks meaning, culture, and the exact word-to-photo match.
- A Danish plain-language reviewer checks every label, alternative text, and credit.
- An accessibility reviewer checks keyboard, screen reader, zoom, contrast, reflow, and image-off use.
- At least five Danish-speaking beginners use the pilot; record confusion, guesses, and delayed recall.
- Fix every critical or high issue, rerun that task, and save the result with date, device, and commit.

## Acceptance

- [ ] Only the eight approved pilot words have photos.
- [ ] Every source record proves origin, rights, review, original hash, date, and edits.
- [ ] Every shipped photo and variant is local, within budget, and free of hidden metadata.
- [ ] A production network trace shows no image host, CDN, API, tracker, or remote font request.
- [ ] No emoji, picture symbol, clip art, cartoon, animation, AI image, text-in-image, or photo
      background is used as lesson art.
- [ ] The photo is absent whenever it would give away a retrieval answer.
- [ ] Image-supported tasks cannot raise successful-retrieval or retained-learning state.
- [ ] Every pilot photo has approved Danish alternative text and a matching Persian meaning.
- [ ] The app remains complete with images blocked and at 320 CSS px and 400% zoom.
- [ ] Owner-run `npm run verify`, asset checks, metadata checks, and production network checks pass
      locally and their results are recorded; CI is not required.
- [ ] Persian, Danish, accessibility, and five-beginner review records have no open critical/high issue.

## Out of scope

Video, learner uploads, camera access, face recognition, remote image search, runtime image generation,
AI artwork, galleries, decorative hero photos, and replacement of the SVG icon/stroke system.
