import { useEffect, useState } from 'react'
import { AreaNav } from './AreaNav'
import { SettingsCorner } from './SettingsCorner'
import {
  clearName,
  getProfile,
  setProfile,
  subscribeProfile,
} from '../progress/profile'
import './AppChrome.css'

export function AppChrome() {
  const [profile, setProfileState] = useState(() => getProfile())

  useEffect(() => subscribeProfile(() => setProfileState(getProfile())), [])

  function saveName(name: string) {
    const trimmed = name.trim()
    const kept = trimmed && trimmed !== profile.name ? undefined : profile.faSpelling
    setProfile({
      ...profile,
      name: trimmed || undefined,
      faSpelling: trimmed ? kept : undefined,
    })
  }

  return (
    <>
      <SettingsCorner
        name={profile.name}
        faSpelling={profile.faSpelling}
        onSave={saveName}
        onDelete={clearName}
      />
      <AreaNav />
    </>
  )
}
