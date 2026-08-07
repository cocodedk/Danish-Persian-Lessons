import { useEffect, useRef, useState } from 'react'
import { findPronunciationAudio } from '../audio/manifest'
import './AudioControl.css'

let activeAudio: HTMLAudioElement | null = null

export function AudioControl({ audioId }: { audioId?: string }) {
  const row = findPronunciationAudio(audioId)
  const audio = useRef<HTMLAudioElement>(null)
  const [slow, setSlow] = useState(false)
  const [muted, setMuted] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => () => {
    const node = audio.current
    if (node) node.pause()
    if (activeAudio === node) activeAudio = null
  }, [])

  if (!row) return null

  async function replay() {
    const node = audio.current
    if (!node) return
    if (activeAudio && activeAudio !== node) activeAudio.pause()
    activeAudio = node
    node.currentTime = 0
    node.playbackRate = slow ? 0.8 : 1
    try {
      await node.play()
      setPlaying(true)
      setFailed(false)
    } catch {
      if (activeAudio === node) activeAudio = null
      setPlaying(false)
      setFailed(true)
    }
  }

  function stop() {
    const node = audio.current
    if (!node) return
    node.pause()
    node.currentTime = 0
    if (activeAudio === node) activeAudio = null
    setPlaying(false)
  }

  function chooseSpeed(value: boolean) {
    setSlow(value)
    if (audio.current) audio.current.playbackRate = value ? 0.8 : 1
  }

  function toggleMute() {
    const value = !muted
    setMuted(value)
    if (audio.current) audio.current.muted = value
  }

  return (
    <div className="audio-control">
      {/* `preload="none"` is the privacy/performance contract: the corpus is
          fetched only after the learner explicitly asks to hear a clip. */}
      <audio ref={audio} preload="none" src={row.file} onPause={() => setPlaying(false)} onEnded={stop} />
      <button type="button" aria-label={`Afspil udtale af ${row.transcript}`} onClick={replay}>
        {playing ? 'Afspiller' : 'Hør igen'}
      </button>
      <button type="button" aria-label={`Stop udtale af ${row.transcript}`} disabled={!playing} onClick={stop}>
        Stop
      </button>
      <button type="button" aria-pressed={!slow} onClick={() => chooseSpeed(false)}>Normal 1×</button>
      <button type="button" aria-pressed={slow} onClick={() => chooseSpeed(true)}>
        Langsom 0,8×
      </button>
      <button type="button" aria-pressed={muted} aria-label={muted ? 'Slå udtalelyd til' : 'Slå udtalelyd fra'} onClick={toggleMute}>
        {muted ? 'Lyd til' : 'Lyd fra'}
      </button>
      {failed && <span role="status">Lyden kunne ikke afspilles. Du kan stadig læse hjælpen.</span>}
    </div>
  )
}
