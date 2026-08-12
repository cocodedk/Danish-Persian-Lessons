import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getSettings, setSoundOn } from '../progress/settings'
import { PRIVACY_ENTRY } from '../name/copy'
import { CompactPhraseRow } from './EntryRenderers'
import { PersonalNameText } from './PersonalName'
import { aboutContentStyle, dedicationStyle, tabContentStyle, tabListStyle, tabStyle, versionStyle } from './settingsCornerTabStyles'
import './SettingsCorner.css'

type SettingsTab = 'settings' | 'about'

const ColorModeControl = lazy(() => import('./ColorModeControl'))

export interface SettingsCornerProps {
  name?: string
  /** The Persian spelling, when the learner has chosen one. */
  faSpelling?: string
  onSave: (name: string) => void
  onDelete: () => void
}

/** The persistent app settings disclosure. */
export function SettingsCorner({ name, faSpelling, onSave, onDelete }: SettingsCornerProps) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(name ?? '')
  const [activeTab, setActiveTab] = useState<SettingsTab>('settings')
  const [sound, setSound] = useState(() => getSettings().sound)
  const toggleRef = useRef<HTMLButtonElement>(null)

  const tabRefs = useRef<Record<SettingsTab, HTMLButtonElement | null>>({ settings: null, about: null })
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
    if (!open) setActiveTab('settings')
    setOpen((wasOpen) => !wasOpen)
  }

  function selectTab(tab: SettingsTab, focus = false) {
    setActiveTab(tab)
    if (focus) tabRefs.current[tab]?.focus()
  }

  function handleTabKey(event: React.KeyboardEvent<HTMLButtonElement>) {
    let next: SettingsTab | undefined
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      next = activeTab === 'settings' ? 'about' : 'settings'
    } else if (event.key === 'Home') next = 'settings'
    else if (event.key === 'End') next = 'about'
    if (!next) return
    event.preventDefault()
    selectTab(next, true)
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
        <span className="settings-corner__gear" aria-hidden="true">⚙</span>
      </button>

      {open && (
        <div id="settings-corner-panel" className="settings-corner__panel" aria-labelledby="settings-corner-title">
          <h2 id="settings-corner-title">Indstillinger</h2>
          <div style={tabListStyle} role="tablist" aria-label="Indhold i indstillinger">
            <button
              ref={(node) => { tabRefs.current.settings = node }}
              id="settings-corner-settings-tab"
              type="button"
              role="tab"
              aria-controls="settings-corner-settings-panel"
              aria-selected={activeTab === 'settings'}
              tabIndex={activeTab === 'settings' ? 0 : -1}
              onClick={() => selectTab('settings')}
              onKeyDown={handleTabKey}
              style={tabStyle(activeTab === 'settings')}
            >
              Indstillinger
            </button>
            <button
              ref={(node) => { tabRefs.current.about = node }}
              id="settings-corner-about-tab"
              type="button"
              role="tab"
              aria-controls="settings-corner-about-panel"
              aria-selected={activeTab === 'about'}
              tabIndex={activeTab === 'about' ? 0 : -1}
              onClick={() => selectTab('about')}
              onKeyDown={handleTabKey}
              style={tabStyle(activeTab === 'about')}
            >
              Om
            </button>
          </div>

          {activeTab === 'settings' ? (
            <div
              id="settings-corner-settings-panel"
              style={tabContentStyle}
              role="tabpanel"
              aria-labelledby="settings-corner-settings-tab"
            >
              <label htmlFor="settings-corner-name">Dit navn</label>
              <input
                id="settings-corner-name"
                type="text"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
              />
              <div className="settings-corner__actions">
                <button type="button" onClick={handleSave}>Gem</button>
                {name && (
                  <button type="button" className="settings-corner__delete" onClick={handleDelete}>
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

              {/* Sound has nothing to do with the motion preference. */}
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
          ) : (
            <div
              id="settings-corner-about-panel"
              style={aboutContentStyle}
              role="tabpanel"
              aria-labelledby="settings-corner-about-tab"
            >
              <p style={dedicationStyle}>Tilegnet Persia Bandpey.</p>
              <p style={versionStyle}>
                <span>Version</span>
                <code>{__DPL_APP_VERSION__}</code>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
