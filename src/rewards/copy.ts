// Every word the reward engine says, in both languages, in one place — so the
// Persian text-rule guard can walk it and a critic can read the whole tone at
// once. Nothing here blames, nags, or announces a loss.
import { toPersianDigits } from '../lessons/digits'
import type { Praise, StickerKind, StreakState } from './types'

/**
 * Iranian school praise, varied the way a teacher varies it. The engine walks
 * this list by progress count, so it never repeats itself twice in a row and
 * never needs a random number. Pron is dansk lydskrift + IPA, dictated verbatim
 * by docs/plans/009-praise-pronunciation.md — never improvised in the UI.
 */
export const PRAISE: Praise[] = [
  { fa: 'آفرین', da: 'Flot!', pron: { da: 'åfarin', ipa: 'ɒːfæɾin' } },
  { fa: 'ایول', da: 'Sådan!', pron: { da: 'ejval', ipa: 'ejvæl' } },
  { fa: 'چه خوب', da: 'Godt gået!', pron: { da: 'tje khub', ipa: 'tʃe xub' } },
  { fa: 'عالی', da: 'Rigtig fint!', pron: { da: 'åli', ipa: 'ɒːli' } },
  { fa: 'خیلی خوب', da: 'Dygtig!', pron: { da: 'khejli khub', ipa: 'xejli xub' } },
  {
    fa: 'باریکلا',
    da: 'Sådan skal det være!',
    pron: { da: 'bårikalå', ipa: 'bɒːɾikælɒː' },
  },
]

/** The three stamps a teacher owns: the آفرین stamp, the ۲۰ mark, the gold star. */
export const STICKER_LABELS: Record<StickerKind, Praise> = {
  afarin: { fa: 'آفرین', da: 'Klistermærke: flot klaret' },
  bist: { fa: '۲۰', da: 'Klistermærke: tyve ud af tyve' },
  star: { fa: 'ستارهٔ طلایی', da: 'Klistermærke: guldstjerne' },
}

/** A bonus exercise is a present, and says so. */
export const GIFT_FA = 'یک تمرین جایزه!'
export const GIFT_DA = 'En bonusøvelse i gave!'

/** Shown when a resting streak wakes up — the welcome, never a scolding. */
export const WELCOME_BACK: Praise = {
  fa: 'خوش برگشتی!',
  da: 'Velkommen tilbage!',
  pron: { da: 'khåsj bargasjti', ipa: 'xoʃ bæɾɡæʃti' },
}

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

/** «صفحهٔ ۲ پر شد!» / "Side 2 er fuld!" — said about the page that just filled. */
export function filledPageLine(page: number): Praise {
  return {
    fa: `صفحهٔ ${toPersianDigits(page)} پر شد!`,
    da: `Side ${page} er fuld!`,
  }
}

/** Where the learner is writing now. A level is the notebook page they are on. */
export function currentPageLine(level: number): Praise {
  return {
    fa: `صفحهٔ ${toPersianDigits(level)}`,
    da: `Du er på side ${level}.`,
  }
}

/**
 * The home line. Three moods, none of them a reproach: the learner practised
 * today, the streak is awake and waiting, or the streak is having a rest.
 */
export function streakLine(streak: StreakState): Praise {
  const days = `${streak.value} ${streak.value === 1 ? 'dag' : 'dage'}`
  const roz = `${toPersianDigits(streak.value)} روز`

  if (streak.resting) {
    return {
      fa: `${roz} · رشته‌ات خوابیده، یک تمرین بیدارش می‌کند`,
      da: `${days} · stimen hviler — én øvelse vækker den`,
    }
  }
  if (streak.today) {
    return { fa: `${roz} · امروز تمرین کردی`, da: `${days} · du har øvet i dag` }
  }
  return { fa: `${roz} · رشته‌ات بیدار است`, da: `${days} · stimen er vågen` }
}

/** Every Persian string this module can produce — walked by the text-rule guard. */
export const REWARD_FA_STRINGS: string[] = [
  ...PRAISE.map((praise) => praise.fa),
  ...Object.values(STICKER_LABELS).map((label) => label.fa),
  GIFT_FA,
  WELCOME_BACK.fa,
  filledPageLine(12).fa,
  currentPageLine(3).fa,
  streakLine({ value: 12, resting: true, today: false }).fa,
  streakLine({ value: 1, resting: false, today: true }).fa,
  streakLine({ value: 7, resting: false, today: false }).fa,
]
