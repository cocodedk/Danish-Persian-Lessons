import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { VoiceRecorder } from './VoiceRecorder'

const mediaDevices = Object.getOwnPropertyDescriptor(navigator, 'mediaDevices')
const createObjectURLDescriptor = Object.getOwnPropertyDescriptor(URL, 'createObjectURL')
const revokeObjectURLDescriptor = Object.getOwnPropertyDescriptor(URL, 'revokeObjectURL')

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  if (mediaDevices) Object.defineProperty(navigator, 'mediaDevices', mediaDevices)
  else Reflect.deleteProperty(navigator, 'mediaDevices')
  if (createObjectURLDescriptor) Object.defineProperty(URL, 'createObjectURL', createObjectURLDescriptor)
  else Reflect.deleteProperty(URL, 'createObjectURL')
  if (revokeObjectURLDescriptor) Object.defineProperty(URL, 'revokeObjectURL', revokeObjectURLDescriptor)
  else Reflect.deleteProperty(URL, 'revokeObjectURL')
})

describe('voice recorder', () => {
  it('keeps the speaking task usable without recording support', () => {
    vi.stubGlobal('MediaRecorder', undefined)
    render(<VoiceRecorder />)
    fireEvent.click(screen.getByRole('button', { name: 'Optag mig' }))
    expect(screen.getByRole('status')).toHaveTextContent('Sig ordet højt')
  })

  it('records, replays, and deletes only an in-memory blob', async () => {
    const stopTrack = vi.fn()
    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: { getUserMedia: vi.fn().mockResolvedValue({ getTracks: () => [{ stop: stopTrack }] }) },
    })
    const createObjectURL = vi.fn(() => 'blob:voice')
    const revokeObjectURL = vi.fn()
    Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: createObjectURL })
    Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: revokeObjectURL })

    class FakeMediaRecorder {
      state = 'inactive'
      mimeType = 'audio/webm'
      ondataavailable: ((event: BlobEvent) => void) | null = null
      onstop: ((event: Event) => void) | null = null
      start() { this.state = 'recording' }
      stop() {
        this.state = 'inactive'
        this.ondataavailable?.({ data: new Blob(['voice']) } as BlobEvent)
        this.onstop?.(new Event('stop'))
      }
    }
    vi.stubGlobal('MediaRecorder', FakeMediaRecorder)
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue()
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined)

    render(<VoiceRecorder />)
    fireEvent.click(screen.getByRole('button', { name: 'Optag mig' }))
    expect(await screen.findByText('Optager …')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Stop' }))
    expect(await screen.findByRole('button', { name: 'Hør mig' })).toBeInTheDocument()
    expect(createObjectURL).toHaveBeenCalledOnce()
    expect(stopTrack).toHaveBeenCalledOnce()

    fireEvent.click(screen.getByRole('button', { name: 'Hør mig' }))
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledOnce()
    fireEvent.click(screen.getByRole('button', { name: 'Slet' }))
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:voice')
    expect(window.localStorage).toHaveLength(0)
  })

  it('stops a microphone stream granted after the page was left', async () => {
    const stopTrack = vi.fn()
    let grant: (stream: MediaStream) => void = () => undefined
    const request = new Promise<MediaStream>((resolve) => {
      grant = resolve
    })
    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: { getUserMedia: vi.fn(() => request) },
    })
    vi.stubGlobal('MediaRecorder', class FakeMediaRecorder {})

    const { unmount } = render(<VoiceRecorder />)
    fireEvent.click(screen.getByRole('button', { name: 'Optag mig' }))
    unmount()
    grant({
      getTracks: () => [{ stop: stopTrack }],
    } as unknown as MediaStream)

    await waitFor(() => expect(stopTrack).toHaveBeenCalledOnce())
  })
})
