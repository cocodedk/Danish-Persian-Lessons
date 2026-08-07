import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import AlphabetLesson from './pages/AlphabetLesson'
import Orientation from './pages/Orientation'
import LetterScreen from './pages/LetterScreen'
import VowelMarksScreen from './pages/VowelMarksScreen'
import ExerciseScreen from './pages/ExerciseScreen'
import BonusScreen from './pages/BonusScreen'
import VocabUnitScreen from './pages/VocabUnitScreen'
import WordScreen from './pages/WordScreen'
import VocabExerciseScreen from './pages/VocabExerciseScreen'
import TypeWordScreen from './pages/TypeWordScreen'
import TypeNameScreen from './pages/TypeNameScreen'
import NameSpelling from './pages/NameSpelling'
import NameLesson from './pages/NameLesson'
import LessonPlaceholder from './pages/LessonPlaceholder'
import Kit from './pages/Kit'
import PuzzleScreen from './pages/PuzzleScreen'
import { RouteEffects } from './components/RouteEffects'
import ReviewScreen from './pages/ReviewScreen'
import ConnectedReadingScreen from './pages/ConnectedReadingScreen'
import WordBridgesScreen from './pages/WordBridgesScreen'
import { PersistenceNotice } from './components/PersistenceNotice'

export default function App() {
  return (
    <HashRouter>
      <PersistenceNotice />
      <RouteEffects />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lesson/alphabet" element={<AlphabetLesson />} />
        <Route path="/lesson/alphabet/intro" element={<Orientation />} />
        <Route path="/lesson/alphabet/bogstav/:id" element={<LetterScreen />} />
        <Route path="/lesson/alphabet/vokaltegn" element={<VowelMarksScreen />} />
        <Route path="/lesson/alphabet/ovelse/:kind" element={<ExerciseScreen />} />
        <Route path="/lesson/alphabet/gave/:n" element={<BonusScreen />} />
        {/* The grade-1 word units. Any unit, any word, any time — no gating. */}
        <Route path="/lesson/ord/:unit" element={<VocabUnitScreen />} />
        <Route path="/lesson/ord/:unit/ovelse/:kind" element={<VocabExerciseScreen />} />
        {/* Static before dynamic: «skriv» is the typing round, never a word id. */}
        <Route path="/lesson/ord/:unit/skriv" element={<TypeWordScreen />} />
        <Route path="/lesson/ord/:unit/laes/:reading" element={<ConnectedReadingScreen />} />
        <Route path="/lesson/ord/:unit/:word" element={<WordScreen />} />
        <Route path="/puslespil/:id" element={<PuzzleScreen />} />
        <Route path="/repetition" element={<ReviewScreen />} />
        <Route path="/ord-der-ligner" element={<WordBridgesScreen />} />
        {/* The learner's own name: how it is spelled, and the lesson that
            teaches it. Both send a learner without a name back to the forside. */}
        <Route path="/dit-navn" element={<NameSpelling />} />
        <Route path="/lesson/navn" element={<NameLesson />} />
        {/* The capstone. Dormant without a spelling this keyboard can write. */}
        <Route path="/lesson/navn/skriv" element={<TypeNameScreen />} />
        <Route path="/lesson/:id" element={<LessonPlaceholder />} />
        {/* Review surface for the design kit — direct URL only, never linked from home. */}
        <Route path="/kit" element={<Kit />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}
