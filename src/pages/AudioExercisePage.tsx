import { useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { findPronunciationAudio } from '../audio/manifest'
import { audioReviewRows } from '../audio/review'
import { AudioControl } from '../components/AudioControl'
import { BarLink, LessonSheet } from '../components/LessonSheet'
import { PersianText } from '../components/PersianText'
import { PronLine } from '../components/PronLine'
import { talkAudioReady } from '../speaking/lessons'
import './AudioReviewPage.css'
import './AudioExercisePage.css'

type Filter = 'all' | 'open' | 'done'

interface ExerciseState {
  heard: string[]
  done: string[]
}

const STORAGE_KEY = 'dpl.audio-exercise.v1'

const domainNames: Record<string, string> = {
  bridges: 'Ordbroer',
  conversation: 'Samtaler',
  numbers: 'Tal',
  vocabulary: 'Ord og sætninger',
}

const audioExerciseRows = audioReviewRows.flatMap((row) => {
  const audio = findPronunciationAudio(row.clipId)
  return audio?.source === 'piper' && audio.sourceTextHash === row.sourceTextHash
    ? [{ ...row, file: audio.file }]
    : []
})

function readExercise(): ExerciseState {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as Partial<ExerciseState>
    return {
      heard: Array.isArray(raw.heard) ? raw.heard : [],
      done: Array.isArray(raw.done) ? raw.done : [],
    }
  } catch {
    return { heard: [], done: [] }
  }
}

function keepExercise(next: ExerciseState): ExerciseState {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // The exercise still works when private storage is blocked.
  }
  return next
}

export default function AudioExercisePage() {
  const [exercise, setExercise] = useState(readExercise)
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const done = useMemo(() => new Set(exercise.done), [exercise.done])
  const heardCount = audioExerciseRows.filter((row) => exercise.heard.includes(row.clipId)).length
  const doneCount = audioExerciseRows.filter((row) => done.has(row.clipId)).length

  const visibleRows = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase('da')
    return audioExerciseRows.filter((row) => {
      const isDone = done.has(row.clipId)
      const matchesFilter = filter === 'all'
        || (filter === 'done' ? isDone : !isDone)
      const matchesText = !needle || [
        row.transcript,
        row.danishMeaning,
        row.soundDa,
      ].some((value) => value.toLocaleLowerCase('da').includes(needle))
      return matchesFilter && matchesText
    })
  }, [done, filter, query])

  if (!talkAudioReady()) return <Navigate to="/opdag" replace />

  function markHeard(clipId: string) {
    setExercise((current) => current.heard.includes(clipId)
      ? current
      : keepExercise({ ...current, heard: [...current.heard, clipId] }))
  }

  function toggleDone(clipId: string) {
    setExercise((current) => keepExercise({
      ...current,
      done: current.done.includes(clipId)
        ? current.done.filter((id) => id !== clipId)
        : [...current.done, clipId],
    }))
  }

  return (
    <LessonSheet
      className="lesson--audio-review lesson--audio-exercise"
      title="Øv persisk lyd"
      bar={<BarLink to="/tal">Til talelektioner</BarLink>}
    >
      <section className="audio-review__guide" aria-labelledby="audio-exercise-guide">
        <h2 id="audio-exercise-guide">Sådan gør du</h2>
        <ol>
          <li>Tryk på Hør.</li>
          <li>Sig ordet højt.</li>
          <li>Tryk på Jeg har sagt det.</li>
        </ol>
        <p><strong>{heardCount}</strong> hørt · <strong>{doneCount}</strong> sagt højt · {audioExerciseRows.length - doneCount} igen</p>
      </section>

      <section className="audio-review__tools" aria-label="Find lyd">
        <label>
          Find et ord
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <label>
          Vis
          <select value={filter} onChange={(event) => setFilter(event.target.value as Filter)}>
            <option value="all">Alle</option>
            <option value="open">Ikke øvet</option>
            <option value="done">Øvet</option>
          </select>
        </label>
        <p>{visibleRows.length} lyde vises</p>
      </section>

      <div className="audio-review__list">
        {visibleRows.map((row) => {
          const isDone = done.has(row.clipId)
          return (
            <article className="audio-review__card" key={row.clipId}>
              <p className="audio-review__number">{domainNames[row.domain] ?? row.domain}</p>
              <h2>
                <PersianText
                  entry={{
                    id: row.entryId,
                    kind: 'phrase',
                    fa: row.transcript,
                    da: row.danishMeaning,
                    pron: { da: row.soundDa, ipa: row.ipa },
                  }}
                />
              </h2>
              <p className="audio-review__meaning">{row.danishMeaning}</p>
              <PronLine da={row.soundDa} ipa={row.ipa} />
              <AudioControl
                source={{ file: row.file, transcript: row.transcript }}
                onPlay={() => markHeard(row.clipId)}
              />
              <button
                type="button"
                className="audio-exercise__done"
                aria-pressed={isDone}
                onClick={() => toggleDone(row.clipId)}
              >
                {isDone ? 'Sagt højt ✓' : 'Jeg har sagt det'}
              </button>
            </article>
          )
        })}
      </div>
    </LessonSheet>
  )
}
