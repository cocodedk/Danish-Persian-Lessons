# AAA Lesson Image Specification

Status: normative for [Plan 013](../plans/013-real-lesson-images.md). Version: 2026-08-07.

This is a narrow raster-photo exception to the app's SVG-first art direction. It covers lesson
meaning photos only. Icons, rewards, letter forms, controls, and decoration remain SVG or CSS.

## Release rule

A lesson photo ships only when it is accurate, adaptive, accessible, local, licensed, small, and
reviewed. Failure in any one area blocks that photo, not the text lesson around it.

## Accurate

- The photo MUST show the exact meaning taught by the linked Persian entry. Persian, pronunciation,
  Danish, alternative text, caption, and photo MUST agree.
- An Iranian Persian literacy reviewer MUST approve culturally specific objects and uses. A Danish
  reviewer MUST approve the learner-facing Danish.
- Cropping, filters, staging, and captions MUST NOT suggest a meaning the source does not show.
- An image with two plausible target meanings MUST be rejected or restaged.
- Lesson images MUST be real still photographs. Emoji, Unicode picture symbols, clip art, cartoons,
  animated GIFs, and AI-made or AI-extended images MUST NOT be used.
- Writing inside a photo MUST NOT teach a word. Visible brands, titles, addresses, and unrelated text
  MUST be cropped out or the photo rejected.

## Adaptive

- A meaning photo MAY appear in the model step and post-answer explanation.
- A photo that reveals an answer MUST NOT appear before or during Persian-to-meaning or Persian-
  reading retrieval. It MAY appear after an answer as feedback.
- A picture-to-Persian task MUST be stored as guided practice. It MUST NOT set `successfulRetrieval`,
  `retained`, or an equivalent mastery field.
- A connected text MAY show a context photo only after the learner has attempted to read it.
- The lesson MUST remain understandable and usable when every photo is disabled or fails to load.

This rule follows evidence that concrete pictures can help beginner second-language word learning,
while answer-revealing pictures during retrieval can reduce later recall. The app therefore uses
photos for clear teaching and feedback, not as a hidden answer key.

## Accessible

- Every lesson photo MUST be an informative `<img>` with short, simple Danish `alt` text that gives
  the relevant meaning. Decorative lesson photos are not allowed.
- Meaning, Persian writing, pronunciation, and instructions MUST exist as real text outside the image.
- The image MUST NOT be the only way to find an action, state, answer, or error. Meaning MUST remain
  available when the image is unseen, broken, or shown without color.
- DOM and reading order MUST be Persian, pronunciation, image, then Danish help. Visual rearrangement
  MUST NOT change that order.
- Images MUST reflow without overlap, clipping, horizontal page scroll, or blocked controls from
  320 CSS px through 2560 CSS px and at 200% browser zoom and 400% text zoom.
- No animation, parallax, auto-pan, or zoom-on-hover is allowed.

## Source and rights

Use this order:

1. a self-made or commissioned photo with a written project license;
2. Wikimedia Commons public-domain, CC0, CC BY, or CC BY-SA work with exact-file compliance;
3. Unsplash work with the source page and rights review saved;
4. Pixabay only after a reviewer records why shipping the processed lesson copy is allowed.

Google Images, Pinterest, social media, random blogs, unknown licenses, and source pages that cannot
be saved MUST NOT be used. Unsplash and Pixabay licenses do not remove privacy, publicity, trademark,
property, or other third-party rights. Wikimedia terms differ by file. Review the exact source page.

The first pilot MUST contain no identifiable person, minor, private interior, address, registration
number, signature, or prominent trademark. A later image with a person or private property requires a
stored release reference; lack of proof means rejection.

Each image MUST have an author-time record equivalent to:

```ts
interface ImageSourceReview {
  id: string
  entryIds: string[]
  creator: string
  sourceName: string
  sourcePage: string
  license: string
  licenseUrl: string
  downloadedAt: string
  originalSha256: string
  edits: string[]
  peopleOrPrivateProperty: 'none' | 'release-recorded' | 'rejected'
  releaseRef?: string
  rightsReviewedBy: string
}
```

