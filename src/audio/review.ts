import generatedRows from './review.generated.json'

export interface AudioReviewRow {
  status: 'unreviewed'
  clipId: string
  entryId: string
  formId: string
  register: 'neutral' | 'everyday' | 'formal'
  domain: string
  transcript: string
  danishMeaning: string
  soundDa: string
  ipa: string
  file: string
  fileSha256: string
  durationMs: number
  integratedLufs: number
  truePeakDbtp: number
  sourceTextHash: string
  voiceModel: string
}

export const audioReviewRows = generatedRows as AudioReviewRow[]
