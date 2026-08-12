import { LessonSheet, BarLink } from '../components/LessonSheet'
import { wordBridges, type WordBridgeCategory } from '../lessons/wordBridges'
import { WordBridgeRow } from './WordBridgeRow'
import './wordBridges.css'
import './wordBridgesWide.css'

const sections: readonly {
  category: WordBridgeCategory
  title: string
  lead: string
}[] = [
  { category: 'family', title: 'Familien', lead: 'Fire ord for mennesker tæt på dig.' },
  { category: 'everyday', title: 'I hverdagen', lead: 'Ord fra hjemmet, naturen og sproget omkring dig.' },
  { category: 'numbers', title: 'Tre tal', lead: 'Talord, der stadig kan genkendes på tværs af sprogene.' },
  { category: 'world', title: 'Krop og himmel', lead: 'Fra tænder og navle til månen og stjernerne.' },
  { category: 'memory', title: 'Lydlige huskebroer', lead: 'Gode at huske med, også når betydning eller ordhistorie kræver en forklaring.' },
]

export default function WordBridgesScreen() {
  return (
    <LessonSheet
      title="Ord, der ligner"
      className="word-bridges"
      bar={<BarLink to="/opdag">Til ordværkstedet</BarLink>}
    >
      <header className="word-bridges__intro">
        <p className="word-bridges__eyebrow">{wordBridges.length} ordbroer</p>
        <p className="word-bridges__lead">
          Persisk og dansk gemmer på ord fra samme gamle familie.
          Kan du finde lydene, der stadig ligner hinanden?
        </p>
        <p className="word-bridges__note">
          Et lydspor hjælper hukommelsen. Det er ikke en regel for alle ord.
        </p>
      </header>

      {sections.map((section) => {
        const bridges = wordBridges.filter((bridge) => bridge.category === section.category)
        return (
          <section className="word-bridges__section" key={section.category} aria-labelledby={`bridges-${section.category}`}>
            <div className="word-bridges__heading">
              <div>
                <h2 id={`bridges-${section.category}`}>{section.title}</h2>
                <p>{section.lead}</p>
              </div>
              <span aria-label={`${bridges.length} ordbroer`}>{bridges.length}</span>
            </div>
            <div className="word-bridges__list">
              {bridges.map((bridge) => (
                <WordBridgeRow bridge={bridge} featured={bridge.id === wordBridges[0].id} key={bridge.id} />
              ))}
            </div>
          </section>
        )
      })}
    </LessonSheet>
  )
}
