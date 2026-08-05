import { Link } from 'react-router-dom'
import type { Gift } from '../rewards/types'
import './GiftCard.css'
import { CompactPhraseRow } from './EntryRenderers'

export interface GiftCardProps {
  gift: Gift
  /** Closes the card. Nothing is deducted, nothing is remembered against you. */
  onSkip: () => void
}

/**
 * A bonus exercise, handed over as a present. Opening it is a treat and
 * skipping it costs exactly nothing — the card says so, and the engine backs
 * it up: no reward the learner already earned depends on this.
 */
export function GiftCard({ gift, onSkip }: GiftCardProps) {
  return (
    <div className="gift-card">
      <CompactPhraseRow entry={gift.entry} />
      <p className="gift-card__da" lang="da">
        Tre hurtige spørgsmål, hvis du har lyst.
      </p>
      <div className="gift-card__actions">
        <Link className="gift-card__open" to={`/lesson/alphabet/gave/${gift.ordinal}`}>
          Åbn gaven
        </Link>
        <button type="button" className="gift-card__skip" onClick={onSkip}>
          Gem den til senere
        </button>
      </div>
    </div>
  )
}
