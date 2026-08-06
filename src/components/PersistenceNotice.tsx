import { useSyncExternalStore } from 'react'
import {
  getStorageWarning,
  subscribeStorageWarning,
} from '../progress/storage'

export function PersistenceNotice() {
  const warning = useSyncExternalStore(
    subscribeStorageWarning,
    getStorageWarning,
    getStorageWarning,
  )

  if (!warning) return null

  return (
    <p className="persistence-notice" role="status">
      {warning === 'memory'
        ? 'Du kan fortsætte. Fremskridt gemmes kun i denne fane lige nu.'
        : 'Noget tidligere fremskridt kunne ikke læses. Du kan stadig fortsætte.'}
    </p>
  )
}
