# Pedagogical Approach

Status: research recommendation, not yet a normative product specification  
Research date: 2026-08-08

## Decision in one sentence

Build one accurate Danish-Persian learning engine with two front doors: a child journey that begins
with play, choice, sound, and creation, and a grown-up notebook that holds the curriculum, IPA,
progress detail, and Babak's Danish-Persian experience.

The same content can live under one roof without asking one homepage to serve two incompatible jobs.

## Why the first glance currently misses

The repository is strong on accuracy, accessibility, progress, rewards, and depth. The first-run
experience still introduces the *system* before it gives the learner something satisfying to do.

| Finding | Severity | Evidence | Simplest repair |
|---|---:|---|---|
| The first meaningful action arrives after explanation | P1 | First run opens a six-step orientation; step 1 is mostly Danish prose and phonetic notation | Start with a guided Persian action; explain only what that action needs |
| The defined primary learner is an adult | P1 | `AAA-LEARNING-SPEC.md` explicitly targets a Danish-speaking adult | Define a child age band and a separate child journey before redesigning visuals |
| The opening promise is a 39-item course | P1 | Home says “Start med alfabetet” and “39 tegn tilbage” | Promise a meaningful result in one minute, not completion of an inventory |
| Identity arrives too late | P2 | The recommended flow places the learner's name after the full alphabet | Show the completed name early as an invitation; teach its pieces gradually |
| Adult reference detail competes with child momentum | P2 | IPA, detailed explanations, settings, progress, rewards, and lesson browsing share the opening flow | Move reference depth to optional help and the grown-up notebook |
| The notebook style is authentic but emotionally quiet | P2 | Saved 390 px screenshots are clear and restrained, but have little immediate play or narrative energy | Keep the notebook material; add a living guide, purposeful motion, sound, and one vivid task |

This is an information-architecture and motivation problem before it is a color or animation problem.

## North star

Within 30 seconds of opening the child journey, the learner voluntarily performs a real Persian
reading or writing action and understands the result. Within 90 seconds, she has made something she
recognizes as hers: a name card, a word, or a tiny message.

The strongest success signal is not lesson completion. It is choosing “one more” or returning later
without a parent prompt.

## Product model

### Child journey

Primary job: “Let me discover, make, and read something in Persian.”

- One visible mission at a time.
- Choice before instruction: name, mystery word, or short story.
- Audio, image, movement, and touch carry the first explanation.
- Two-to-five-minute sessions with a dignified “done for now” exit.
- Progress is a collection of things made and words recognized, not a looming syllabus.

### Grown-up notebook

Primary job: “Let me understand the method, inspect progress, browse the course, and preserve useful
Danish-Persian knowledge.”

- Curriculum map, lesson library, IPA, Danish sound guidance, review state, and content notes.
- Parent-facing context for what was practiced and one optional offline follow-up.
- No child surveillance, ranking, pressure, or remote analytics.
- Authoring and cultural notes remain separate from the child's immediate play surface.

### Shared foundation

Both journeys use the existing typed Persian catalog, native-review process, local storage, adaptive
review scheduler, rewards permanence, route accessibility, and offline-first architecture. This is a
presentation and journey split, not two independent products.

## What “AAA for my daughter” should mean

The existing release definition remains valuable:

- **Accurate:** Persian form, contextual sound, Danish help, IPA, and reviewed audio agree.
- **Adaptive:** practice stays short and revisits what the learner is ready to retrieve.
- **Accessible:** every action works across touch, keyboard, assistive technology, sound-off, and
  reduced-motion use.

For a child-facing release, those three gates are necessary but not sufficient. Add an experience
acceptance gate: the opening is agentic, emotionally alive, culturally personal, and polished enough
that the learner wants to touch it before an adult explains it.

This does not mean claiming whole-site WCAG AAA. Keep the existing target of WCAG 2.2 AA plus named
AAA criteria.

## Principles to carry forward

1. **Invitation before curriculum.** Let the learner enter a tiny experience immediately.
2. **Autonomy is structural.** Offer meaningful choices, a visible skip, and an equally respectful exit.
3. **Competence comes early.** The first task is heavily guided and almost impossible to misunderstand.
4. **Identity is content.** Names, family words, and real cultural connections are learning material.
5. **Writing is physical.** Trace, copy, and freehand writing complement recognition and typing.
6. **Teach in context.** A letter appears in a useful word and its positional form, not only in a chart.
7. **Rewards acknowledge learning.** They never threaten loss, compete socially, or replace the meaning.
8. **The parent is a nearby ally.** Support joint moments without making the parent the operator.
9. **One screen, one decision.** Help and reference depth appear after the action needs them.
10. **Polish serves comprehension.** Motion shows stroke, joining, or transformation; sound models language.

## Strengths to preserve

- No account, advertising, analytics, or runtime AI.
- No locked lessons, shame, lives, leaderboards, or streak loss.
- The Persian exercise-notebook identity and teacher's red pen.
- The learner's name as a teaching instrument.
- Honest distinctions between seen, practiced, remembered, and due.
- Correct Persian text rules, contextual pronunciation work, and native review requirements.
- Local, deterministic, forgiving progress and review.
- Existing mobile, accessibility, visual, and storage test coverage.

## Recommended first implementation slice

Do not redesign the complete home screen first. Build one isolated, child-first 90-second vertical
slice behind a direct route or local feature flag:

1. Choose “my name” or “a mystery word.”
2. Hear and see one complete Persian item.
3. Complete one supported trace or tap-to-build action.
4. Recognize the item once without answer-defining help.
5. Receive a personal artifact and choose “one more” or “done for now.”
6. Test all three candidate hooks with the daughter before promoting any route to the default.

The slice should reuse existing catalog, name, image, reward, and progress capabilities. It should not
require a new account system, backend, or broad curriculum rewrite.

## Documents

- [Research findings](RESEARCH-FINDINGS.md): product patterns, learning science, caveats, and sources.
- [AAA experience blueprint](AAA-EXPERIENCE-BLUEPRINT.md): first session, navigation, testing, metrics,
  accessibility, and implementation risk.

## Open decisions before implementation

- The daughter's age and independent Danish reading level.
- Whether she prefers character-led stories, creative making, puzzles, or realistic cultural tasks.
- Whether her own name feels exciting, private, or too school-like as the first artifact.
- Whether the first child release targets reading, handwriting, or a deliberately balanced pair.
- Which family relationships and cultural situations are genuinely meaningful to her.

These are not reasons to delay prototyping. They are the variables the first three tiny prototypes
should reveal.
