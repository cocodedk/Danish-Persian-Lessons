# Dansk lydskrift — review convention

Status: implementation candidate. Native Danish and Persian approval is required before release.

The short Danish line is a reading bridge, not phonetic transcription. IPA remains the precise
reference, and approved human audio remains the pronunciation authority. A reviewer must read every
manifest row aloud; this table does not waive row-by-row review.

## Vowels

| Persian IPA | Danish spelling | Danish anchor | Ambiguity to review |
|---|---|---|---|
| /æ/ | `a` | a in “kat” | Danish quality varies by surrounding consonants. |
| /e/ | `e` | e in “let” | A final `e` may be reduced by a Danish reader. |
| /o/ | `o` | o in “foto” | Must not be read as Danish `å`. |
| /ɒː/ | `å` | å in “år” | Approximation only; Persian quality and Danish stød differ. |
| /uː/ | `u` | u in “du” | Danish lip rounding is only an anchor. |
| /iː/ | `i` | i in “vi” | Danish vowel quality is only an anchor. |
| /ej/ | `ej` | “nej” without final consonant | Review as one Persian diphthong. |

## Consonants and letter groups

| Persian IPA | Danish spelling | Danish anchor | Ambiguity to review |
|---|---|---|---|
| /b p t d k ɡ f v m n l s h j/ | `b p t d k g f v m n l s h j` | closest Danish consonant | Danish soft `d` after a vowel is not Persian /d/. |
| /dʒ/ | `dj` | English j in “jazz” | Not ordinary Danish `dj` across a word boundary. |
| /tʃ/ | `tj` | first sound in “chips” | English loanword anchor is deliberate. |
| /ʃ/ | `sj` | sj in “sjal” | Stable Danish approximation. |
| /ʒ/ | `zj` | French j in “journal” | Danish has no native equivalent. |
| /x/ | `kh` | German ch in “Bach” | A Dane may incorrectly read `kh` as /k/. |
| /ɾ/ | `r` | a single tapped or lightly rolled r | A Danish uvular r is not the target. |
| /z/ | `z` | English z in “zoo” | A Dane may read `z` as /s/. |
| /ɢ~ɣ/ | `gh` | deep g/r at the back of the throat | Tehrani ghaf and gheyn share this cue. |
| /ʔ~∅/ | `stop` on the key; word-level spelling elsewhere | a small break or no separate sound | ع is not a Danish vowel and must be read in its word. |

## Whole-word rules

- Spell the heard modern Tehrani form, not a letter-name sequence.
- Use `å`, never `aa`, for /ɒː/ in the learner-facing cue.
- Keep `kh`, `gh`, `sj`, `tj`, `dj`, and `zj` consistent with the table.
- Do not hide the five known Danish traps: `z`, `kh`, post-vocalic `d`, word-final `h`, and `-rd`.
- Do not map ع to Danish æ, ø, å, or y. Those are Danish vowels; ع has a different job.
- Polysyllabic IPA must carry reviewed lexical stress. The Danish cue does not encode stress by
  itself; the human recording and IPA must make it available.
- An exception is recorded on its manifest row. It does not silently create a second convention.

The candidate word-stress rule follows the University of Texas
[Persian stress guide](https://sites.la.utexas.edu/persian_online_resources/phonology/stress/): nouns,
adjectives, prepositions, and adverbs carry final-syllable stress, with morphological exceptions
reviewed separately. This source guides the data but does not replace the required phonetics review.

Source rows: [content-review-manifest.json](content-review-manifest.json).
