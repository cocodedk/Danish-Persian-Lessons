import { LessonSheet, BarLink } from '../components/LessonSheet'
import manifest from '../images/lesson-images.json'
import './ImageCreditsScreen.css'

export default function ImageCreditsScreen() {
  return (
    <LessonSheet title="Billedkilder" bar={<BarLink to="/">Til forsiden</BarLink>}>
      <p className="image-credits__intro">
        Her kan du se, hvor billederne kommer fra. Alle billeder ligger i appen.
      </p>
      <ul className="image-credits__list">
        {manifest.images.map((image) => (
          <li key={image.creditId} id={image.creditId}>
            <h2>{image.altDa}</h2>
            <p>
              Foto: {image.creator} · {image.sourceName}
            </p>
            <p>
              <a href={image.sourcePage} target="_blank" rel="noreferrer">
                Se kilden
              </a>{' '}
              ·{' '}
              <a href={image.licenseUrl} target="_blank" rel="noreferrer">
                {image.license}
              </a>
            </p>
            <p>Vi har beskåret billedet, gjort det mindre og fjernet gemte data.</p>
          </li>
        ))}
      </ul>
    </LessonSheet>
  )
}
