// Single source of truth for Persian UI chrome strings (not lesson data),
// so the Persian text-rule guard (src/lessons/textRules.test.ts) has one
// place to walk. See docs/plans/001-scaffold-app.md, Critic round 1, item 7.
import { FA_GREETING } from './greetings'

export const CAPTURE_PROMPT = 'نام تو چیست؟'
export const LESSON_PLACEHOLDER_TEXT = 'این درس هنوز آماده نیست.'

/** Every Persian UI string outside lesson data — walked by the text-rule guard. */
export const PERSIAN_UI_STRINGS: string[] = [CAPTURE_PROMPT, LESSON_PLACEHOLDER_TEXT, FA_GREETING]
