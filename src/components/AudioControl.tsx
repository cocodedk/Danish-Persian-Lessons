import { useEffect, useRef, useState } from 'react'
import { findPronunciationAudio, pronunciationAudioUrl } from '../audio/manifest'
import { activateAudio, releaseAudio } from '../audio/playback'
import './AudioControl.css'

export function AudioControl({
  audioId,
  onPlay,
}: {
  audioId?: string
  onPlay?: () => void
}) {
  const row = findPronunciationAudio(audioId)
  const audio = useRef<HTMLAudioElement>(null)
  const [slow, setSlow] = useState(false)
  const [muted, setMuted] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [played, setPlayed] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => () => {
    const node = audio.current
    if (node) node.pause()
    if (node) releaseAudio(node)
  }, [])

  if (!row) return null

  async function replay() {
    const node = audio.current
    if (!node) return
    activateAudio(node)
    node.currentTime = 0
    node.playbackRate = slow ? 0.8 : 1
    try {
      await node.play()
      setPlaying(true)
      setPlayed(true)
      setFailed(false)
      onPlay?.()
    } catch {
      releaseAudio(node)
      setPlaying(false)
      setFailed(true)
    }
  }

  function stop() {
    const node = audio.current
    if (!node) return
    node.pause()
    node.currentTime = 0
    releaseAudio(node)
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
      <audio
        ref={audio}
        preload="none"
        src={pronunciationAudioUrl(row.file)}
        onPause={() => setPlaying(false)}
        onEnded={stop}
      />
      <button type="button" aria-label={`Hør ${row.transcript}`} onClick={replay}>
        {playing ? 'Afspiller' : played ? 'Hør igen' : 'Hør'}
      </button>
      <button type="button" aria-label={`Stop lyden for ${row.transcript}`} disabled={!playing} onClick={stop}>
        Stop
      </button>
      <button type="button" aria-pressed={!slow} onClick={() => chooseSpeed(false)}>Normal 1×</button>
      <button type="button" aria-pressed={slow} onClick={() => chooseSpeed(true)}>
        Langsom 0,8×
      </button>
      <button type="button" aria-pressed={muted} aria-label={muted ? 'Slå udtalelyd til' : 'Slå udtalelyd fra'} onClick={toggleMute}>
        {muted ? 'Lyd til' : 'Lyd fra'}
      </button>
      {failed && <span role="status">Lyden virker ikke. Du kan stadig se hjælpen.</span>}
    </div>
  )
}
