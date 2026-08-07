import { useState } from 'react'
import {
  applyColorMode,
  getColorMode,
  saveColorMode,
  type ColorMode,
} from '../styles/colorMode'

export default function ColorModeControl() {
  const [colorMode, setColorModeState] = useState(getColorMode)

  function handleChange(next: ColorMode) {
    const saved = saveColorMode(next)
    setColorModeState(saved)
    applyColorMode(saved)
  }

  return (
    <label className="settings-corner__colors" htmlFor="settings-corner-colors">
      <span>Farver</span>
      <select
        id="settings-corner-colors"
        value={colorMode}
        onChange={(event) => handleChange(event.target.value as ColorMode)}
      >
        <option value="system">Som på telefon eller pc</option>
        <option value="light">Lys</option>
        <option value="dark">Mørk</option>
      </select>
    </label>
  )
}
