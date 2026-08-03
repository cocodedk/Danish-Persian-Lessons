import { useState } from 'react'
import './SettingsCorner.css'

export interface SettingsCornerProps {
  name?: string
  onSave: (name: string) => void
  onDelete: () => void
}

/** A small, unobtrusive corner control where the name can be edited or deleted. */
export function SettingsCorner({ name, onSave, onDelete }: SettingsCornerProps) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(name ?? '')

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
        type="button"
        className="settings-corner__toggle"
        aria-expanded={open}
        aria-controls="settings-corner-panel"
        onClick={handleToggle}
      >
        {name ? name : 'Indstillinger'}
      </button>

      {open && (
        <div id="settings-corner-panel" className="settings-corner__panel">
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
          <p className="settings-corner__privacy">Navnet gemmes kun på din telefon.</p>
        </div>
      )}
    </div>
  )
}
