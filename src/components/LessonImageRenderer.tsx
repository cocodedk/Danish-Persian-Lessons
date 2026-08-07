import { lessonImageForEntry, lessonImageUrl } from '../images/catalog'

function localSrcSet(srcSet: string): string {
  return srcSet
    .split(', ')
    .map((item) => {
      const [filename, width] = item.split(' ')
      return `${lessonImageUrl(filename)} ${width}`
    })
    .join(', ')
}

export default function LessonImageRenderer({
  entryId,
  eager,
}: {
  entryId: string
  eager: boolean
}) {
  const image = lessonImageForEntry(entryId)
  if (!image) return null
  const webp = image.sources.find((source) => source.type === 'image/webp')!
  const jpeg = image.sources.find((source) => source.type === 'image/jpeg')!
  const fallback = jpeg.srcSet.split(' ')[0]

  return (
    <div className="lesson-image">
      <picture>
        <source
          type={webp.type}
          srcSet={localSrcSet(webp.srcSet)}
          sizes="(min-width: 64rem) 28rem, calc(100vw - 3rem)"
        />
        <img
          src={lessonImageUrl(fallback)}
          srcSet={localSrcSet(jpeg.srcSet)}
          sizes="(min-width: 64rem) 28rem, calc(100vw - 3rem)"
          width={image.width}
          height={image.height}
          alt={image.altDa}
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : 'auto'}
          decoding="async"
          style={{ objectPosition: image.focalPoint }}
        />
      </picture>
    </div>
  )
}
