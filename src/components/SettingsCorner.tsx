import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getSettings, setSoundOn } from '../progress/settings'
import { PRIVACY_ENTRY } from '../name/copy'
import { CompactPhraseRow } from './EntryRenderers'
import { PersonalNameText } from './PersonalName'
import './SettingsCorner.css'

const ColorModeControl = lazy(() => import('./ColorModeControl'))

export interface SettingsCornerProps {
  name?: string
  /** The Persian spelling, when the learner has chosen one. */
  faSpelling?: string
  onSave: (name: string) => void
  onDelete: () => void
}

/** A small, unobtrusive corner control where the name can be edited or deleted. */
export function SettingsCorner({ name, faSpelling, onSave, onDelete }: SettingsCornerProps) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(name ?? '')
  const [sound, setSound] = useState(() => getSettings().sound)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      setOpen(false)
      toggleRef.current?.focus()
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [open])

  function handleToggle() {
    setDraft(name ?? '')
    setOpen((wasOpen) => !wasOpen)
  }

  function handleSave() {
    onSave(draft)
    setOpen(false)
  }

  function handleDelete() {
    onDelete()
    setDraft('')
    setOpen(false)
  }

  return (
    <div className="settings-corner" lang="da">
      <button
        ref={toggleRef}
        type="button"
        className="settings-corner__toggle"
        aria-label={name ? `Indstillinger for ${name}` : 'Indstillinger'}
        aria-expanded={open}
        aria-controls="settings-corner-panel"
        onClick={handleToggle}
      >
        {name ? name : 'Indstillinger'}
      </button>

      {open && (
        <div id="settings-corner-panel" className="settings-corner__panel" aria-labelledby="settings-corner-title">
          <h2 id="settings-corner-title">Indstillinger</h2>
          <label htmlFor="settings-corner-name">Dit navn</label>
          <input
            id="settings-corner-name"
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />
          <div className="settings-corner__actions">
            <button type="button" onClick={handleSave}>
              Gem
            </button>
            {name && (
              <button
                type="button"
                className="settings-corner__delete"
                onClick={handleDelete}
              >
                Slet
              </button>
            )}
          </div>

          {/* The spelling lives on its own screen, where the letters are. */}
          {name && (
            <p className="settings-corner__spelling">
              {faSpelling && (
                <PersonalNameText
                  spelling={faSpelling}
                  className="settings-corner__spelling-fa"
                />
              )}
              <Link className="settings-corner__link" to="/dit-navn">
                {faSpelling ? 'Ret navnet på persisk' : 'Skriv navnet på persisk'}
              </Link>
            </p>
          )}

          {/* Sound has nothing to do with the motion preference — a learner
              may want the jingle and no animation, or the other way round. */}
          <label className="settings-corner__sound" htmlFor="settings-corner-sound">
            <input
              id="settings-corner-sound"
              type="checkbox"
              checked={sound}
              onChange={(event) => setSound(setSoundOn(event.target.checked).sound)}
            />
            <span>Lyd ved ros og nye sider</span>
          </label>
          <Suspense fallback={null}>
            <ColorModeControl />
          </Suspense>
          <Link className="settings-corner__link" to="/billedkilder">
            Billedkilder
          </Link>
          <CompactPhraseRow entry={PRIVACY_ENTRY} />
        </div>
      )}
    </div>
  )
}
