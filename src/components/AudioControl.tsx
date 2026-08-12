import { useEffect, useRef, useState } from 'react'
import { findPronunciationAudio, pronunciationAudioUrl } from '../audio/manifest'
import { activateAudio, releaseAudio } from '../audio/playback'
import './AudioControl.css'

const NORMAL_PLAYBACK_RATE = 1
const PLAYBACK_OPTIONS = [
  { rate: NORMAL_PLAYBACK_RATE, label: 'Normal 1×' },
  { rate: 0.8, label: 'Langsom 0,8×' },
  { rate: 0.5, label: 'Meget langsom 0,5×' },
] as const

/** Some browsers restore 1× while a preload="none" resource starts loading. */
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
  const selectedRate = useRef(NORMAL_PLAYBACK_RATE)
  const [playbackRate, setPlaybackRate] = useState(NORMAL_PLAYBACK_RATE)
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

  const sourceUrl = pronunciationAudioUrl(row.file)

  async function replay(rate = selectedRate.current) {
    const node = audio.current
    if (!node) return
    if (node.getAttribute('src') !== sourceUrl) node.src = sourceUrl
    activateAudio(node)
    node.currentTime = 0
    applyPlaybackRate(node, rate)
    try {
      await node.play()
      applyPlaybackRate(node, rate)
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

  function chooseSpeed(rate: number) {
    selectedRate.current = rate
    setPlaybackRate(rate)
    void replay(rate)
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
        onPause={() => setPlaying(false)}
        onEnded={stop}
        onPlaying={() => {
          const node = audio.current
          if (node) applyPlaybackRate(node, selectedRate.current)
        }}
      />
      <button type="button" aria-label={`Hør ${row.transcript}`} onClick={() => void replay()}>
        {playing ? 'Afspiller' : played ? 'Hør igen' : 'Hør'}
      </button>
      <button type="button" aria-label={`Stop lyden for ${row.transcript}`} disabled={!playing} onClick={stop}>
        Stop
      </button>
      {PLAYBACK_OPTIONS.map((option) => (
        <button
          type="button"
          aria-pressed={playbackRate === option.rate}
          onClick={() => chooseSpeed(option.rate)}
          key={option.rate}
        >{option.label}</button>
      ))}
      <button type="button" aria-pressed={muted} aria-label={muted ? 'Slå udtalelyd til' : 'Slå udtalelyd fra'} onClick={toggleMute}>
        {muted ? 'Lyd til' : 'Lyd fra'}
      </button>
      {failed && <span role="status">Lyden virker ikke. Du kan stadig se hjælpen.</span>}
    </div>
  )
}
