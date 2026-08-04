import { KEYBOARD_KEYS, type KeyDef } from '../keyboard/layout'
import './PersianKeyboard.css'

export interface PersianKeyboardProps {
  onPress: (key: KeyDef) => void
  /** What this keyboard writes into, in one Danish line — the group's name. */
  label: string
}

/**
 * The cap. A letter shows its isolated glyph in ink; the three sign keys are
 * drawn with the pen instead of a glyph — one stroke is a space, two strokes
 * with a gap between them are the نیم‌فاصله, which is exactly what it looks
 * like on paper. Drawn rather than typed so no key depends on a symbol the
 * self-hosted fonts may not carry.
 */
function KeyCap({ shape }: { shape: KeyDef }) {
  if (shape.id === 'space') return <span className="keyboard__stroke" aria-hidden="true" />
  if (shape.id === 'zwnj') {
    return (
      <span className="keyboard__half" aria-hidden="true">
        <span />
        <span />
      </span>
    )
  }
  if (shape.id === 'backspace') {
    return (
      <span className="keyboard__erase" aria-hidden="true" dir="ltr">
        ⌫
      </span>
    )
  }
  return (
    <span lang="fa" dir="rtl" aria-hidden="true">
      {shape.glyph}
    </span>
  )
}

/**
 * The Persian keyboard: 33 letters, a space, a نیم‌فاصله and a backspace, laid
 * out right to left in the bottom thumb zone. There is no text input anywhere
 * near it — the buffer is a string in React state — so the phone's own keyboard
 * never opens over the lesson (docs/plans/005-persian-keyboard.md, box 1).
 */
export function PersianKeyboard({ onPress, label }: PersianKeyboardProps) {
  return (
    <div className="keyboard" role="group" aria-label={label} dir="rtl">
      {KEYBOARD_KEYS.map((shape) => (
        <button
          key={shape.id}
          type="button"
          className={`keyboard__key ${shape.kind === 'letter' ? '' : 'keyboard__key--sign'}`}
          aria-label={shape.label}
          onClick={() => onPress(shape)}
        >
          <KeyCap shape={shape} />
        </button>
      ))}
    </div>
  )
}
