import type { ColorSwatchId } from '../lessons/vocab'
import './ColorSwatch.css'

export function ColorSwatch({
  color,
  size = 'small',
}: {
  color: ColorSwatchId
  size?: 'small' | 'large'
}) {
  return (
    <span
      className={`color-swatch color-swatch--${color} color-swatch--${size}`}
      aria-hidden="true"
    />
  )
}
