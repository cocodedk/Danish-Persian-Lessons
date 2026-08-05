import { STICKER_LABELS } from '../rewards/copy'
import type { StickerKind } from '../rewards/types'
import './StickerStamp.css'
import { PronLine } from './PronLine'

/** The آفرین rubber stamp: a red frame, struck slightly off-square. */
function Afarin() {
  return (
    <svg viewBox="0 0 120 76" aria-hidden="true" focusable="false">
      <rect className="sticker-stamp__frame" x="4" y="4" width="112" height="68" rx="7" />
      <text className="sticker-stamp__fa" x="60" y="50" xmlLang="fa" direction="rtl">
        {STICKER_LABELS.afarin.fa}
      </text>
    </svg>
  )
}

/** ۲۰ out of ۲۰ — the mark, ringed the way a teacher rings it. */
function Bist() {
  return (
    <svg viewBox="0 0 120 76" aria-hidden="true" focusable="false">
      <ellipse className="sticker-stamp__ring" cx="60" cy="38" rx="38" ry="30" />
      <text className="sticker-stamp__fa sticker-stamp__fa--big" x="60" y="52" xmlLang="fa">
        {STICKER_LABELS.bist.fa}
      </text>
    </svg>
  )
}

/** ستارهٔ طلایی — the gold star, outlined in ink so it reads on both papers. */
function Star() {
  return (
    <svg viewBox="0 0 120 76" aria-hidden="true" focusable="false">
      <path
        className="sticker-stamp__star"
        d="M60 8 L70.6 30.4 L95 34 L77.5 51.6 L81.6 76 L60 64.5 L38.4 76 L42.5 51.6 L25 34 L49.4 30.4 Z"
      />
    </svg>
  )
}

const FACES: Record<StickerKind, () => React.ReactElement> = {
  afarin: Afarin,
  bist: Bist,
  star: Star,
}

export interface StickerStampProps {
  kind: StickerKind
}

/**
 * A sticker, stamped onto the page. It thunks in once and then simply stays;
 * under prefers-reduced-motion it is there from the first frame — the reward
 * is never withheld, only ever un-animated (ART-DIRECTION "Motion").
 */
export function StickerStamp({ kind }: StickerStampProps) {
  const Face = FACES[kind]
  const entry = STICKER_LABELS[kind]
  return (
    <div className="sticker-stamp-wrap">
      <span className={`sticker-stamp sticker-stamp--${kind}`} role="img" aria-label={entry.da}>
        <Face />
      </span>
      <div className="sticker-stamp__help">
        <PronLine {...entry.pron} />
        <span>{entry.da}</span>
      </div>
    </div>
  )
}
