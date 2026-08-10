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
  size = 'teaching',
}: {
  entryId: string
  eager: boolean
  size?: 'teaching' | 'thumbnail'
}) {
  const image = lessonImageForEntry(entryId)
  if (!image) return null
  if (size === 'thumbnail') {
    return (
      <div className="lesson-image lesson-image--thumbnail">
        <img
          src={lessonImageUrl(image.cardSrc)}
          width="120"
          height="90"
          alt={image.altDa}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          style={{ objectPosition: image.focalPoint }}
        />
      </div>
    )
  }
  const webp = image.sources.find((source) => source.type === 'image/webp')!
  const jpeg = image.sources.find((source) => source.type === 'image/jpeg')!
  const fallback = jpeg.srcSet.split(' ')[0]

  return (
    <div className="lesson-image lesson-image--teaching">
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
