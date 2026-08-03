import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import LessonPlaceholder from './pages/LessonPlaceholder'
import Kit from './pages/Kit'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lesson/:id" element={<LessonPlaceholder />} />
        {/* Review surface for the design kit — direct URL only, never linked from home. */}
        <Route path="/kit" element={<Kit />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}
