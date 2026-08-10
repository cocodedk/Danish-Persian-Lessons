import { useEffect, useRef, useState } from 'react'
import { activateAudio, releaseAudio, stopActiveAudio } from '../audio/playback'
import './VoiceRecorder.css'

type RecorderState = 'idle' | 'asking' | 'recording' | 'ready' | 'failed'

function stopTracks(stream: MediaStream | null): void {
  stream?.getTracks().forEach((track) => track.stop())
}

export function VoiceRecorder() {
  const [state, setState] = useState<RecorderState>('idle')
  const [recordingUrl, setRecordingUrl] = useState<string>()
  const recorder = useRef<MediaRecorder | null>(null)
  const stream = useRef<MediaStream | null>(null)
  const chunks = useRef<Blob[]>([])
  const timeout = useRef<number | undefined>(undefined)
  const playback = useRef<HTMLAudioElement>(null)
  const currentUrl = useRef<string | undefined>(undefined)
  const mounted = useRef(true)

  function clearTimer() {
    if (timeout.current !== undefined) window.clearTimeout(timeout.current)
    timeout.current = undefined
  }

  function clearRecording() {
    const audio = playback.current
    if (audio) {
      audio.pause()
      releaseAudio(audio)
    }
    if (currentUrl.current) URL.revokeObjectURL(currentUrl.current)
    currentUrl.current = undefined
    setRecordingUrl(undefined)
    setState('idle')
  }

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      clearTimer()
      if (recorder.current?.state === 'recording') recorder.current.stop()
      stopTracks(stream.current)
      if (playback.current) releaseAudio(playback.current)
      if (currentUrl.current) URL.revokeObjectURL(currentUrl.current)
    }
  }, [])

  async function start() {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setState('failed')
      return
    }
    clearRecording()
    stopActiveAudio()
    setState('asking')
    try {
      const nextStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      if (!mounted.current) {
        stopTracks(nextStream)
        return
      }
      stream.current = nextStream
      const nextRecorder = new MediaRecorder(nextStream)
      recorder.current = nextRecorder
      chunks.current = []
      nextRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.current.push(event.data)
      }
      nextRecorder.onstop = () => {
        clearTimer()
        stopTracks(stream.current)
        stream.current = null
        if (!mounted.current) return
        const blob = new Blob(chunks.current, { type: nextRecorder.mimeType })
        if (blob.size === 0) {
          setState('failed')
          return
        }
        const url = URL.createObjectURL(blob)
        currentUrl.current = url
        setRecordingUrl(url)
        setState('ready')
      }
      nextRecorder.start()
      setState('recording')
      timeout.current = window.setTimeout(() => {
        if (nextRecorder.state === 'recording') nextRecorder.stop()
      }, 20_000)
    } catch {
      stopTracks(stream.current)
      stream.current = null
      if (mounted.current) setState('failed')
    }
  }

  function stop() {
    if (recorder.current?.state === 'recording') recorder.current.stop()
  }

  async function hearMyself() {
    const audio = playback.current
    if (!audio) return
    activateAudio(audio)
    audio.currentTime = 0
    try {
      await audio.play()
    } catch {
      releaseAudio(audio)
      setState('failed')
    }
  }

  return (
    <section className="voice-recorder" aria-labelledby="voice-recorder-title">
      <h2 id="voice-recorder-title">Sig det selv</h2>
      <p>Din stemme bliver her og slettes, når du går videre.</p>
      {recordingUrl && (
        <audio
          ref={playback}
          src={recordingUrl}
          preload="metadata"
          onEnded={() => playback.current && releaseAudio(playback.current)}
        />
      )}
      <div className="voice-recorder__actions">
        {(state === 'idle' || state === 'failed') && <button type="button" onClick={start}>Optag mig</button>}
        {state === 'asking' && <button type="button" disabled>Venter på mikrofonen</button>}
        {state === 'recording' && <button type="button" onClick={stop}>Stop</button>}
        {state === 'ready' && <button type="button" onClick={hearMyself}>Hør mig</button>}
        {state === 'ready' && <button type="button" onClick={start}>Optag igen</button>}
        {state === 'ready' && <button type="button" onClick={clearRecording}>Slet</button>}
      </div>
      {state === 'recording' && <p role="status">Optager …</p>}
      {state === 'failed' && <p role="status">Mikrofonen virker ikke her. Sig ordet højt, og hør lyden igen.</p>}
    </section>
  )
}
