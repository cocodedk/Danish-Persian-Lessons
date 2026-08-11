import { useMemo, useState } from 'react'
import { AudioControl } from '../components/AudioControl'
import { BarLink, LessonSheet } from '../components/LessonSheet'
import { PersianText } from '../components/PersianText'
import { PronLine } from '../components/PronLine'
import { audioReviewRows } from '../audio/review'
import { findPronunciationAudio } from '../audio/manifest'
import './AudioReviewPage.css'

type Mark = 'good' | 'wrong'
type Filter = 'all' | 'open' | Mark

interface Answer {
  mark?: Mark
  note: string
}

interface ReviewState {
  reviewer: string
  answers: Record<string, Answer>
}

const STORAGE_KEY = 'dpl.audio-review.v1'

const domainNames: Record<string, string> = {
  bridges: 'Ordbroer',
  conversation: 'Samtaler',
  numbers: 'Tal',
  vocabulary: 'Ord og sætninger',
}

function readReview(): ReviewState {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as Partial<ReviewState>
    return {
      reviewer: typeof raw.reviewer === 'string' ? raw.reviewer : '',
      answers: raw.answers && typeof raw.answers === 'object'
        ? raw.answers as Record<string, Answer>
        : {},
    }
  } catch {
    return { reviewer: '', answers: {} }
  }
}

function keepReview(next: ReviewState): ReviewState {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // The page still works when private storage is blocked.
  }
  return next
}

export default function AudioReviewPage() {
  const [review, setReview] = useState(readReview)
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState('')
  const good = audioReviewRows.filter((row) => review.answers[row.clipId]?.mark === 'good').length
  const wrong = audioReviewRows.filter((row) => review.answers[row.clipId]?.mark === 'wrong').length
  const allReleased = audioReviewRows.every((row) => {
    const audio = findPronunciationAudio(row.clipId)
    return audio?.source === 'piper' && audio.sourceTextHash === row.sourceTextHash
  })

  const visibleRows = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase('da')
    return audioReviewRows.filter((row) => {
      const mark = review.answers[row.clipId]?.mark
      const matchesFilter = filter === 'all'
        || (filter === 'open' ? !mark : mark === filter)
      const matchesText = !needle || [
        row.transcript,
        row.danishMeaning,
        row.soundDa,
        row.clipId,
      ].some((value) => value.toLocaleLowerCase('da').includes(needle))
      return matchesFilter && matchesText
    })
  }, [filter, query, review.answers])

  function setReviewer(reviewer: string) {
    setReview((current) => keepReview({ ...current, reviewer }))
  }

  function setAnswer(clipId: string, patch: Partial<Answer>) {
    setReview((current) => {
      const answer = current.answers[clipId] ?? { note: '' }
      return keepReview({
        ...current,
        answers: {
          ...current.answers,
          [clipId]: { ...answer, ...patch },
        },
      })
    })
  }

  async function sendAnswers() {
    const reviewer = review.reviewer.trim()
    const checked = audioReviewRows.filter((row) => review.answers[row.clipId]?.mark)
    if (!reviewer) {
      setMessage('Skriv dit navn først.')
      return
    }
    if (!checked.length) {
      setMessage('Tjek mindst én lyd først.')
      return
    }

    const payload = {
      schemaVersion: 1,
      decisions: checked.map((row) => {
        const answer = review.answers[row.clipId]
        return {
          clipId: row.clipId,
          approved: answer.mark === 'good',
          note: answer.note.trim(),
          reviewer,
        }
      }),
    }
    const file = new File(
      [JSON.stringify(payload, null, 2)],
      'audio-decisions.json',
      { type: 'application/json' },
    )

    try {
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: 'Svar om persisk lyd', files: [file] })
        setMessage('Svarene er sendt.')
        return
      }
      const url = URL.createObjectURL(file)
      const link = document.createElement('a')
      link.href = url
      link.download = file.name
      link.click()
      window.setTimeout(() => URL.revokeObjectURL(url), 1_000)
      setMessage('Svarene er hentet.')
    } catch {
      setMessage('Svarene blev ikke sendt. Prøv igen.')
    }
  }

  return (
    <LessonSheet
      className="lesson--audio-review"
      title="Tjek persisk lyd"
      bar={(
        <>
          <BarLink to="/">Til forsiden</BarLink>
          <BarLink to="/lydovelse">Lydøvelse</BarLink>
        </>
      )}
    >
      {allReleased ? (
        <section className="audio-review__ready" aria-label="Lydtjek er færdigt">
          <strong>Lydtjek er færdigt</strong>
          <p>Alle {audioReviewRows.length} lyde er godkendt og er nu med i lektionerne.</p>
        </section>
      ) : (
        <section className="audio-review__warning" aria-label="Vigtig besked">
          <strong>Ikke klar til elever</strong>
          <p>Disse lyde er lavet af en maskine. De skal tjekkes af en persisk taler.</p>
        </section>
      )}

      <section className="audio-review__guide" aria-labelledby="audio-review-guide">
        <h2 id="audio-review-guide">Sådan gør du</h2>
        <ol>
          <li>Tryk på Hør.</li>
          <li>Vælg God eller Fejl.</li>
          <li>Skriv en kort note ved en fejl.</li>
          <li>Tryk på Send svar.</li>
        </ol>
        <label>
          Dit navn
          <input
            type="text"
            value={review.reviewer}
            autoComplete="name"
            onChange={(event) => setReviewer(event.target.value)}
          />
        </label>
        <p><strong>{good}</strong> gode · <strong>{wrong}</strong> med fejl · {audioReviewRows.length - good - wrong} mangler</p>
        <button type="button" className="audio-review__send" onClick={sendAnswers}>
          Send svar
        </button>
        {message && <p role="status">{message}</p>}
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
            <option value="open">Ikke tjekket</option>
            <option value="good">Gode</option>
            <option value="wrong">Med fejl</option>
          </select>
        </label>
        <p>{visibleRows.length} lyde vises</p>
      </section>

      <div className="audio-review__list">
        {visibleRows.map((row, index) => {
          const answer = review.answers[row.clipId]
          return (
            <article className="audio-review__card" key={row.clipId} id={row.clipId}>
              <p className="audio-review__number">{index + 1} · {domainNames[row.domain] ?? row.domain}</p>
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
              <AudioControl source={{ file: row.file, transcript: row.transcript }} />
              <div className="audio-review__marks" aria-label={`Svar for ${row.transcript}`}>
                <button
                  type="button"
                  className="audio-review__good"
                  aria-pressed={answer?.mark === 'good'}
                  onClick={() => setAnswer(row.clipId, { mark: 'good' })}
                >
                  God
                </button>
                <button
                  type="button"
                  className="audio-review__wrong"
                  aria-pressed={answer?.mark === 'wrong'}
                  onClick={() => setAnswer(row.clipId, { mark: 'wrong' })}
                >
                  Fejl
                </button>
              </div>
              {answer?.mark === 'wrong' && (
                <label>
                  Kort note
                  <input
                    type="text"
                    value={answer.note}
                    onChange={(event) => setAnswer(row.clipId, { note: event.target.value })}
                  />
                </label>
              )}
              <code>{row.clipId}</code>
            </article>
          )
        })}
      </div>
    </LessonSheet>
  )
}
