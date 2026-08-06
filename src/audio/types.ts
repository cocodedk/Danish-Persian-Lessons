export interface PronunciationAudio {
  entryId: string
  file: string
  locale: 'fa-IR'
  speakerId: string
  transcript: string
  durationMs: number
  channels: 1
  integratedLufs: number
  truePeakDbtp: number
  loudnessReportRef: string
  /** Required only when the file exceeds the 100 KB target. */
  sizeException?: string
  reviewedBy: string[]
  consentRef: string
  license: string
}
