# AAA Learning Specification

Status: normative for Plan 012. This spec defines what the learner must be taught, how evidence of
learning is earned, and what content may enter a challenge.

## Learner and promise

The primary learner is a Danish-speaking adult who knows no spoken Persian and has never read an
Arabic-derived script. The first release teaches foundational Iranian Persian decoding; it MUST not
imply conversational fluency or general text comprehension. Heritage speakers remain supported, but
their prior phonology may not be assumed.

The core outcome is: the learner can connect reviewed Persian forms to sound and meaning, recognize
positional changes, and read short controlled text without depending permanently on transliteration.

## Accurate orthography model

### Letters, sounds, and roles

- A letter name, isolated glyph, contextual form, phonological value, and orthographic role are
  separate concepts. Data and UI MUST NOT collapse them into one universal “sound”.
- Alef MUST be retaught contextually:
  - initial `آ` carries long /ɒː/;
  - non-initial `ا` commonly writes long /ɒː/;
  - initial `ا` can carry a marked short vowel and precedes `و` or `ی` for initial long /uː/ or /iː/;
  - the standalone letter-name entry is not evidence that every `ا` in a word is /æ/.
- Vav and ye MUST distinguish consonantal and vowel roles. He, eyn, hamze, and contextual signs MUST
  receive the same role-based treatment. Exceptions and Arabic loans MUST be explained at the point
  they become relevant, not hidden under a false beginner rule.
- Homophonous Persian letters MUST be taught as different spellings of the same modern Tehrani sound
  where applicable. A sound-to-letter challenge MUST not offer multiple valid answers.
- Positional-form help inherits a letter identity, but word reading uses contextual cues rather than
  concatenated letter-name or isolated-sound entries.

