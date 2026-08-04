import { Link } from 'react-router-dom'
import { vocabUnits } from '../lessons/vocab'
import { typedCount, getTypeProgress, NAME_SCOPE } from '../progress/typing'
import { canType } from '../keyboard/layout'
import './TypingRounds.css'

export interface TypingRoundsProps {
  /** The learner's Persian spelling, when there is one. */
  faSpelling?: string
}

/**
 * The writing rounds on the forside: one per word unit, and — for a learner
 * who has a Persian spelling the keyboard can write — the capstone last.
 * Nothing here is locked and nothing has to come first; the rounds are an
 * offer, like every other list in this app.
 */
export function TypingRounds({ faSpelling }: TypingRoundsProps) {
  return (
    <>
      <h2 className="typing-rounds__title" lang="da">
        Skriv på tastaturet
      </h2>
      <ul className="typing-rounds">
        {vocabUnits.map((unit) => (
          <li key={unit.id}>
            <Link className="typing-rounds__link" to={`/lesson/ord/${unit.id}/skriv`}>
              <span>Skriv ordene — {unit.title}</span>
              <span className="typing-rounds__progress">
                {typedCount(
                  unit.id,
                  unit.words.map((word) => word.id),
                )}{' '}
                af {unit.words.length} skrevet
              </span>
            </Link>
          </li>
        ))}
        {/* Dormant without a name, and without a nag: a learner who never gave
            one, or whose spelling needs a sign this keyboard has not got, sees
            no entry point and is told nothing about it. */}
        {faSpelling && canType(faSpelling) && (
          <li>
            <Link className="typing-rounds__link" to="/lesson/navn/skriv">
              <span>Tast dit navn</span>
              <span className="typing-rounds__progress">
                {getTypeProgress(NAME_SCOPE).paid ? 'Klaret' : 'Klar, når du er'}
              </span>
            </Link>
          </li>
        )}
      </ul>
    </>
  )
}
