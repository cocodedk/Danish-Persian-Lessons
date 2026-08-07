import { describe, expect, it } from 'vitest'
import {
  TYPE_EXTRA_LETTER_ENTRY,
  TYPE_MISSING_LETTER_ENTRY,
  TYPE_WRONG_LETTER_ENTRY,
} from '../content/faStrings'
import {
  ASSEMBLE_ENTRY,
  LATER_IN_NAME_ENTRY,
  PRIVACY_ENTRY,
  SPELLING_PICK_ENTRY,
  SPELLING_TITLE_ENTRY,
} from '../name/copy'
import { connectedTexts } from '../lessons/connectedReading'
import {
  GIFT_ENTRY,
  PRAISE,
  WELCOME_BACK,
  currentPageLine,
  filledPageLine,
  streakLine,
} from '../rewards/copy'

const ZIPF = new Map([
  ['ادامه', 5.70], ['است', 6.98], ['اضافه', 5.27], ['امروز', 5.87],
  ['این', 7.14], ['اینجا', 5.76], ['بزن', 5.21], ['بعد', 6.13],
  ['به', 7.45], ['بود', 6.71], ['تازه', 5.48], ['تمرین', 4.81],
  ['جایزه', 4.98], ['حرف', 5.88], ['خوب', 6.04], ['خیلی', 6.07],
  ['دارد', 6.18], ['داری', 5.65], ['در', 7.42], ['درست', 5.81],
  ['دستگاه', 5.30], ['دوباره', 5.55], ['دوست', 5.97], ['دیگر', 6.00],
  ['را', 7.00], ['سلام', 5.65], ['شد', 6.50], ['صفحه', 5.33],
  ['عالی', 5.37], ['فارسی', 5.59], ['فقط', 6.23], ['نام', 6.14],
  ['هنوز', 5.81], ['پر', 5.54], ['چه', 6.34], ['کدام', 5.02],
  ['کردی', 5.50], ['کم', 5.77], ['کن', 5.99], ['یک', 6.66],
])

function words(text: string): string[] {
  return text.normalize('NFD').replace(/\p{Mark}/gu, '').replace(/[.!،؟]/gu, '')
    .split(/\s+/u).filter(Boolean)
}

describe('bilingual parity', () => {
  it('keeps dynamic reward lines to one shared proposition', () => {
    expect(filledPageLine()).toMatchObject({ fa: 'صفحه پر شد!', da: 'Siden er fuld!' })
    expect(currentPageLine()).toMatchObject({ fa: 'صفحهٔ تازه', da: 'En ny side' })
    expect(streakLine({ value: 3, resting: true, today: false })).toMatchObject({
      fa: 'تمرین هنوز ادامه دارد',
      da: 'Træningen fortsætter stadig',
    })
    expect(streakLine({ value: 3, resting: false, today: false })).toMatchObject({
      fa: 'تمرین ادامه دارد',
      da: 'Træningen fortsætter',
    })
    expect(streakLine({ value: 3, resting: false, today: true })).toMatchObject({
      fa: 'امروز تمرین کردی',
      da: 'Du har øvet i dag',
    })
  })

  it('keeps each connected-reading sentence visible in Danish', () => {
    expect(connectedTexts.map(({ entry }) => [entry.fa, entry.da])).toEqual([
      [
        'این آب است. آن نان است. او بابا است.',
        'Dette er vand. Det der er brød. Han eller hun er far.',
      ],
      [
        'این مدرسه است. این میز است. این کتاب است. او دوست من است.',
        'Dette er en skole. Dette er et bord. Dette er en bog. Han eller hun er min ven.',
      ],
      [
        'این خانه است. آسمان آبی است. ماه زرد است. شب است.',
        'Dette er et hus. Himlen er blå. Månen er gul. Det er nat.',
      ],
    ])
  })

  it('keeps new learner-facing copy at Zipf 4.8 or higher', () => {
    const entries = [
      ...PRAISE.slice(1),
      WELCOME_BACK,
      GIFT_ENTRY,
      filledPageLine(),
      currentPageLine(),
      streakLine({ value: 1, resting: true, today: false }),
      streakLine({ value: 1, resting: false, today: false }),
      streakLine({ value: 1, resting: false, today: true }),
      TYPE_MISSING_LETTER_ENTRY,
      TYPE_WRONG_LETTER_ENTRY,
      TYPE_EXTRA_LETTER_ENTRY,
      SPELLING_TITLE_ENTRY,
      SPELLING_PICK_ENTRY,
      ASSEMBLE_ENTRY,
      LATER_IN_NAME_ENTRY,
      PRIVACY_ENTRY,
    ]

    for (const entry of entries) {
      for (const word of words(entry.fa)) {
        expect(ZIPF.get(word) ?? 0, `${entry.id}: ${word}`).toBeGreaterThanOrEqual(4.8)
      }
    }
  })
})
