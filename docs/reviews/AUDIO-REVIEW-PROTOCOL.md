# Human audio review protocol

Status: infrastructure ready; zero recordings approved.

`audio-recording-queue.json` is generated with `npm run review:audio`. It lists all 173 static
pronounceable entries and their exact candidate transcript, IPA, expected file path, and reviewers.
Its status is `draft-awaiting-content-approval`: do not record a row while its Persian, stress, IPA,
or Danish cue still has an unresolved content decision.

## Before recording

1. The two Iranian reviewers and phonetics reviewer approve the row's Persian, transcript, IPA, and
   stress in the content-review decisions.
2. Record one native standard-Tehrani speaker profile with qualification, environment, microphone,
   consent reference, and licence. Keep private personal consent outside the public repository; the
   manifest stores only its controlled reference.
3. Use the queue's exact filename under `public/audio/`. Letter sound/function and letter name are
   separate entries and must not share one recording.

## Take requirements

- quiet, non-reverberant, mono recording with no clipped release or processing artifact;
- integrated loudness from -22 to -18 LUFS and true peak no higher than -1 dBTP;
- normal natural pace; the app produces optional 0.8× playback from the same approved take;
- target at most 100 KB. A larger intelligible phrase needs a concrete `sizeException`;
- no generated voice, browser speech synthesis, or fabricated whole-name recording.

Save the machine-readable loudness output as `docs/reviews/audio/<entry-id>.json`. Add the manifest
row only after the file and report exist. The source checks require the file, mono channel count,
metrics, duration, consent/licence references, and two unique take reviewers.

## Independent review

The second native Iranian reviewer checks the take against the approved transcript without relying
on the filename. The phonetics reviewer independently checks segmental pronunciation, length,
stress, trimming, and alignment. Both reviewer IDs go in `reviewedBy`; the speaker alone cannot count
as both approvals.

Run `npm run test -- --run src/audio/manifest.test.ts src/reviews/audioQueue.test.ts`, then the full
`npm run verify`. A passing manifest check proves artifact integrity, not speaker consent or human
accuracy by itself; those signatures remain required in the release packet.
