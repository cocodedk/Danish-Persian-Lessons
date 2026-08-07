import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { armSound } from './rewards/sound'
import { startVersionCheck } from './update/startVersionCheck'
import './styles/fonts.css'
import './styles/tokens.css'
import './styles/global.css'

const rootEl = document.getElementById('root')
if (!rootEl) {
  throw new Error('Root element #root not found')
}

// Listens for the first tap or key, and only then may a jingle ever play.
armSound()
startVersionCheck()

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
