# Plan 015 — Speaking first with reviewed Persian audio

Status: implementation ready; public activation waits for native review of all 97 launch clips.
This plan supersedes the human-only audio clauses in Plan 012. It does not weaken the need for
accurate Persian or human approval.

## Goal

A new learner should be able to begin by listening and speaking. Persian writing remains visible,
and the full reading and writing course remains open, but script knowledge is not a first-step test.

The first loop is:

1. See one clear picture, colour, or number.
2. Hear one reviewed Persian word or sentence.
3. See the exact Danish meaning, Danish sound help, and IPA.
4. Say it aloud.
5. Optionally record and hear the learner's own voice.
6. Move to the next short page.

## Fixed decisions

- The primary first path is speaking. Words and script are separate open paths.
- Everyday Tehrani and formal standard Persian appear side by side only when they differ.
- Generated Piper sound is an authoring draft, never a runtime service.
- One named native Persian reviewer must approve every generated clip before publication.
- The first corpus is the 97 spoken forms in bridges, conversation, numbers, and vocabulary.
- Learner recordings stay in memory. They are not uploaded, saved in local storage, or retained
  after the page is left.
- Speaking progress is separate from reading progress. Seeing text is not counted as hearing or
  saying it.

## Content model

`PersianEntry` may carry explicit `spokenForms`. Each form has its own register, Persian text,
Danish meaning, Danish sound spelling, IPA, and stable audio ID. Entries with no explicit forms
derive one neutral spoken form.

The approved audio manifest is a source union:

- `piper`: engine version, voice model, model checksum, synthesis text, and source text hash;
- `human`: speaker ID and consent reference.

Both sources carry the exact transcript, audio measurements, licence, release report, and at least
one named native Persian reviewer.

## Authoring pipeline

1. `audio:setup` creates the ignored environment and downloads the checksummed voice.
2. `audio:queue` exports all missing spoken forms from the typed catalog.
3. `audio:generate` makes local WAV/MP3 drafts and measures their actual loudness and true peak.
4. `audio:review` opens a local review board with Persian, Danish, sound help, IPA, audio, and
   measurements together.
5. `audio:approve` promotes only checked rows to content-hashed public files and provenance rows.
6. `audio:verify` rejects broken references, bad measurements, unnamed approvals, wrong hashes,
   large unexplained clips, and stray public files.

No step contacts an audio service at app runtime. Draft work stays under `.audio/`.

## Learner interface

- `#/tal` is the picture-book shelf.
- `#/tal/:lesson/:page` shows one word or sentence at a time.
- The main sound button begins as “Hør” and becomes “Hør igen”.
- Only one model or learner clip plays at a time.
- The learner can record, stop, hear, redo, or delete a short clip.
- Denied or missing microphone access leaves the lesson usable.
- Navigation becomes Tal · Ord · Skrift only after the full first corpus is approved.
- Until then, new and returning users keep the current public paths.

## Launch gate

`talkAudioReady()` must find every one of the 97 required clip IDs in the approved manifest. An
empty or partial manifest keeps `#/tal` closed and prevents it from becoming the first route. This
is a release gate, not a loading state.

## Acceptance

- [x] Spoken-form and audio-provenance contracts are typed and tested.
- [x] Local setup, queue, generation, review, approval, and verification scripts exist.
- [x] Draft generation is deterministic from text, voice settings, and model checksum.
- [x] The picture-book talk shelf and single-page speaking loop are implemented.
- [x] Every visible launch page has a real picture, a colour field, or a large number.
- [x] Model playback supports replay, stop, normal speed, slow speed, mute, and one active clip.
- [x] Learner recording is short, local-only, replayable, and safely removed.
- [x] Speaking progress and journey choice migrate without faking past speaking work.
- [x] GitHub Pages audio URLs respect the Vite base path.
- [x] The first-path change is dormant behind the complete-corpus gate.
- [ ] A named native Persian reviewer approves all 97 talk clips.
- [ ] The approved files, reports, and generated manifest are checked in.
- [ ] A native Persian reviewer and beginner Danish users check the live talk path.
