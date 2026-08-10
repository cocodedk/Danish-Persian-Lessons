import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import LessonImageRenderer from './LessonImageRenderer'

describe('LessonImageRenderer', () => {
  it('renders one informative, local and responsive picture', () => {
    const { container } = render(
      <LessonImageRenderer entryId="vocabulary-1-ab" eager />,
    )
    const image = screen.getByRole('img', { name: 'Et glas vand' })
    const source = container.querySelector('source')

    expect(image).toHaveAttribute('src', '/lesson-images/ab-480.jpg')
    expect(image).toHaveAttribute('srcset', expect.stringContaining('/lesson-images/ab-960.jpg 960w'))
    expect(image).toHaveAttribute('width', '960')
    expect(image).toHaveAttribute('height', '720')
    expect(image).toHaveAttribute('loading', 'eager')
    expect(image).toHaveAttribute('decoding', 'async')
    expect(source).toHaveAttribute('type', 'image/webp')
    expect(source).toHaveAttribute('srcset', expect.stringContaining('/lesson-images/ab-480.webp 480w'))
  })

  it('uses the small local file on narrow thumbnail cards', () => {
    const { container } = render(
      <LessonImageRenderer entryId="vocabulary-1-ab" eager={false} size="thumbnail" />,
    )
    const image = screen.getByRole('img', { name: 'Et glas vand' })
    const source = container.querySelector('source')
    expect(image).toHaveAttribute('src', '/lesson-images/ab-120.jpg')
    expect(image).toHaveAttribute('srcset', expect.stringContaining('/lesson-images/ab-120.jpg 120w'))
    expect(source).toHaveAttribute('media', '(min-width: 22.01rem)')
  })

  it('renders a new starter illustration and nothing outside the catalog', () => {
    const newImage = render(
      <LessonImageRenderer entryId="vocabulary-1-baba" eager={false} />,
    )
    expect(screen.getByRole('img', { name: 'En far med sit barn' })).toHaveAttribute(
      'src', '/lesson-images/baba-480.jpg',
    )
    newImage.unmount()

    const { container } = render(
      <LessonImageRenderer entryId="vocabulary-1-pesar" eager={false} />,
    )
    expect(container).toBeEmptyDOMElement()
  })
})
