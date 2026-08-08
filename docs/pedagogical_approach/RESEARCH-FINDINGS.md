# Research Findings

## Research question

How do successful language and early-learning apps create motivation at first contact, and what should
change when the learner is a child with heritage-language interest but did not request the app?

The review combines current product documentation, published learning research, Persian heritage
language research, and a source/screenshot inspection of this repository. Product pages describe the
makers' intended methods; they are useful pattern evidence, not independent efficacy proof.

## Patterns in successful products

| Product | Observable approach | Lesson for this app | What not to copy blindly |
|---|---|---|---|
| Duolingo | Interaction begins immediately; difficulty rises gradually; explanations are optional and small; sessions are bite-sized and personalized | Put a simple Persian action before orientation prose; reveal help when needed | Aggressive streaks, social comparison, and points can displace the child's own reason to learn |
| Duolingo ABC | Uses narration and purposeful animation to make decoding visible; balances joyful presentation with explicit literacy instruction | Animate right-to-left assembly, joining, and stroke order; narrate for younger learners | Animation without a teaching job adds stimulation rather than understanding |
| Khan Academy Kids | Character-guided, story-based, interactive activities; a child can follow an adaptive path or explore a library | Provide a friendly guide and limited free choice while keeping a recommended next activity | A young-child mascot style may repel an older child; age must shape the tone |
| Drops | Visual association, game-like micro-practice, a five-minute promise, personalized review, and no loss of a score streak | Pair Persian words with strong images and keep sessions tiny and forgiving | Visual vocabulary alone does not teach connected reading or handwriting |
| Write It! Arabic | Stroke-by-stroke guidance, handwriting recognition, brief practice, review, and testing for a related cursive script | Teach body strokes and dots, then isolated/initial/medial/final forms through touch | Timed tests and strict recognition thresholds can punish motor development or imperfect touch input |
| Duolingo Japanese character tools | Separate character practice; tracing, freehand, matching, spelling, and reading; gradual introduction; characters reconnect to whole words | Create a Persian “letter studio” that moves from guided stroke to word use and contrasts similar forms | A detached character grid can become another inventory unless every shape returns to meaningful words |

### Shared product logic

The useful common denominator is not “gamification.” It is a loop:

1. Give the learner a concrete goal she can understand now.
2. Ask for one small action before a lecture.
3. Make feedback immediate, local, and explanatory.
4. Adjust the next action to what she just demonstrated.
5. End quickly with visible progress and a real choice.
6. Revisit later through retrieval, not just re-exposure.

## Motivation: protect the reason to learn

Self-determination research organizes durable motivation around autonomy, competence, and relatedness.
A large student-motivation meta-analysis also reports positive associations between parental autonomy
support and achievement, perceived competence, attitudes toward school, and self-regulation.

Applied here:

- **Autonomy:** “What would you like to make?” is stronger than “Start the alphabet.” Skip and stop
  must be real, calm options. The daughter can help choose themes, words, sounds, and visual tone.
- **Competence:** the opening action should be easy to interpret and produce a satisfying Persian
  result within one minute. Difficulty should rise only after success is legible.
- **Relatedness:** Persian should connect to people, names, messages, food, music, places, and family
  memories that matter to her, not an abstract duty to preserve heritage.

Because the parent proposed the app, external motivation is already present. The design should avoid
adding more pressure. It can create conditions in which interest becomes hers, but it cannot demand
that transformation.

## Heritage Persian: identity must be lived, not displayed

Recent Persian heritage-language work argues that neglecting hybrid identities and relatable
curricular material contributes to attrition. A 2026 study of Farsi-speaking families in online
heritage sessions found parents balancing proximity with child autonomy, using scaffolding, songs,
routines, and encouragement while preserving child independence.

Product consequences:

- Do not frame Danish and Persian as competing identities. Let both languages appear as resources.
- Use the learner's real mixed context: a Danish explanation can unlock a Persian family message.
- Let the child choose whether a family connection is delightful or embarrassing.
- Treat the parent's stories as source material, then shape them into child-sized missions rather
  than placing adult memoir text on the child home screen.
- Include contemporary, ordinary Persian life as well as heritage symbols. Authenticity is broader
  than festivals, flags, and nostalgia.

## Script learning: touch must lead to recognition and use

A 2025 experiment with prereaders found stronger letter and word outcomes after hand-copying or
tracing than after keyboard typing. The study links graphomotor action with letter-sound mapping and
orthographic retention. This supports writing practice, but it does not justify endless tracing.

