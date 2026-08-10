import type { LessonImage } from './types'

const items = [
  ['salam', 2, 'Et barn vinker'],
  ['man', 1, 'Et barn peger på sig'],
  ['to', 1, 'Et barn viser en anden'],
  ['dust', 2, 'To venner sammen'],
  ['ab', 1, 'Et glas vand'],
  ['nan', 1, 'Et fladt brød'],
  ['baba', 1, 'En far med sit barn'],
  ['madar', 1, 'En mor med sit barn'],
  ['khane', 3, 'Et lille hvidt hus'],
  ['in', 1, 'Denne bold er tæt på'],
  ['an', 1, 'Den bold er derovre'],
  ['ma', 1, 'Tre børn sammen'],
  ['u', 1, 'Et barn alene'],
  ['medad', 2, 'En gul blyant'],
  ['ketab', 2, 'En lukket bog'],
  ['miz', 2, 'Et træbord'],
  ['dar', 2, 'En gammel trædør'],
  ['gol', 3, 'En lyserød blomst'],
  ['gorbe', 5, 'En kat'],
  ['sag', 5, 'En hund'],
  ['parande', 5, 'En fugl'],
  ['mahi', 5, 'En fisk i vand'],
  ['asb', 5, 'En hest'],
  ['gav', 5, 'En ko'],
  ['khargush', 5, 'En kanin'],
  ['mush', 5, 'En mus'],
] as const

const focalPoints: Partial<Record<(typeof items)[number][0], `${number}% ${number}%`>> = {
  to: '75% 50%',
  an: '84% 50%',
}

export const lessonImages: LessonImage[] = items.map(([id, unit, altDa]) => ({
  id,
  entryIds: [`vocabulary-${unit}-${id}`],
  purpose: 'meaning-model',
  altDa,
  creditId: `image-${id}`,
  width: 960,
  height: 720,
  focalPoint: focalPoints[id] ?? '50% 50%',
  cardSrc: `${id}-120.jpg`,
  sources: [
    { type: 'image/webp', srcSet: `${id}-480.webp 480w, ${id}-960.webp 960w` },
    { type: 'image/jpeg', srcSet: `${id}-480.jpg 480w, ${id}-960.jpg 960w` },
  ],
}))

export function lessonImageForEntry(entryId: string): LessonImage | undefined {
  return lessonImages.find((image) => image.entryIds.includes(entryId))
}

export function lessonImageUrl(filename: string): string {
  return `${import.meta.env.BASE_URL}lesson-images/${filename}`
}
