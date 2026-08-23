import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LessonSheet, BarLink } from '../components/LessonSheet'
import { CompactPhraseRow } from '../components/EntryRenderers'
import { ProgressTick } from '../components/ProgressTick'
import { Button } from '../components/Button'
import { RewardOverlays } from '../components/RewardOverlays'
import type { PersianEntry } from '../catalog/types'
import type { RuleLessonDescriptor } from '../lessons/countingRuleTypes'
import {
  RULE_RECOGNITION_TITLES,
  RULE_BUILD_TITLE,
} from '../lessons/countingRuleExercises'
import { counting21to99Lesson } from '../lessons/counting21to99'
import { counting21to99Progress } from '../progress/countingRules'
import type { CountingRuleStore } from '../progress/countingRules'
import { useCelebration } from '../rewards/useCelebration'
import './alphabet.css'
import './vocab.css'

/**
 * One rule lesson's page, for any of the three (plan 017, fixpoint A item 3):
 * the rule in plain Danish, the joining element, the base forms it needs, the
 * worked examples, and the rounds. Everything on it comes from the descriptor
 * it is given, so 100-900 and tusinder need no second screen.
 *
 * CANDIDATE CONTENT. Every Persian form, IPA transcription and dansk
 * lydskrift a descriptor brings here is a candidate draft awaiting human
 * review; the page says so out loud, and none of it is release-ready.
 *
 * Nothing is locked: the builds-on line is a link and a recommendation, never
 * a gate. Progress is deliberate — a row counts when the learner says it does,
 * and the referenced row from the previous lesson has no action here at all,
 * because its progress belongs to the lesson that teaches it.
 */
export interface CountingRuleScreenProps {
  lesson: RuleLessonDescriptor
  store: CountingRuleStore
}

const MARK_PREFIX = 'Jeg har gennemgået'

export function CountingRuleScreen({ lesson, store }: CountingRuleScreenProps) {
  const [cleared, setCleared] = useState(() => store.get().words)
  const celebration = useCelebration()

  const done = store.ids.filter((id) => cleared.includes(id)).length

  /** The learner says this row is done. A row this lesson does not own never
   *  gets here: it is rendered without an action. */
  function mark(entry: PersianEntry) {
    const kind = store.learn(entry.id)
    setCleared(store.get().words)
    if (kind) celebration.cheer(kind)
  }

  /** One teaching row: the form itself, and either its tick or its action.
   *  A referenced row says it belongs earlier instead of offering an action.
   *  It names no lesson: the row may come from any earlier stage, not
   *  necessarily the one this lesson builds on. */
  function row(entry: PersianEntry, key: string) {
    const owned = entry.id.startsWith(lesson.idPrefix)
    return (
      <li key={key}>
        <CompactPhraseRow entry={entry} marked />
        <span className="letter__done">
          {!owned ? (
            <span lang="da">Hører til en tidligere lektion — tælles der.</span>
          ) : cleared.includes(entry.id) ? (
            <>
              <ProgressTick granted label="Gennemgået" />
              <span lang="da">Gennemgået</span>
            </>
          ) : (
            <Button onClick={() => mark(entry)}>
              {`${MARK_PREFIX} ${entry.da}`}
            </Button>
          )}
        </span>
      </li>
    )
  }

  return (
    <LessonSheet title={lesson.title} bar={<BarLink to="/">Til forsiden</BarLink>}>
      <p className="alphabet__summary">
        <ProgressTick granted={done > 0} label="Gennemgået eller øvet" />
        <span lang="da">
          {done} af {store.ids.length} dele gennemgået eller øvet
        </span>
      </p>
      <p className="alphabet__lead" lang="da">{lesson.summary}</p>

      <p className="alphabet__note" lang="da">
        Sproget på denne side er et udkast. Alle persiske former, lydskrifter og
        IPA-linjer venter på en menneskelig gennemgang. Siden er kun til intern
        gennemgang før udgivelse.
      </p>

      <p className="alphabet__note" lang="da">
        Lektionen bygger videre på {lesson.buildsOn.labelDa}. Har du dem med dig,
        går det lettere — men intet er låst, og du er ikke gået forkert.{' '}
        <Link className="alphabet__link" to={lesson.buildsOn.path}>
          Til {lesson.buildsOn.labelDa}
        </Link>
      </p>

      <h2 className="alphabet__section-title">Reglen</h2>
      <p className="alphabet__lead" lang="da">{lesson.rule}</p>

      <h2 className="alphabet__section-title">Bindeleddet</h2>
      <ul className="alphabet__links">{row(lesson.joiner, lesson.joiner.id)}</ul>

      <h2 className="alphabet__section-title">Grundformerne</h2>
      <ul className="alphabet__links">
        {lesson.baseForms.map((base) => row(base.entry, `base-${base.value}`))}
      </ul>

      <h2 className="alphabet__section-title">Eksempler</h2>
      <ul className="alphabet__links">
        {lesson.examples.map((example) => row(example.entry, `ex-${example.value}`))}
      </ul>

      <h2 className="alphabet__section-title">Grænserne</h2>
      <ul className="alphabet__links">
        {lesson.boundaryNotes.map((note) => (
          <li key={note} lang="da">{note}</li>
        ))}
      </ul>

      <h2 className="alphabet__section-title">Øvelser</h2>
      <ul className="alphabet__links">
        {Object.entries(RULE_RECOGNITION_TITLES).map(([kind, title]) => (
          <li key={kind}>
            <Link className="alphabet__link" to={`${lesson.path}/ovelse/${kind}`}>
              {title}
            </Link>
          </li>
        ))}
        <li>
          <Link className="alphabet__link" to={`${lesson.path}/ovelse/byg`}>
            {RULE_BUILD_TITLE}
          </Link>
        </li>
      </ul>
      <p className="alphabet__note" lang="da">
        {lesson.targets.length} tal mere venter i »{RULE_BUILD_TITLE}«. Dem viser
        lektionen ikke her — du bygger dem selv af reglen.
      </p>

      <RewardOverlays celebration={celebration} />
    </LessonSheet>
  )
}

/** Lesson 2, "Regnereglen 21-99", on the descriptor and store it contracts. */
export default function Counting21to99Screen() {
  return <CountingRuleScreen lesson={counting21to99Lesson} store={counting21to99Progress} />
}
