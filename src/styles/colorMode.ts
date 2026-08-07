import { readJSON, writeJSON } from '../progress/storage'

export type ColorMode = 'system' | 'light' | 'dark'

const KEY = 'colorMode'

export function getColorMode(): ColorMode {
  const { colorMode } = readJSON<{ colorMode?: unknown }>(KEY, {})
  return colorMode === 'light' || colorMode === 'dark' ? colorMode : 'system'
}

export function saveColorMode(colorMode: ColorMode): ColorMode {
  writeJSON(KEY, { colorMode })
  return colorMode
}

/** Bind a learner's choice; no class means the device setting stays in charge. */
export function applyColorMode(colorMode: ColorMode): void {
  const root = document.documentElement
  root.classList.toggle('scheme-light', colorMode === 'light')
  root.classList.toggle('scheme-dark', colorMode === 'dark')
}
