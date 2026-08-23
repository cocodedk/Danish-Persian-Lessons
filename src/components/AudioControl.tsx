import { useCallback, useEffect, useRef, useState } from 'react'
import { findPronunciationAudio, pronunciationAudioUrl } from '../audio/manifest'
import { activateAudio, releaseAudio } from '../audio/playback'
import './AudioControl.css'
const NORMAL_PLAYBACK_RATE = 1
const PLAYBACK_OPTIONS = [
  { rate: NORMAL_PLAYBACK_RATE, label: 'Normal 1×', short: '1×' },
  { rate: 0.8, label: 'Langsom 0,8×', short: '0,8×' },
  { rate: 0.5, label: 'Meget langsom 0,5×', short: '0,5×' },
] as const

/** Some browsers restore 1× while a preload="none" resource starts loading. */
function applyPlaybackRate(node: HTMLMediaElement, rate: number): void {
  node.defaultPlaybackRate = rate
  node.playbackRate = rate
  node.preservesPitch = true
}

export type AudioControlSource = { file: string; transcript: string }
export function AudioControl({ audioId, source, onPlay, playRequest }: {
  audioId?: string
  source?: AudioControlSource
  onPlay?: () => void
  /** Monotonic counter: each increase is one deliberate request to hear the clip.
   *  Undefined or zero is "nobody asked", so nothing is fetched or played. */
  playRequest?: number
}) {
  const row = source ?? findPronunciationAudio(audioId)
  const sourceUrl = row ? pronunciationAudioUrl(row.file) : undefined
  const audio = useRef<HTMLAudioElement>(null)
  const selectedRate = useRef(NORMAL_PLAYBACK_RATE)
  const [playbackRate, setPlaybackRate] = useState(NORMAL_PLAYBACK_RATE)
  const [muted, setMuted] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [played, setPlayed] = useState(false)
  const [failed, setFailed] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const servedRequest = useRef(0)
  const mounted = useRef(true)
  /** Only the live token may report; `heard` deduplicates its witnesses. */
  type Attempt = { heard: boolean; ended: boolean }
  const live = useRef<Attempt | null>(null)

  /** A start is witnessed twice in browser-dependent order: the native `playing`
   *  event and the settled play() promise. Whichever is first proves it sounded. */
  const report = useCallback((id: Attempt | null) => {
    if (!id || id !== live.current || id.heard) return
    id.heard = true
    if (!id.ended) setPlaying(true)
    setPlayed(true)
    onPlay?.()
  }, [onPlay])

  useEffect(() => {
    mounted.current = true
    // Captured on mount: React detaches the ref before this cleanup runs.
    const node = audio.current
    return () => {
      mounted.current = false
      live.current = null
      servedRequest.current = 0
      if (node) { node.pause(); releaseAudio(node) }
    }
  }, [])

  const replay = useCallback(async (rate = selectedRate.current) => {
    const node = audio.current
    if (!node || !sourceUrl) return
    const id: Attempt = { heard: false, ended: false }
    live.current = id
    if (node.getAttribute('src') !== sourceUrl) node.src = sourceUrl
    activateAudio(node)
    node.currentTime = 0
    applyPlaybackRate(node, rate)
    // The learner asked now, so the transport says so before the browser settles.
    setPlaying(true)
    setFailed(false)
    try {
      await node.play()
      // The learner left mid-start: retire the node, report to nobody.
      if (!mounted.current) { node.pause(); releaseAudio(node); return }
      // A superseded or stopped attempt owns nothing: no pause, re-rate or claim.
      if (live.current !== id) return
      applyPlaybackRate(node, rate)
      report(id)
    } catch {
      // The shared active audio now belongs to the newer attempt: a stale
      // rejection must neither release it nor cry failure over live sound.
      if (live.current !== id) return
      // A clip already heard cannot have failed: its natural finish is what aborts
      // the pending play(). Release (a no-op unless this attempt owns the node).
      releaseAudio(node)
      if (id.heard) return
      if (!mounted.current) return
      setPlaying(false)
      setFailed(true)
    }
  }, [sourceUrl, report])

  /** Only a fresh, higher request replays: a new callback identity is not an ask.
   *  Delivery waits one microtask owned by this effect, so StrictMode's mount
   *  rehearsal — setup, cleanup, setup — cancels before any play() instead of
   *  pausing a started one into an AbortError; the surviving effect asks exactly once.
   *  The cancel also covers unmount or a dependency change mid-flight, and
   *  `servedRequest` rises at delivery, so a cancelled ask stays owed. Direct clicks
   *  on the play, speed or replay buttons call `replay` and are never delayed. */
  useEffect(() => {
    if (!playRequest || playRequest <= servedRequest.current) return
    let cancelled = false
    queueMicrotask(() => {
      if (cancelled || playRequest <= servedRequest.current) return
      servedRequest.current = playRequest
      void replay()
    })
    return () => { cancelled = true }
  }, [playRequest, replay])

  if (!row) return null

  /** Natural completion, which is not a stop: pausing or rewinding here is what
   *  aborts the still-settling play(), and cancelling the token would discard a start
   *  the learner heard. Only the transport and the shared slot let go, so
   *  `heard`/`played` survive as the "Hør igen" offer. */
  function finish() {
    const node = audio.current
    if (live.current?.heard) live.current.ended = true
    if (node) releaseAudio(node)
    setPlaying(false)
  }

  function stop() {
    const node = audio.current
    if (!node) return
    // Stopping retires any pending attempt: no later witness may revive it.
    live.current = null
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
    setMuted(!muted)
    if (audio.current) audio.current.muted = !muted
  }
  return (
    <div className="audio-control">
      {/* `preload="none"`: the corpus is fetched only when a learner asks. */}
      <audio
        ref={audio}
        preload="none"
        onPause={() => setPlaying(false)}
        onEnded={finish}
        onPlaying={() => {
          const node = audio.current
          if (node) applyPlaybackRate(node, selectedRate.current)
          report(live.current)
        }}
      />
      {/* The play label grows to "Afspiller"/"Hør igen", so the transport reserves
          the longest up front (see the CSS): no row reflow. */}
      {!expanded && (<>
        <button type="button" className="audio-control__transport audio-control__play"
          aria-label={`Hør ${row.transcript}`} onClick={() => void replay()}
        ><span>{playing ? 'Afspiller' : played ? 'Hør igen' : 'Hør'}</span></button>
        <button type="button" className="audio-control__transport" disabled={!playing}
          aria-label={`Stop lyden for ${row.transcript}`} onClick={stop}
        >Stop</button>
        <button type="button" className="audio-control__transport audio-control__more"
          aria-expanded="false" aria-label="Flere lydvalg" onClick={() => setExpanded(true)}
        >Lydvalg</button>
      </>)}
      {/* The hi-fi bank replaces the transport in the same one-row footprint. */}
      {expanded && (
        <div className="audio-control__advanced">
          <div role="group" aria-label="Tempo" className="audio-control__speeds">
            {PLAYBACK_OPTIONS.map((option) => (
              <button type="button" key={option.rate} aria-label={option.label}
                aria-pressed={playbackRate === option.rate} onClick={() => chooseSpeed(option.rate)}
              >{option.short}</button>
            ))}
          </div>
          <button type="button" disabled={!playing} aria-label={`Stop lyden for ${row.transcript}`}
            onClick={stop}>Stop</button>
          <button type="button" aria-pressed={muted} onClick={toggleMute}
            aria-label={muted ? 'Slå udtalelyd til' : 'Slå udtalelyd fra'}>Lyd</button>
          <button type="button" aria-expanded="true" aria-label="Luk lydvalg"
            onClick={() => setExpanded(false)}>Luk</button>
        </div>
      )}
      {failed && <span role="status">Lyden virker ikke. Du kan stadig se hjælpen.</span>}
    </div>
  )
}
