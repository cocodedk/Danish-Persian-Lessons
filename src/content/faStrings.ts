// Single source of truth for Persian strings outside lesson data, so the
// Persian text-rule guard (src/lessons/textRules.test.ts) has one place to
// walk. See docs/plans/001-scaffold-app.md, Critic round 1, item 7.
import { FA_GREETING } from './greetings'
import { ORIENTATION_FA_STRINGS } from './orientation'
import { LATER_MARK_FA_STRINGS } from '../lessons/vowelMarks'
import { REWARD_FA_STRINGS } from '../rewards/copy'

export const CAPTURE_PROMPT = 'نام تو چیست؟'
export const LESSON_PLACEHOLDER_TEXT = 'این درس هنوز آماده نیست.'

/** A wrong answer costs nothing and says so — ART-DIRECTION "Celebration". */
export const TRY_AGAIN_FA = 'دوباره'
export const WELL_DONE_FA = 'آفرین'

/** The margin badge on a letter the learner's own name is spelled with (plan 006). */
export const NAME_LETTER_FA = 'این حرف در نامِ توست'

/** Every Persian UI string outside lesson data — walked by the text-rule guard. */
export const PERSIAN_UI_STRINGS: string[] = [
  CAPTURE_PROMPT,
  LESSON_PLACEHOLDER_TEXT,
  FA_GREETING,
  TRY_AGAIN_FA,
  WELL_DONE_FA,
  NAME_LETTER_FA,
  ...ORIENTATION_FA_STRINGS,
  ...LATER_MARK_FA_STRINGS,
  ...REWARD_FA_STRINGS,
]
