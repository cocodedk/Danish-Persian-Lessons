import { readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'

const root = new URL('..', import.meta.url).pathname
const imageDir = join(root, 'public', 'lesson-images')
const manifestPath = join(root, 'src', 'images', 'lesson-images.json')
const expectedIds = ['ab', 'dar', 'gol', 'ketab', 'khane', 'medad', 'miz', 'nan']
const errors = []

function fail(message) {
  errors.push(message)
}

function jpegInfo(bytes, filename) {
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) return fail(`${filename}: ikke en JPEG`)
  let offset = 2
  let size
  while (offset + 4 <= bytes.length) {
    while (bytes[offset] === 0xff) offset += 1
    const marker = bytes[offset++]
    if (marker === 0xd9 || marker === 0xda) break
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue
    const length = bytes.readUInt16BE(offset)
    const payload = offset + 2
    if (length < 2 || payload + length - 2 > bytes.length) {
      fail(`${filename}: brudt JPEG-del`)
      break
    }
    if ([0xe1, 0xe2, 0xed, 0xfe].includes(marker)) {
      fail(`${filename}: har EXIF, ICC, XMP, IPTC eller kommentar`)
    }
    const isSof = marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)
    if (isSof) {
      size = { height: bytes.readUInt16BE(payload + 1), width: bytes.readUInt16BE(payload + 3) }
    }
    offset += length
  }
  if (!size) fail(`${filename}: JPEG-størrelse blev ikke fundet`)
  return size
}

function webpInfo(bytes, filename) {
  if (bytes.toString('ascii', 0, 4) !== 'RIFF' || bytes.toString('ascii', 8, 12) !== 'WEBP') {
    return fail(`${filename}: ikke en WebP`)
  }
  let offset = 12
  let size
  while (offset + 8 <= bytes.length) {
    const chunk = bytes.toString('ascii', offset, offset + 4)
    const length = bytes.readUInt32LE(offset + 4)
    const payload = offset + 8
    if (['EXIF', 'XMP ', 'ICCP', 'ANIM', 'ANMF'].includes(chunk)) {
      fail(`${filename}: har metadata eller bevægelse (${chunk.trim()})`)
    }
    if (chunk === 'VP8 ' && bytes.toString('hex', payload + 3, payload + 6) === '9d012a') {
      size = {
        width: bytes.readUInt16LE(payload + 6) & 0x3fff,
        height: bytes.readUInt16LE(payload + 8) & 0x3fff,
      }
    } else if (chunk === 'VP8L' && bytes[payload] === 0x2f) {
      const bits = bytes.readUInt32LE(payload + 1)
      size = { width: (bits & 0x3fff) + 1, height: ((bits >>> 14) & 0x3fff) + 1 }
    } else if (chunk === 'VP8X') {
      size = {
        width: bytes.readUIntLE(payload + 4, 3) + 1,
        height: bytes.readUIntLE(payload + 7, 3) + 1,
      }
    }
    offset = payload + length + (length % 2)
  }
  if (!size) fail(`${filename}: WebP-størrelse blev ikke fundet`)
  return size
}

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
const ids = manifest.images.map((image) => image.id).sort()
if (JSON.stringify(ids) !== JSON.stringify(expectedIds)) fail('Kataloget skal have de otte pilotbilleder')

const listedFiles = new Set()
const entryIds = new Set()
for (const image of manifest.images) {
  if (image.ownerReview !== 'pending' && image.ownerReview !== 'approved') {
    fail(`${image.id}: ejerens reviewstatus mangler`)
  }
  for (const field of [
    'creator', 'sourceName', 'sourcePage', 'license', 'licenseUrl', 'downloadedAt',
    'originalSha256', 'rightsReviewedBy', 'altDa', 'creditId',
  ]) {
    if (!image[field]) fail(`${image.id}: ${field} mangler`)
  }
  if (!/^[a-f0-9]{64}$/.test(image.originalSha256)) fail(`${image.id}: SHA-256 er ikke gyldig`)
  if (image.peopleOrPrivateProperty !== 'none') fail(`${image.id}: pilotbilledet er ikke lav risiko`)
  if (image.purpose !== 'meaning-model') fail(`${image.id}: forkert formål`)
  if (image.width !== 960 || image.height !== 720) fail(`${image.id}: forkert grundstørrelse`)
  if (image.variants.length !== 2) fail(`${image.id}: skal have to størrelser`)
  for (const entryId of image.entryIds) {
    if (entryIds.has(entryId)) fail(`${entryId}: bruges af mere end ét billede`)
    entryIds.add(entryId)
  }
  for (const variant of image.variants) {
    const expectedHeight = variant.width * 0.75
    if (![480, 960].includes(variant.width) || variant.height !== expectedHeight) {
      fail(`${image.id}: forkert variantstørrelse`)
    }
    for (const [format, filename] of [['jpeg', variant.jpeg], ['webp', variant.webp]]) {
      if (/[:/\\]/.test(filename) || !filename.endsWith(format === 'jpeg' ? '.jpg' : '.webp')) {
        fail(`${image.id}: usikker eller forkert filsti ${filename}`)
        continue
      }
      listedFiles.add(filename)
      const bytes = await readFile(join(imageDir, filename)).catch(() => null)
      if (!bytes) {
        fail(`${filename}: mangler`)
        continue
      }
      const limit = variant.width === 480 ? 60 * 1024 : 140 * 1024
      if (bytes.length > limit) fail(`${filename}: ${bytes.length} bytes er over grænsen ${limit}`)
      const actual = format === 'jpeg' ? jpegInfo(bytes, filename) : webpInfo(bytes, filename)
      if (actual && (actual.width !== variant.width || actual.height !== variant.height)) {
        fail(`${filename}: er ${actual.width}×${actual.height}, ikke ${variant.width}×${variant.height}`)
      }
    }
  }
}

const diskFiles = (await readdir(imageDir)).sort()
const catalogFiles = [...listedFiles].sort()
if (JSON.stringify(diskFiles) !== JSON.stringify(catalogFiles)) {
  fail('Mappen og kataloget har ikke de samme billedfiler')
}

if (errors.length) {
  for (const error of errors) console.error(`FAIL: ${error}`)
  process.exit(1)
}
console.log(`PASS: ${manifest.images.length} lokale billeder, ${diskFiles.length} varianter, ingen skjult metadata`)
