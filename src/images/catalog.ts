import type { LessonImage } from './types'

const items = [
  ['ab', 1, 'Et glas vand'],
  ['nan', 1, 'Et fladt brød'],
  ['medad', 2, 'En gul blyant'],
  ['ketab', 2, 'En lukket bog'],
  ['miz', 2, 'Et træbord'],
  ['dar', 2, 'En gammel trædør'],
  ['khane', 3, 'Et lille hvidt hus'],
  ['gol', 3, 'En lyserød blomst'],
] as const

export const lessonImages: LessonImage[] = items.map(([id, unit, altDa]) => ({
  id,
  entryIds: [`vocabulary-${unit}-${id}`],
  purpose: 'meaning-model',
  altDa,
  creditId: `image-${id}`,
  width: 960,
  height: 720,
  focalPoint: '50% 50%',
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
