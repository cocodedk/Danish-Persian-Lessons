export type LessonImagePurpose = 'meaning-model' | 'post-reading-context'

export interface LessonImageSourceReview {
  id: string
  entryIds: string[]
  creator: string
  sourceName: string
  sourceTitle: string
  sourcePage: string
  license: string
  licenseUrl: string
  downloadedAt: string
  originalSha256: string
  edits: string[]
  peopleOrPrivateProperty: 'none' | 'release-recorded' | 'rejected'
  rightsReviewedBy: string
  ownerReview: 'pending' | 'approved'
}

export interface LessonImage {
  id: string
  entryIds: string[]
  purpose: LessonImagePurpose
  altDa: string
  creditId: string
  width: 960
  height: 720
  focalPoint: `${number}% ${number}%`
  sources: Array<{
    type: 'image/webp' | 'image/jpeg'
    srcSet: string
  }>
}
