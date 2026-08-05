// Single source of truth for Persian strings outside lesson data, so the
// Persian text-rule guard (src/lessons/textRules.test.ts) has one place to
// walk. See docs/plans/001-scaffold-app.md, Critic round 1, item 7.
import { FA_GREETING, faGreeting } from './greetings'
import { ORIENTATION_FA_STRINGS } from './orientation'
import { LATER_MARK_FA_STRINGS } from '../lessons/vowelMarks'
import { REWARD_FA_STRINGS } from '../rewards/copy'
import { NAME_FA_STRINGS } from '../name/copy'

export const CAPTURE_PROMPT = 'نام تو چیست؟'
export const LESSON_PLACEHOLDER_TEXT = 'این درس هنوز آماده نیست.'

/** A wrong answer costs nothing and says so — ART-DIRECTION "Celebration". */
export const TRY_AGAIN_FA = 'دوباره'
export const WELL_DONE_FA = 'آفرین'

/** The نیم‌فاصله's own name — on its key cap and in the marking, single-sourced
 * (plan 005, critic round 1). */
export const ZWNJ_NAME_FA = 'نیم‌فاصله'

/**
 * The typing marking, said honestly when the divergent cell is a space or a
 * نیم‌فاصله rather than a letter — "et andet bogstav" is simply wrong for a
 * sign with no letterform (src/components/TypeMarks.tsx).
 */
export const TYPE_MISSING_SPACE_FA = 'اینجا یک فاصله جا افتاده.'
export const TYPE_EXTRA_SPACE_FA = 'اینجا یک فاصله اضافه نوشته شده.'
export const TYPE_MISSING_ZWNJ_FA = 'اینجا یک نیم‌فاصله جا افتاده.'
export const TYPE_EXTRA_ZWNJ_FA = 'اینجا یک نیم‌فاصله اضافه نوشته شده.'
export const TYPE_MISSING_ZWNJ_DA = `Her mangler et halv-mellemrum (${ZWNJ_NAME_FA}).`
export const TYPE_EXTRA_ZWNJ_DA = `Her står et halv-mellemrum (${ZWNJ_NAME_FA}) for meget.`

/** The two typing rounds (plan 005): the unit's words, and the capstone. */
export const TYPE_WORDS_FA = 'کلمه‌ها را بنویس'
export const TYPE_NAME_FA = 'نامِ خودت را بنویس'

/** The margin badge on a letter the learner's own name is spelled with (plan 006). */
export const NAME_LETTER_FA = 'این حرف در نامِ توست'

/** The same warm note on a whole word (plan 004) — one shared letter, or several. */
export const NAME_LETTER_IN_WORD_FA = 'حرفی از نامِ تو در این کلمه هست'
export const NAME_LETTERS_IN_WORD_FA = 'حرف‌هایی از نامِ تو در این کلمه هست'

/** Every Persian UI string outside lesson data — walked by the text-rule guard. */
export const PERSIAN_UI_STRINGS: string[] = [
  CAPTURE_PROMPT,
  LESSON_PLACEHOLDER_TEXT,
  FA_GREETING,
  faGreeting('سارا'),
  TRY_AGAIN_FA,
  WELL_DONE_FA,
  TYPE_WORDS_FA,
  TYPE_NAME_FA,
  ZWNJ_NAME_FA,
  TYPE_MISSING_SPACE_FA,
  TYPE_EXTRA_SPACE_FA,
  TYPE_MISSING_ZWNJ_FA,
  TYPE_EXTRA_ZWNJ_FA,
  TYPE_MISSING_ZWNJ_DA,
  TYPE_EXTRA_ZWNJ_DA,
  NAME_LETTER_FA,
  NAME_LETTER_IN_WORD_FA,
  NAME_LETTERS_IN_WORD_FA,
  ...ORIENTATION_FA_STRINGS,
  ...LATER_MARK_FA_STRINGS,
  ...REWARD_FA_STRINGS,
  ...NAME_FA_STRINGS,
]