The model follows the [University of Texas Persian writing-system overview](https://sites.la.utexas.edu/persian_online_resources/the-writing-system/),
its [madd explanation](https://sites.la.utexas.edu/persian_online_resources/the-writing-system/madd/),
and native Iranian literacy review. These references guide but do not replace human approval.

### Contextual reading cues

Every taught word, name, or phrase MUST support an ordered reading-cue representation capable of
describing:

- one or more written code points and their displayed span;
- the contextual sound and Danish cue for that span;
- an unwritten short vowel anchored between/after written letters;
- a silent or carrier role without inventing a phoneme;
- joining behavior that changes form but not identity;
- a whole-item pronunciation that remains the authority.

For `بابا`, the two `ا` cues are long /ɒː/. For `بابک`, the first `ا` is /ɒː/ and the short /æ/ after
the second `ب` is explicitly shown as unwritten. A learner MUST never be expected to infer `[bɒːbæk]`
from a helper sequence that states `[b] [æ] [b] [k]`.

### Pronunciation and Danish sound spelling

- Standard modern Tehrani Persian is the target. Whole-word IPA MUST include phonemic length and
  lexical stress on polysyllabic entries unless the reviewer records why stress is not contrastively
  useful there.
- `lydskrift` MUST use one published Danish convention table. Each mapping includes Danish examples,
  ambiguity notes, and the related IPA. New spellings require Danish and Persian approval.
- IPA is precise reference; Danish sound spelling is the immediate bridge. Both remain available,
  but neither substitutes for hearing a native recording.
- A word's `fa`, marked teaching form, IPA, Danish cue, meaning, reading cues, and audio transcript MUST
  agree in one review row. Any mismatch blocks release.

## Human audio specification

### Coverage and manifest

Every static pronounceable `PersianEntry` MUST reference an audio manifest row containing:

```ts
interface PronunciationAudio {
  entryId: string
  file: string
  locale: 'fa-IR'
  speakerId: string
  transcript: string
  durationMs: number
  reviewedBy: string[]
  consentRef: string
  license: string
}
```

Displayed letter sound/function and displayed letter name are separate entries and recordings.
Non-pronounceable symbols use an explicit `audioNotApplicable` reason. Dynamic learner names have
letter/context cues but no fabricated full-name audio or IPA.

### Recording quality

- One native standard-Tehrani speaker records in a quiet, non-reverberant environment. A second native
  reviewer checks every take against the approved transcript and IPA.
- Files MUST be mono, consistently normalized, free of clipping/noise processing artifacts, and
  trimmed without cutting consonant releases. Target integrated loudness is -20 LUFS ±2 and true peak
  no higher than -1 dBTP.
- Each clip SHOULD remain under 100 KB; longer phrases MAY exceed it when compression would impair
  intelligibility. The manifest check records all exceptions.
- Audio is learner-initiated, replayable, and optionally slowed to 0.8× with pitch preservation. It
  MUST never be the only carrier of instructions, correctness, or meaning.

## Teaching sequence

Every new mapping follows this order:

1. **Orient:** show what is new and where attention belongs.
2. **Model:** show form, contextual sound, human audio, Danish cue, IPA, and meaning.
3. **Discriminate:** compare it with one useful near-neighbour and explain the distinction.
4. **Guide:** complete one supported tap/read/assembly action with help visible.
5. **Retrieve:** answer once without answer-defining help.
6. **Reveal:** after every attempt, show the complete teaching entry in the current viewport.
7. **Revisit:** retrieve after intervening items and on later local days.
8. **Transfer:** use the item in a controlled word, phrase, and eventually a short text.

The learner may skip, reveal, retry, or stop. Reveal and error never award retained status, but never
remove an earned reward. A passive action MUST say “Set” or “Gennemgået”, not “Jeg kan den”.

## Review state and scheduler

### State

```ts
interface ReviewState {
  entryId: string
  introducedAt: string
  successfulRetrievals: number
  successfulDays: string[]
  stage: 0 | 1 | 2 | 3 | 4 | 5 | 6
  dueDay: string
  lapses: number
  lastAttempt?: 'wrong' | 'revealed' | 'correct'
}
```

Stored data is normalized, versioned, and local-only. `introduced`, `retrieved`, `retained`, and `due`
are derived states. Retained requires correct retrieval on at least two different local days with one
interval of at least three days. Once-earned rewards and “previously retained” history remain, while
the current item may honestly become due again.

### Deterministic intervals

- Stage intervals in local calendar days are `[0, 1, 3, 7, 14, 30, 60]`.
- First correct retrieval advances from stage 0 to 1 and is due next day. A later correct retrieval
  advances one stage, never more than one per calendar day.
- A wrong or revealed answer sets `lastAttempt`, increments lapses only for wrong answers, requeues the
  item after at least two different tasks in the current session, and makes it due the next local day.
  It does not erase successful history or earned rewards.
- Clock rollback, timezone change, absence, and corrupted future dates MUST NOT lose an item or create
  an unbounded session. Due dates normalize through the existing local-day utilities.

### Session composition

- Maximum 12 tasks and target duration five minutes.
- Order: up to 8 due reviews; up to 4 new items when capacity remains; one eligible transfer task
  replaces the final new task. A learner may choose “kun repetition” or continue after the summary.
- Do not present the same answer twice in succession. Interleave letter identity, contextual form,
  sound, word meaning, and reading when eligible.
- A session ends with what was introduced, retrieved, due next, and one clear return action. Do not
  show accuracy percentages, failure counts, league tables, or countdown pressure.
- Deterministic choice arrangement may vary by entry and due day, but MUST be reproducible in tests and
  MUST not teach button position.

## Connected-reading content

- Each four-word vocabulary group has at least one natural phrase. Each unit has one 3–5-sentence
  microtext and one meaning question.
- A text manifest lists every token, its introduced source, and any explicitly taught particle. One
  hundred percent of tested content MUST have been taught before the challenge.
- First presentation uses marked teaching text and sentence audio. Retrieval uses ordinary unmarked
  Persian; a reveal restores marks, reading cues, audio, and Danish meaning without penalty.
- Controlled vocabulary MUST not justify unnatural Persian. If a natural sentence needs one new
  function word, teach it first as a full catalog entry.
- Comprehension asks for meaning, reference, or sequence—not grammar terminology the app did not teach.

## Content and efficacy evidence

- Catalog tests validate code points, ZWNJ, marks, stress policy, reading-cue coverage, manifest IDs,
  and absence of context-free challenge mappings.
- Native review is row-by-row and records approve/change/reject with reviewer and version.
- Five zero-knowledge Danish novices complete immediate and 7±2-day tasks defined in the quality bar.
- Retrieval and spacing choices are grounded in
  [Karpicke & Roediger (2008)](https://doi.org/10.1126/science.1152408) and
  [Cepeda et al. (2008)](https://pubmed.ncbi.nlm.nih.gov/19076480/). The small usability cohort is a
  release diagnostic, not evidence of general educational efficacy.
