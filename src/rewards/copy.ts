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
  defineEntry({ id: 'rewards-praise-eyval', kind: 'word', fa: 'ایول', da: 'Sådan!', pron: { da: 'ejval', ipa: 'ejvæl' } }),
  defineEntry({ id: 'rewards-praise-che-khub', kind: 'phrase', fa: 'چه خوب', da: 'Godt gået!', pron: { da: 'tje khub', ipa: 'tʃe xub' } }),
  defineEntry({ id: 'rewards-praise-ali', kind: 'word', fa: 'عالی', da: 'Rigtig fint!', pron: { da: 'åli', ipa: 'ɒːli' } }),
  defineEntry({ id: 'rewards-praise-kheyli-khub', kind: 'phrase', fa: 'خیلی خوب', da: 'Dygtig!', pron: { da: 'khejli khub', ipa: 'xejli xub' } }),
  defineEntry({ id: 'rewards-praise-barikala', kind: 'word', fa: 'باریکلا', da: 'Sådan skal det være!', pron: { da: 'bårikalå', ipa: 'bɒːɾikælɒː' } }),
]

/** Static phrase segment used before a separately rendered learner name. */
export const NAME_PRAISE_ENTRY = defineEntry({ id: 'rewards-name-praise', kind: 'word', fa: 'آفرین،', da: 'Flot', pron: { da: 'åfarin', ipa: 'ɒːfæɾin' } })

/** The three stamps a teacher owns: the آفرین stamp, the ۲۰ mark, the gold star. */
export const STICKER_LABELS: Record<StickerKind, Praise> = {
  afarin: defineEntry({ id: 'rewards-sticker-afarin', kind: 'word', fa: 'آفرین', da: 'Klistermærke: flot klaret', pron: { da: 'åfarin', ipa: 'ɒːfæɾin' } }),
  bist: defineEntry({ id: 'rewards-sticker-bist', kind: 'symbol', fa: '۲۰', da: 'Klistermærke: tyve ud af tyve', pron: { da: 'bist', ipa: 'biːst' } }),
  star: defineEntry({ id: 'rewards-sticker-star', kind: 'phrase', fa: 'ستارهٔ طلایی', da: 'Klistermærke: guldstjerne', pron: { da: 'setåreje talåji', ipa: 'setɒːɾeje tælɒːjiː' } }),
}

/** A bonus exercise is a present, and says so. */
export const GIFT_ENTRY = defineEntry({ id: 'rewards-gift', kind: 'phrase', fa: 'یک تمرین جایزه!', da: 'En bonusøvelse i gave!', pron: { da: 'jek tamrine djåjeze', ipa: 'jek tæmɾiːne dʒɒːjeze' } })

/** Shown when a resting streak wakes up — the welcome, never a scolding. */
export const WELCOME_BACK: Praise = defineEntry({
  id: 'rewards-welcome-back',
  kind: 'phrase',
  fa: 'خوش برگشتی!',
  da: 'Velkommen tilbage!',
  pron: { da: 'khosj bargasjti', ipa: 'xoʃ bæɾɡæʃti' },
})

const PAGE_FILLED = defineEntry({ id: 'rewards-page-filled', kind: 'phrase', fa: 'صفحه پر شد!', da: 'Siden er fuld!', pron: { da: 'safhe por sjod', ipa: 'sæfhe poɾ ʃod' } })
const CURRENT_PAGE = defineEntry({ id: 'rewards-current-page', kind: 'phrase', fa: 'صفحهٔ تازه', da: 'En ny side', pron: { da: 'safheje tåze', ipa: 'sæfheje tɒːze' } })
const STREAK_RESTING = defineEntry({ id: 'rewards-streak-resting', kind: 'phrase', fa: 'رشتهٔ تمرین خوابیده', da: 'Øvestimen hviler', pron: { da: 'resjteje tamrin khåbide', ipa: 'ɾeʃteje tæmɾiːn xɒːbiːde' } })
const STREAK_TODAY = defineEntry({ id: 'rewards-streak-today', kind: 'phrase', fa: 'امروز تمرین کردی', da: 'Du har øvet i dag', pron: { da: 'emruz tamrin kardi', ipa: 'ʔemɾuːz tæmɾiːn kæɾdiː' } })
const STREAK_AWAKE = defineEntry({ id: 'rewards-streak-awake', kind: 'phrase', fa: 'رشتهٔ تمرین بیدار است', da: 'Øvestimen er vågen', pron: { da: 'resjteje tamrin bidår ast', ipa: 'ɾeʃteje tæmɾiːn biːdɒːɾ æst' } })

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

/** "Side 2 er fuld!" — the page number is composed in the Danish line only; the Persian half stays the static catalog phrase. */
export function filledPageLine(page: number): Praise {
  return { ...PAGE_FILLED, da: `Side ${page} er fuld!` }
}

/** Where the learner is writing now. A level is the notebook page they are on. */
export function currentPageLine(level: number): Praise {
  return { ...CURRENT_PAGE, da: `Du er på side ${level}.` }
}

/**
 * The home line. Three moods, none of them a reproach: the learner practised
 * today, the streak is awake and waiting, or the streak is having a rest.
 */
export function streakLine(streak: StreakState): Praise {
  const days = `${streak.value} ${streak.value === 1 ? 'dag' : 'dage'}`
  if (streak.resting) {
    return { ...STREAK_RESTING, da: `${days} · stimen hviler — én øvelse vækker den` }
  }
  if (streak.today) {
    return { ...STREAK_TODAY, da: `${days} · du har øvet i dag` }
  }
  return { ...STREAK_AWAKE, da: `${days} · stimen er vågen` }
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

