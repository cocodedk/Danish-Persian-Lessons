import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import AlphabetLesson from './pages/AlphabetLesson'
import Orientation from './pages/Orientation'
import LetterScreen from './pages/LetterScreen'
import VowelMarksScreen from './pages/VowelMarksScreen'
import ExerciseScreen from './pages/ExerciseScreen'
import LessonPlaceholder from './pages/LessonPlaceholder'
import Kit from './pages/Kit'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lesson/alphabet" element={<AlphabetLesson />} />
        <Route path="/lesson/alphabet/intro" element={<Orientation />} />
        <Route path="/lesson/alphabet/bogstav/:id" element={<LetterScreen />} />
        <Route path="/lesson/alphabet/vokaltegn" element={<VowelMarksScreen />} />
        <Route path="/lesson/alphabet/ovelse/:kind" element={<ExerciseScreen />} />
        <Route path="/lesson/:id" element={<LessonPlaceholder />} />
        {/* Review surface for the design kit — direct URL only, never linked from home. */}
        <Route path="/kit" element={<Kit />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}
