interface AudioBase {
  clipId: string
  entryId: string
  formId: string
  file: string
  locale: 'fa-IR'
  transcript: string
  durationMs: number
  channels: 1
  integratedLufs: number
  truePeakDbtp: number
  loudnessReportRef: string
  sizeException?: string
  reviewedBy: string[]
  license: string
}

export interface GeneratedPronunciationAudio extends AudioBase {
  source: 'piper'
  engineVersion: string
  voiceModel: string
  modelSha256: string
  synthesisText: string
  sourceTextHash: string
}

export interface HumanPronunciationAudio extends AudioBase {
  source: 'human'
  speakerId: string
  consentRef: string
}

export type PronunciationAudio =
  | GeneratedPronunciationAudio
  | HumanPronunciationAudio
