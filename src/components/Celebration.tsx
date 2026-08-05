import { NAME_PRAISE_ENTRY, PRAISE, WELCOME_BACK } from '../rewards/copy'
import { ProgressTick } from './ProgressTick'
import { StickerStamp } from './StickerStamp'
import { InkConfetti } from './InkConfetti'
import { PronLine } from './PronLine'
import type { Reward } from '../rewards/types'
import './Celebration.css'
import { PersianText } from './PersianText'
import { PersonalNameText, type PersonalName } from './PersonalName'

export interface CelebrationProps {
  /** What the engine just granted. Null only where no engine is wired in. */
  reward: Reward | null
  /** What the red tick says out loud. */
  tickLabel?: string
  personalName?: PersonalName
}

/**
 * What a completion looks like: the teacher's red tick, a warm line in both
 * languages, whatever stickers just landed, and — when there is something to
 * celebrate — a flick of ink across the paper. Never a score, never a streak
 * warning, never a countdown.
 */
export function Celebration({ reward, tickLabel = 'Rigtigt', personalName }: CelebrationProps) {
  const praise = reward?.praise ?? PRAISE[0]
  const shownPraise = personalName ? NAME_PRAISE_ENTRY : praise
  const stickers = reward?.stickers ?? []
  const loud = stickers.length > 0 || (reward?.levelUp ?? null) !== null

  return (
    <div className="celebration">
      {loud && <InkConfetti />}

      <div className="celebration__praise">
        <ProgressTick granted label={tickLabel} />
        <PersianText entry={shownPraise} className="celebration__fa" />
        {personalName && (
          // RTL base so the «!» closes the name on its left, where a Persian
          // sentence ends — same rule as SplitCard's greeting pane.
          <span dir="rtl">
            <PersonalNameText spelling={personalName.spelling} />!
          </span>
        )}
        <PronLine {...shownPraise.pron} />
        <span className="celebration__da" lang="da">
          {personalName?.original
            ? `${shownPraise.da}, ${personalName.original}!`
            : shownPraise.da}
        </span>
      </div>

      {reward?.wokeUp && (
        <div className="celebration__welcome">
          <PersianText entry={WELCOME_BACK} className="celebration__fa" />
          <PronLine {...WELCOME_BACK.pron} />
          <span lang="da">
            {WELCOME_BACK.da} Stimen er vågen igen, nu {reward.streak.value} dage.
          </span>
        </div>
      )}

      {stickers.length > 0 && (
        <div className="celebration__stickers">
          {stickers.map((sticker) => (
            <StickerStamp key={sticker.id} kind={sticker.kind} />
          ))}
        </div>
      )}
    </div>
  )
}
