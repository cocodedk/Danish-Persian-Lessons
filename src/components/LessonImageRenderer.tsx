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
  const webp = image.sources.find((source) => source.type === 'image/webp')!
  const jpeg = image.sources.find((source) => source.type === 'image/jpeg')!
  if (size === 'thumbnail') {
    return (
      <div className="lesson-image lesson-image--thumbnail" style={{ margin: 0 }}>
        <picture>
          <source
            type={webp.type}
            srcSet={localSrcSet(webp.srcSet)}
            sizes="(max-width: 22rem) 120px, (min-width: 64rem) 12rem, 45vw"
            media="(min-width: 22.01rem)"
          />
          <img
            src={lessonImageUrl(image.cardSrc)}
            srcSet={lessonImageUrl(image.cardSrc) + ' 120w, ' + localSrcSet(jpeg.srcSet)}
            sizes="(max-width: 22rem) 120px, (min-width: 64rem) 12rem, 45vw"
            width="120"
            height="90"
            alt={image.altDa}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            style={{ objectPosition: image.focalPoint }}
          />
        </picture>
      </div>
    )
  }
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
