# Content review protocol

Status: ready for external review; no approval is implied by an empty decisions file.

`content-review-manifest.json` is generated from the typed catalog with `npm run review:content`.
It contains the exact Persian text, marked teaching form, Danish help, Danish sound spelling, IPA,
contextual cues, role-sensitive flag, stress flag, and audio status for all 172 catalog entries.

Every direct bilingual block also follows `BILINGUAL-PARITY-REVIEW.md`: Danish may use natural word
order, but it may not add or omit a claim made by the Persian. Reviewers inspect both the manifest
row and the assembled screen because runtime counters or helper text can create a mismatch that is
not present in static catalog data. Non-technical status and corrective copy targets Zipf 4.8 or
higher; any exception needs a written curriculum reason and native approval.

Cue coverage is intentionally explicit. `contextual` rows carry span-level teaching candidates;
`token` rows decompose connected text; `whole-word` rows preserve the authoritative whole
pronunciation but still require the reviewer to decide whether finer decomposition is needed. A
whole-item candidate is not native approval.

Each reviewer works row by row and records `approve`, `change`, or `reject` in
`content-review-decisions.json`. A change/reject record must include a concrete note. Reviewer IDs
must match a signed reviewer profile in the release packet; initials alone are insufficient.

Required roles:

1. `iranian-persian-1` — native modern Iranian Persian.
2. `iranian-persian-2` — independent native reviewer with primary-literacy experience.
3. `phonetics` — IPA, syllables, stress, contextual sound, and recording alignment.
4. `danish` — native Danish copy and aloud reading of every sound-spelling cue.

Audio receives a separate second-native take review after files, consent, licence, loudness, and
transcripts exist. An entry is not release-approved until all required roles approve the same source
version and every change has been applied and reviewed again.
