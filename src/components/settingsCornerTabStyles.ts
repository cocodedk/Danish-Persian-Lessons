import type { CSSProperties } from 'react'

export const tabListStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  borderBlockEnd: '1px solid var(--rule)',
}

const tabButtonStyle: CSSProperties = {
  minHeight: 'var(--tap-min)',
  border: 0,
  borderBlockEnd: '3px solid transparent',
  background: 'transparent',
  color: 'var(--ink)',
  font: 'inherit',
  fontWeight: 700,
  cursor: 'pointer',
}

export function tabStyle(selected: boolean): CSSProperties {
  if (!selected) return tabButtonStyle
  return {
    ...tabButtonStyle,
    borderBlockEndColor: 'var(--blue)',
    background: 'var(--paper)',
  }
}

export const tabContentStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
}

export const aboutContentStyle: CSSProperties = {
  ...tabContentStyle,
  minBlockSize: '8rem',
  justifyContent: 'center',
}

export const dedicationStyle: CSSProperties = {
  margin: 0,
  fontSize: '1.125rem',
  fontWeight: 700,
}

export const versionStyle: CSSProperties = {
  display: 'flex',
  gap: '0.5rem',
  margin: 0,
}
