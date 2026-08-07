import { contentReviewManifest } from './contentManifest'

export const audioRecordingQueue = {
  schemaVersion: 1,
  status: 'draft-awaiting-content-approval',
  source: 'src/reviews/contentManifest.ts',
  instructions: 'Do not record a row until its Persian, IPA, stress, and transcript are approved.',
  rows: contentReviewManifest.rows
    .filter((row) => row.audioStatus === 'missing')
    .map((row) => ({
      entryId: row.id,
      domain: row.domain,
      transcript: row.faMarked ?? row.fa,
      plainPersian: row.fa,
      danishMeaning: row.da,
      soundDa: row.soundDa,
      ipa: row.ipa,
      stressMarked: row.stressMarked,
      expectedFile: `/audio/${row.id}.mp3`,
      requiredBeforeRecording: ['iranian-persian-1', 'iranian-persian-2', 'phonetics'],
      requiredTakeReview: ['iranian-persian-2', 'phonetics'],
    })),
}
