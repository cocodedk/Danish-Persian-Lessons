import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { LessonSheet, BarLink } from '../components/LessonSheet'
import { LetterBank } from '../components/LetterBank'
import { Button } from '../components/Button'
import { ProgressTick } from '../components/ProgressTick'
import { getProfile, setProfile } from '../progress/profile'
import { suggestSpellings } from '../name/transliterate'
import { alphabetBank, type Tile } from '../name/bank'
import { SPELLING_TITLE_ENTRY, SPELLING_PICK_ENTRY } from '../name/copy'
import { CompactPhraseRow } from '../components/EntryRenderers'
import { PersonalNameCompanion, PersonalNameText } from '../components/PersonalName'
import './name.css'

/**
 * How the learner's name is spelled in Persian: the engine proposes, the
 * learner decides. Nothing is saved until they say so, and the spelling they
 * keep is the one the whole app uses — greeting, badges and mini-lesson all
 * read `profile.faSpelling`. See docs/plans/006-your-name.md step 2.
 */
export default function NameSpelling() {
  const navigate = useNavigate()
  const [profile] = useState(getProfile)
  const [draft, setDraft] = useState(
    () => profile.faSpelling ?? suggestSpellings(profile.name ?? '')[0] ?? '',
  )
  const [editing, setEditing] = useState(false)

  // No name, nothing to spell. The skip path never lands here.
  if (!profile.name) {
    return <Navigate to="/" replace />
  }

  const suggestions = suggestSpellings(profile.name)

  function place(tile: Tile) {
    setDraft((current) => current + tile.glyph)
  }

  function eraseLast() {
    setDraft((current) => [...current].slice(0, -1).join(''))
  }

  /** A compound name takes one space between its parts, never two. */
  function addSpace() {
    setDraft((current) => (current === '' || current.endsWith(' ') ? current : `${current} `))
  }

  function save() {
    const spelling = draft.trim()
    setProfile({ ...profile, faSpelling: spelling || undefined })
    navigate('/')
  }

  function remove() {
    setProfile({ ...profile, faSpelling: undefined })
    navigate('/')
  }

  return (
    <LessonSheet className="lesson--name" title="Dit navn på persisk" bar={<BarLink to="/">Til forsiden</BarLink>}>
      <CompactPhraseRow entry={SPELLING_TITLE_ENTRY} />
      <p className="alphabet__lead">
        Sådan kan {profile.name} skrives med persiske bogstaver. Vælg den, der ligner dit navn mest,
        eller ret den bogstav for bogstav. Du kan altid ændre den igen.
      </p>

      {draft && <PersonalNameCompanion spelling={draft} original={profile.name} className="name__preview" />}
      {draft === '' && <p className="name__hint">Tryk på bogstaverne herunder for at skrive navnet.</p>}

      {suggestions.length > 0 ? (
        <>
          <h2 className="alphabet__section-title">Vælg en stavemåde</h2>
          <CompactPhraseRow entry={SPELLING_PICK_ENTRY} />
          <ul className="name__choices">
            {suggestions.map((spelling) => (
              <li key={spelling} className="name__choice-row">
                <button
                  type="button"
                  className={`name__choice ${spelling === draft ? 'name__choice--picked' : ''}`}
                  aria-pressed={spelling === draft}
                  onClick={() => setDraft(spelling)}
                >
                  <PersonalNameText spelling={spelling} />
                </button>
                {spelling === draft && <ProgressTick granted label="Valgt" />}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="name__hint">
          Der er ingen forslag til dit navn denne gang. Skriv det selv med bogstaverne herunder.
        </p>
      )}

      <h2 className="alphabet__section-title">Ret bogstav for bogstav</h2>
      {editing ? (
        <>
          <LetterBank
            tiles={alphabetBank()}
            onPick={place}
            label="Tryk et bogstav for at sætte det ind til venstre"
          />
          <div className="name__actions">
            <Button variant="quiet" onClick={eraseLast}>
              Slet sidste bogstav
            </Button>
            <Button variant="quiet" onClick={addSpace}>
              Mellemrum
            </Button>
          </div>
        </>
      ) : (
        <Button variant="quiet" onClick={() => setEditing(true)}>
          Åbn bogstaverne
        </Button>
      )}

      <div className="name__actions name__actions--save">
        <Button onClick={save}>Gem stavemåden</Button>
        {profile.faSpelling && (
          <Button variant="quiet" onClick={remove}>
            Slet stavemåden
          </Button>
        )}
      </div>
    </LessonSheet>
  )
}
