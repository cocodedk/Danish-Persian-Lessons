import { Link } from 'react-router-dom'
import './PuzzleBreakLink.css'

/**
 * The one-line invitation under a letter or word group (plan 011): a puzzle
 * break is always open, replayable, and never in the way.
 */
export function PuzzleBreakLink({ puzzleId, done }: { puzzleId: string; done: boolean }) {
  return (
    <Link className="puzzle-break" to={`/puslespil/${puzzleId}`}>
      Lille puslespil · {done ? 'klaret — spil igen' : '2–4 tryk'}
    </Link>
  )
}