The app MUST have a same-origin `Billedkilder` route. It MUST show the credit, source, license, and
changes required by each source. An optional user-clicked external source link MUST use
`rel="noreferrer"`; it MUST NOT be prefetched.

## Privacy and delivery

- Source discovery and download happen only during authoring. The app MUST NOT hotlink, call an image
  API, load a remote thumbnail, use a third-party image CDN, or contact the source at runtime.
- The committed asset MUST have EXIF, GPS, IPTC, XMP, comments, and embedded previews removed. The
  cleaned file MUST be re-encoded; renaming the original is not enough.
- The owner MUST record a metadata scan of each output and a production network trace with no remote
  request. GitHub Actions and other CI systems are not required evidence.
- Source originals containing personal metadata MUST stay outside the public build and repository.

## Runtime contract

The image catalog MUST provide at least:

```ts
interface LessonImage {
  id: string
  entryIds: string[]
  purpose: 'meaning-model' | 'post-reading-context'
  altDa: string
  creditId: string
  width: number
  height: number
  focalPoint?: `${number}% ${number}%`
  sources: Array<{
    type: 'image/avif' | 'image/webp' | 'image/jpeg'
    srcSet: string
  }>
}
```

One shared component MUST render all lesson photos. It MUST use `<picture>`, a JPEG fallback, local
URLs, intrinsic `width` and `height`, useful `srcset` and `sizes`, and `decoding="async"`. It MUST use
`loading="lazy"` below the first viewport. Only the first visible teaching photo MAY be eager.

## Asset and route budgets

| Output width | Maximum file size |
|---|---:|
| 480 px | 60 KB |
| 960 px | 140 KB |
| 1440 px, only when approved | 220 KB |

- WebP and JPEG outputs are required. AVIF is optional and MUST NOT replace the JPEG fallback.
- The home route MUST load zero lesson-photo bytes.
- A word-teaching route MAY load one eager photo, no larger than 180 KB, before interaction.
- The first viewport of an image index MUST stay at or below 300 KB; its whole route MUST stay at or
  below 1 MB. Later images MUST be lazy.
- A budget increase requires recorded learner value and owner approval.

## Visual contract

The photo SHOULD feel like a small, clear learning picture printed in the notebook. Use the same
honest photo in light and dark modes, a restrained one-pixel edge, no color tint, no gradient, no
heavy shadow, and no tape or instant-photo frame. Default to a 4:3 crop with a maximum rendered width
of 28rem. Do not make a photo a full-width hero or background.

## Required evidence

- source record, cleaned file, variants, sizes, metadata scan, and no-remote-URL scan;
- production route trace showing only same-origin image requests;
- image-on, image-off, broken-image, keyboard, and screen-reader checks;
- 320, 390, 768, 1280, and 2560 CSS px checks plus 200% zoom and 400% text zoom;
- named Persian, Danish, accessibility, and five-beginner reviews with date, device, commit, findings,
  fixes, and reruns; and
- owner-run local commands and results. CI status is not part of the release decision.

## Research basis

- [W3C image accessibility tutorial](https://www.w3.org/WAI/tutorials/images/)
- [web.dev responsive images](https://web.dev/articles/responsive-images)
- [Unsplash license](https://unsplash.com/license) and [release guidance](https://help.unsplash.com/en/articles/2612329-releases-and-trademarks)
- [Pixabay license summary](https://pixabay.com/service/license-summary/)
- [Wikimedia Commons reuse guide](https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia/en)
- [ICO guidance on hidden EXIF data](https://ico.org.uk/media2/pbwchh24/disclosing-documents-to-the-public-securely-all-1-0-0.pdf)
- [Beginner second-language word learning with pictures](https://doi.org/10.1007/s10936-018-9623-2)
- [Answer-revealing images during retrieval practice](https://doi.org/10.1037/edu0000499)
