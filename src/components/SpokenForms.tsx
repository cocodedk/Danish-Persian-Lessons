import type { PersianEntry, SpokenRegister } from '../catalog/types'
import { spokenFormsFor } from '../catalog/types'
import { AudioControl } from './AudioControl'
import { PersianText } from './PersianText'
import { PronLine } from './PronLine'
import './SpokenForms.css'

const labels: Record<SpokenRegister, string> = {
  neutral: 'Sådan siger man',
  everyday: 'Til hverdag',
  formal: 'I pænt sprog',
}

export function SpokenForms({
  entry,
  onHeard,
}: {
  entry: PersianEntry
  onHeard?: () => void
}) {
  const forms = spokenFormsFor(entry)
  return (
    <div className="spoken-forms">
      {forms.map((form) => (
        <section className="spoken-form" key={form.id} aria-labelledby={`${entry.id}-${form.id}-label`}>
          <h2 id={`${entry.id}-${form.id}-label`}>{labels[form.register]}</h2>
          <PersianText
            entry={entry}
            display={form.faMarked ?? form.fa}
            marked={Boolean(form.faMarked)}
            as="p"
            className="spoken-form__fa"
          />
          <p className="spoken-form__meaning">{form.da}</p>
          <PronLine {...form.pron} />
          <AudioControl audioId={form.audioId} onPlay={onHeard} />
        </section>
      ))}
    </div>
  )
}
