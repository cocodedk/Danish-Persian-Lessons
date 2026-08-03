import { StickerStamp } from './StickerStamp'
import { levelLine } from '../rewards/copy'
import type { Sticker } from '../rewards/types'
import './RewardShelf.css'

export interface RewardShelfProps {
  level: number
  stickers: Sticker[]
}

/** The most recent stamps; the shelf stays a shelf, not a wall. */
const SHOWN = 6

/**
 * «آفرین‌نامه» — the stickers the learner has collected and the notebook page
 * they are on. Nothing here can ever go down, so the shelf only ever fills up.
 * Before the first sticker there is nothing to show and nothing is shown.
 */
export function RewardShelf({ level, stickers }: RewardShelfProps) {
  if (stickers.length === 0) return null

  const shown = stickers.slice(-SHOWN)
  const line = levelLine(level)

  return (
    <section className="reward-shelf" aria-label="Dine klistermærker">
      <p className="reward-shelf__line">
        <span className="reward-shelf__fa" lang="fa" dir="rtl">
          {line.fa}
        </span>
        <span className="reward-shelf__da" lang="da">
          {line.da} Du har {stickers.length} klistermærker.
        </span>
      </p>
      <p className="reward-shelf__stamps">
        {shown.map((sticker) => (
          <StickerStamp key={sticker.id} kind={sticker.kind} />
        ))}
      </p>
    </section>
  )
}
