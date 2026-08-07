// Every word the reward engine says, in both languages, in one place — so the
// Persian text-rule guard can walk it and a critic can read the whole tone at
// once. Nothing here blames, nags, or announces a loss.
import type { Praise, StickerKind, StreakState } from './types'
import { defineEntry } from '../catalog/types'

/**
 * Iranian school praise, varied the way a teacher varies it. The engine walks
 * this list by progress count, so it never repeats itself twice in a row and
 * never needs a random number. Pron is dansk lydskrift + IPA, dictated verbatim
 * by docs/plans/009-praise-pronunciation.md — never improvised in the UI.
 */
export const PRAISE: Praise[] = [
  defineEntry({ id: 'rewards-praise-afarin', kind: 'word', fa: 'آفرین', da: 'Flot!', pron: { da: 'åfarin', ipa: 'ɒːfæɾin' } }),
  defineEntry({ id: 'rewards-praise-ali', kind: 'word', fa: 'عالی', da: 'Super!', pron: { da: 'åli', ipa: 'ɒːli' } }),
  defineEntry({ id: 'rewards-praise-che-khub', kind: 'phrase', fa: 'چه خوب', da: 'Hvor fint!', pron: { da: 'tje khub', ipa: 'tʃe xub' } }),
  defineEntry({ id: 'rewards-praise-kheyli-khub', kind: 'phrase', fa: 'خیلی خوب', da: 'Rigtig godt!', pron: { da: 'khejli khub', ipa: 'xejli xub' } }),
  defineEntry({ id: 'rewards-praise-khub-bud', kind: 'phrase', fa: 'خوب بود', da: 'Det var godt!', pron: { da: 'khub bud', ipa: 'xub buːd' } }),
  defineEntry({ id: 'rewards-praise-dorost-bud', kind: 'phrase', fa: 'درست بود', da: 'Det var rigtigt!', pron: { da: 'dorost bud', ipa: 'doɾost buːd' } }),
]

/** Static phrase segment used before a separately rendered learner name. */
export const NAME_PRAISE_ENTRY = defineEntry({ id: 'rewards-name-praise', kind: 'word', fa: 'آفرین،', da: 'Flot', pron: { da: 'åfarin', ipa: 'ɒːfæɾin' } })

/** The three stamps a teacher owns: the آفرین stamp, the ۲۰ mark, the gold star. */
export const STICKER_LABELS: Record<StickerKind, Praise> = {
  afarin: defineEntry({ id: 'rewards-sticker-afarin', kind: 'word', fa: 'آفرین', da: 'Flot!', pron: { da: 'åfarin', ipa: 'ɒːfæɾin' } }),
  bist: defineEntry({ id: 'rewards-sticker-bist', kind: 'symbol', fa: '۲۰', da: 'Tyve', pron: { da: 'bist', ipa: 'biːst' } }),
  star: defineEntry({ id: 'rewards-sticker-star', kind: 'phrase', fa: 'ستارهٔ طلایی', da: 'Guldstjerne', pron: { da: 'setåreje talåji', ipa: 'setɒːɾeje tælɒːjiː' } }),
}

/** A bonus exercise is a present, and says so. */
export const GIFT_ENTRY = defineEntry({ id: 'rewards-gift', kind: 'phrase', fa: 'یک تمرین جایزه!', da: 'En bonusøvelse!', pron: { da: 'jek tamrine djåjeze', ipa: 'jek tæmɾiːne dʒɒːjeze' } })

/** Shown when a resting streak wakes up — the welcome, never a scolding. */
export const WELCOME_BACK: Praise = defineEntry({
  id: 'rewards-welcome-back',
  kind: 'phrase',
  fa: 'دوباره سلام!',
  da: 'Hej igen!',
  pron: { da: 'dobåre salåm', ipa: 'dobɒːɾe sælɒːm' },
})

const PAGE_FILLED = defineEntry({ id: 'rewards-page-filled', kind: 'phrase', fa: 'صفحه پر شد!', da: 'Siden er fuld!', pron: { da: 'safhe por sjod', ipa: 'sæfhe poɾ ʃod' } })
const CURRENT_PAGE = defineEntry({ id: 'rewards-current-page', kind: 'phrase', fa: 'صفحهٔ تازه', da: 'En ny side', pron: { da: 'safheje tåze', ipa: 'sæfheje tɒːze' } })
const STREAK_RESTING = defineEntry({ id: 'rewards-streak-resting', kind: 'phrase', fa: 'تمرین هنوز ادامه دارد', da: 'Træningen fortsætter stadig', pron: { da: 'tamrin hanuz edåme dårad', ipa: 'tæmɾiːn hænuːz ʔedɒːme dɒːɾæd' } })
const STREAK_TODAY = defineEntry({ id: 'rewards-streak-today', kind: 'phrase', fa: 'امروز تمرین کردی', da: 'Du har øvet i dag', pron: { da: 'emruz tamrin kardi', ipa: 'ʔemɾuːz tæmɾiːn kæɾdiː' } })
const STREAK_AWAKE = defineEntry({ id: 'rewards-streak-awake', kind: 'phrase', fa: 'تمرین ادامه دارد', da: 'Træningen fortsætter', pron: { da: 'tamrin edåme dårad', ipa: 'tæmɾiːn ʔedɒːme dɒːɾæd' } })

/** Words this app must never say about progress. Asserted in streak.test.ts. */
export const GUILT_WORDS = [
  'mistet',
  'tabt',
  'nulstil',
  'forfra',
  'desværre',
  'ærgerligt',
  'brudt',
  'از دست',
  'صفر',
  'متأسفانه',
]

/** Both sides say only that the page is full; neither adds a hidden counter. */
export function filledPageLine(): Praise {
  return PAGE_FILLED
}

/** Both sides name the fresh notebook page with no Danish-only level detail. */
export function currentPageLine(): Praise {
  return CURRENT_PAGE
}

/**
 * The home line. Three moods, none of them a reproach: the learner practised
 * today, the streak is awake and waiting, or the streak is having a rest.
 */
export function streakLine(streak: StreakState): Praise {
  if (streak.resting) return STREAK_RESTING
  if (streak.today) return STREAK_TODAY
  return STREAK_AWAKE
}

export const REWARD_ENTRIES = [
  ...PRAISE,
  NAME_PRAISE_ENTRY,
  ...Object.values(STICKER_LABELS),
  GIFT_ENTRY,
  WELCOME_BACK,
  PAGE_FILLED,
  CURRENT_PAGE,
  STREAK_RESTING,
  STREAK_TODAY,
  STREAK_AWAKE,
]