For each new Persian shape family:

1. See and hear the letter inside a meaningful word.
2. Watch the useful stroke or joining behavior.
3. Trace with visible start, direction, and dots-last guidance.
4. Copy with lighter support.
5. Recognize it among one or two useful near-neighbours.
6. Build or read the word again.
7. Revisit from memory on another day.

Persian-specific design should group letters by shared body and dot pattern where pedagogically
sound, while still teaching identity, sound, joining, and positional form separately. A perfect
finger trace is not the learning outcome; recognition, production, and reading transfer are.

## Retrieval and spacing

Elementary-school experiments have found robust benefits from retrieval practice over repeated
study across children with differing reading comprehension and processing speed. The repository's
existing deterministic scheduler already aligns with this evidence.

For the child journey:

- Keep retrieval rounds to two or three items at first.
- Interleave one familiar success with one new challenge.
- Revisit errors after other material and on a later day.
- Never convert a lapse into lost rewards, a broken streak, or a public failure count.
- End before fatigue. A voluntary second session is more valuable than forced completion.

## Rewards and gamification

Research on gamification and intrinsic motivation is mixed. A recent meta-analysis found potential
benefits but also identified lack of perceived autonomy and competence as central risks.

Use rewards as warm evidence of agency:

- A made object, unlocked word, recorded voice attempt, or completed page is the primary reward.
- Stickers and praise mark a moment; they do not become the reason for every action.
- No leaderboards, countdowns, lives, scarcity, streak loss, or parent-controlled reward economy.
- Let the learner choose or place a sticker. Choice makes the reward part of authorship.
- Celebrate care, curiosity, and trying another strategy, not speed or flawless motor control.

The current permanent rewards and resting streak are good foundations.

## First-glance implications for this repository

The current 390 px first-run evidence is legible and accessible, but the opening task is to read Danish
explanation about how help works. The following home screen presents continuation, a large specimen,
streak, rewards, lessons, and progress. An adult can understand this course model; a child has not yet
been given a reason to care about it.

The most important changes are therefore sequencing changes:

- Replace “course introduction” with “guided creation” as the child entry.
- Move IPA and methodology to an optional help layer or grown-up notebook.
- Replace “39 signs remaining” with one near goal and a collection that grows.
- Surface the learner's identity before full alphabet completion without testing untaught letters.
- Preserve the full orientation as a reference and weave its concepts into playable moments.
- Make lesson browsing secondary on the child home, while leaving it open in the adult journey.

## Evidence limits

- The daughter's age, preferences, literacy level, and device context are not yet recorded.
- One daughter's response is decisive for the personal goal but cannot establish general efficacy.
- Product documentation is not independent evidence of learning outcomes.
- Handwriting research supports graphomotor practice, not a specific touchscreen implementation.
- Persian heritage studies support identity-centered design but do not prescribe one interface.
- The saved browser screenshots provide reliable layout evidence, not observed emotional response.

## Sources

- [The Duolingo Method](https://blog.duolingo.com/duolingo-teaching-method/)
- [Duolingo ABC: balancing joyful design and literacy instruction](https://blog.duolingo.com/a-good-read-building-duolingo-abc-for-android/)
- [Khan Academy Kids](https://www.khanacademy.org/kids)
- [Drops learning approach](https://languagedrops.com/welcome)
- [Write It! Arabic product listing](https://apps.apple.com/us/app/write-it-arabic/id1400942827)
- [Duolingo Japanese character practice](https://blog.duolingo.com/learning-to-read-japanese-characters/)
- [Duolingo reading and writing-system approach](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-reading-skills/)
- [Pathways to student motivation: meta-analysis](https://pmc.ncbi.nlm.nih.gov/articles/PMC8935530/)
- [Gamification and intrinsic motivation: meta-analysis](https://link.springer.com/article/10.1007/s11423-023-10337-7)
- [Handwriting and typing in children's letter and word learning](https://www.uv.es/mperea/HandwritingJECP.pdf)
- [Retrieval practice in elementary-school children](https://pubmed.ncbi.nlm.nih.gov/27014156/)
- [Identity-centered Persian heritage-language learning](https://doi.org/10.1007/978-981-97-1818-4_9-1)
- [Farsi family participation, support, and child autonomy](https://link.springer.com/article/10.1007/s10643-026-02291-9)
