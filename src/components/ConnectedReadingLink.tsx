import { Link } from 'react-router-dom'
import type { ConnectedReading } from '../lessons/connectedReading'
import { PersianText } from './PersianText'
import './ConnectedReadingLink.css'

export function ConnectedReadingLink({ reading }: { reading: ConnectedReading }) {
  return (
    <Link className="connected-reading-link" to={`/lesson/ord/${reading.unitId}/laes/${reading.id}`}>
      <span>{reading.kind === 'microtext' ? 'Læs en lille tekst' : 'Læs et lille udtryk'}</span>
      <PersianText entry={reading.entry} />
    </Link>
  )
}
