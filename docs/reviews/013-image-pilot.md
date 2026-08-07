# Plan 013 image pilot review

Status: implementation candidate. Human release checks are still open. Date: 2026-08-07.
Branch: `agent/real-lesson-images`. Base: `b6e2c23`.

## Learning-state map

| Surface | State | Photo rule |
|---|---|---|
| Word page | first model | Show after Persian and sound, before Danish |
| Vocabulary choice | before answer | Hide |
| Vocabulary choice | after any answer | Show in the full explanation |
| New review item | model | Show for a pilot word |
| Due review item | before answer | Hide |
| Due review item | after answer | Show in the full explanation |
| Connected reading | reading check | No pilot photo |
| Word list and home | browse | No photo |

No picture-first task was added. A photo therefore cannot raise successful retrieval or retained
learning. Existing word-page completion remains exposure; due review remains the retrieval record.

## Source choices

| Word | Source and creator | Rights | Screen result |
|---|---|---|---|
| آب · vand | [Glass of Water](https://commons.wikimedia.org/wiki/File:Glass_of_Water_(50838445027).jpg), Alabama Extension | CC0 | One clear glass |
| نان · brød | [Sangak bread](https://commons.wikimedia.org/wiki/File:Sangak_bread.jpg), Mehrraz | CC BY-SA 4.0 | Iranian flatbread; culture review open |
| مِداد · blyant | [No. 2 pencil](https://commons.wikimedia.org/wiki/File:No._2_pencil.jpg), Ziongarage | CC0 | One plain pencil |
| کِتاب · bog | [Hardcover book on a table](https://commons.wikimedia.org/wiki/File:Hardcover_book_on_a_table_(Unsplash).jpg), Beatriz Pérez Moya | CC0 | One closed book; text cropped out |
| میز · bord | [Aalto table](https://commons.wikimedia.org/wiki/File:Aalto_table.JPG), Ellywa | CC BY-SA 3.0 | One plain table |
| دَر · dør | [Wooden door in Iran](https://commons.wikimedia.org/wiki/File:Wooden_door_of_a_house_in_Iran_01.jpg), Harci | CC0 | One old outside door |
| خانه · hus | [Small house](https://commons.wikimedia.org/wiki/File:Small_house_on_an_autumn%27s_day_(Unsplash).jpg), Scott Webb | CC0 | Outside only; no person or address |
| گُل · blomst | [Single peony](https://commons.wikimedia.org/wiki/File:A_photo_of_a_beautiful_single_peony_flower.jpg), Retro Lenses | CC BY 4.0 | One flower |

Exact source fields, download dates, original SHA-256 values, edits, and review state live in
`src/images/lesson-images.json`. Source originals stayed in a temporary authoring folder outside the
repository.

Rejected during the screen: bakery photos with people, marks, or signs; tables with chairs, prices,
or QR codes; books with readable titles or unclear close crops; doors with house numbers, notices,
people, or a private inside view. AI images, drawings, symbols, and emoji were not considered.

## Local evidence

Baseline before work: main JavaScript 363,654 bytes; CSS 47,994 bytes; home photo bytes 0.

Candidate result:

- 8 catalog entries and 32 local files: JPEG and WebP at 480×360 and 960×720.
- Largest 480 file: 40,478 bytes. Largest 960 file: 136,642 bytes.
- All 32 files re-encoded. The local parser found no EXIF, ICC, XMP, IPTC, comments, animation data,
  or unexpected file.
- Chromium production trace at 390×844 requested `ab-480.webp` at 9,534 bytes on the word route.
  It made no external, fetch, or XHR request. WebKit also checked the JPEG fallback; the two files
  total 25,079 bytes. The home route requested no lesson photo.
- Candidate main JavaScript: 364,836 bytes. Main CSS: 48,411 bytes. Both remain inside the existing
  limits. The credits and image renderer are separate small chunks.
- DOM check passed: Persian → sound → photo → Danish. Quiz and due-review checks found no photo
  before an answer and one photo after an answer.
- Image-off, keyboard, dark mode, 320/390/768/1280/2560 widths, 200% text, and 400% text checks
  completed without lost lesson text or horizontal page scroll.
- Automated axe checks and Chromium, Firefox, and WebKit learning/privacy journeys passed locally.

Commands used: `npm run verify:images`, `npm run lint`, `npm run test -- --run`, `npm run build`,
`bash scripts/verify.sh`, and the Playwright suites. These are agent-run results; the owner-run rerun
is still open. CI is not used as release evidence.

## Human release checks

| Check | State | Needed before photo release |
|---|---|---|
| Iranian Persian meaning and culture | Pending | Named reviewer; check all eight and sangak closely |
| Danish plain words and alt text | Pending | Named reviewer |
| Keyboard, screen reader, zoom, image off | Pending | Named accessibility reviewer |
| Five Danish-speaking beginners | Pending | Date, device, confusion, later recall, fixes, rerun |
| Owner local rerun and rights approval | Pending | Set each `ownerReview` only after approval |

Do not mark Plan 013 accepted while a human row above is pending or a critical/high issue is open.
