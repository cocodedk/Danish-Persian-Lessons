import { useEffect, useRef, useState } from 'react'
import { findPronunciationAudio, pronunciationAudioUrl } from '../audio/manifest'
import { activateAudio, releaseAudio } from '../audio/playback'
import './AudioControl.css'

const NORMAL_PLAYBACK_RATE = 1
const SLOW_PLAYBACK_RATE = 0.8

function applyPlaybackRate(node: HTMLMediaElement, rate: number): void {
  node.defaultPlaybackRate = rate
  node.playbackRate = rate
  node.preservesPitch = true
}

export interface AudioControlSource {
  file: string
  transcript: string
}

export function AudioControl({
  audioId,
  source,
  onPlay,
}: {
  audioId?: string
  source?: AudioControlSource
  onPlay?: () => void
}) {
  const row = source ?? findPronunciationAudio(audioId)
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

  async function replay(rate = slow ? SLOW_PLAYBACK_RATE : NORMAL_PLAYBACK_RATE) {
    const node = audio.current
    if (!node) return
    activateAudio(node)
    node.currentTime = 0
    applyPlaybackRate(node, rate)
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
    void replay(value ? SLOW_PLAYBACK_RATE : NORMAL_PLAYBACK_RATE)
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
      <button type="button" aria-label={`Hør ${row.transcript}`} onClick={() => void replay()}>
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
