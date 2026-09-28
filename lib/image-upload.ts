export const MAX_IMAGE_BYTES = 1_500_000
export const MAX_IMAGE_DIMENSION = 16_000
export const MAX_IMAGE_DATA_URL_CHARS = 2_400_000

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

export type ImageSanitizeResult =
  | { ok: true; changed: boolean; value: string | null }
  | { ok: false; error: string }

export function sanitizeImageDataUrl(input: string | null | undefined): ImageSanitizeResult {
  if (input === undefined) return { ok: true, changed: false, value: null }
  if (input === null || input.trim() === '') return { ok: true, changed: true, value: null }

  const parsed = parseDataUrl(input)
  if (!parsed.ok) return parsed

  const detected = detectImage(parsed.bytes)
  if (!detected.ok) return detected

  if (parsed.mime !== detected.mime) {
    return { ok: false, error: 'Vrsta slike v zaglavju se ne ujema z vsebino.' }
  }

  const canonical = detected.bytes.subarray(0, detected.endIndex)
  const value = `data:${detected.mime};base64,${canonical.toString('base64')}`
  if (value.length > MAX_IMAGE_DATA_URL_CHARS) {
    return { ok: false, error: 'Slika je prevelika (največ 1,5 MB).' }
  }
  return { ok: true, changed: true, value }
}

type DataUrlParse = { ok: true; mime: string; bytes: Buffer } | { ok: false; error: string }

function parseDataUrl(input: string): DataUrlParse {
  if (!input.startsWith('data:')) {
    return { ok: false, error: 'Slika mora biti naložena kot podatkovni URL.' }
  }

  const match = /^data:([a-zA-Z0-9.+\-/]+);base64,([A-Za-z0-9+/=\s]+)$/.exec(input)
  if (!match) {
    return { ok: false, error: 'Nepravilen format slike.' }
  }

  const mime = match[1].toLowerCase()
  if (!ALLOWED.has(mime)) {
    return { ok: false, error: 'Dovoljene vrste slik: JPEG, PNG, WebP in GIF.' }
  }

  const b64 = match[2].replace(/\s+/g, '')
  const bytes = Buffer.from(b64, 'base64')
  if (bytes.length === 0) return { ok: false, error: 'Slika je prazna.' }
  if (bytes.length > MAX_IMAGE_BYTES) {
    return { ok: false, error: 'Slika je prevelika (največ 1,5 MB).' }
  }
  return { ok: true, mime, bytes }
}

type DetectResult = { ok: true; mime: string; bytes: Buffer; endIndex: number } | { ok: false; error: string }

function detectImage(bytes: Buffer): DetectResult {
  const size = bytes.length
  let mime: string | null = null

  if (size >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    mime = 'image/jpeg'
  } else if (
    size >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    mime = 'image/png'
  } else if (
    size >= 6 &&
    (bytes.slice(0, 6).toString('ascii') === 'GIF87a' || bytes.slice(0, 6).toString('ascii') === 'GIF89a')
  ) {
    mime = 'image/gif'
  } else if (
    size >= 12 &&
    bytes.slice(0, 4).toString('ascii') === 'RIFF' &&
    bytes.slice(8, 12).toString('ascii') === 'WEBP'
  ) {
    mime = 'image/webp'
  }

  if (!mime) {
    return { ok: false, error: 'Datoteka ni veljavna slika (JPEG, PNG, WebP ali GIF).' }
  }

  switch (mime) {
    case 'image/jpeg':
      return detectJpeg(bytes)
    case 'image/png':
      return detectPng(bytes)
    case 'image/gif':
      return detectGif(bytes)
    case 'image/webp':
      return detectWebp(bytes)
    default:
      return { ok: false, error: 'Neznana vrsta slike.' }
  }
}

function validDimensions(width: number, height: number): boolean {
  if (!Number.isInteger(width) || !Number.isInteger(height)) return false
  if (width <= 0 || height <= 0) return false
  if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) return false
  return true
}

function detectPng(bytes: Buffer): DetectResult {
  const size = bytes.length
  if (size < 24 || bytes.slice(12, 16).toString('ascii') !== 'IHDR') {
    return { ok: false, error: 'Neveljavna PNG slika.' }
  }
  const width = bytes.readUInt32BE(16)
  const height = bytes.readUInt32BE(20)
  if (!validDimensions(width, height)) {
    return { ok: false, error: 'Neveljavne dimenzije PNG slike.' }
  }

  const iend = Buffer.from([0, 0, 0, 0, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82])
  const idx = bytes.indexOf(iend, 8)
  const endIndex = idx >= 0 ? idx + iend.length : size

  return { ok: true, mime: 'image/png', bytes, endIndex }
}

function detectGif(bytes: Buffer): DetectResult {
  const size = bytes.length
  if (size < 10) return { ok: false, error: 'Neveljavna GIF slika.' }
  const width = bytes.readUInt16LE(6)
  const height = bytes.readUInt16LE(8)
  if (!validDimensions(width, height)) {
    return { ok: false, error: 'Neveljavne dimenzije GIF slike.' }
  }

  const trailer = bytes.lastIndexOf(0x3b)
  if (trailer < 0) return { ok: false, error: 'Nepopolna GIF slika.' }
  return { ok: true, mime: 'image/gif', bytes, endIndex: trailer + 1 }
}

function detectJpeg(bytes: Buffer): DetectResult {
  const size = bytes.length
  let found = false
  let i = 2
  while (i + 9 < size) {
    if (bytes[i] !== 0xff) {
      if (bytes[i] !== 0x00 && i > 2 && bytes[i - 1] === 0xff) {
        found = false
        break
      }
      i += 1
      continue
    }
    if (bytes[i + 1] === 0xd9) {
      if (!found) return { ok: false, error: 'Neveljavna JPEG slika.' }
      break
    }
    const marker = bytes[i + 1]
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      if (i + 9 >= size) return { ok: false, error: 'Neveljavna JPEG slika.' }
      const height = (bytes[i + 5] << 8) | bytes[i + 6]
      const width = (bytes[i + 7] << 8) | bytes[i + 8]
      if (!validDimensions(width, height)) {
        return { ok: false, error: 'Neveljavne dimenzije JPEG slike.' }
      }
      found = true
      break
    }
    if (marker === 0xff) {
      i += 1
      continue
    }
    const segmentLen = (bytes[i + 2] << 8) | bytes[i + 3]
    if (segmentLen < 2) return { ok: false, error: 'Neveljavna JPEG slika.' }
    i += 2 + segmentLen
  }

  if (!found) return { ok: false, error: 'Neveljavna JPEG slika.' }

  const eoi = lastIndexOfPair(bytes, 0xff, 0xd9)
  return { ok: true, mime: 'image/jpeg', bytes, endIndex: eoi >= 0 ? eoi + 2 : size }
}

function detectWebp(bytes: Buffer): DetectResult {
  const size = bytes.length
  if (size < 30) return { ok: false, error: 'Neveljavna WebP slika.' }
  const riffSize = bytes.readUInt32LE(4)
  const declaredSize = 8 + riffSize
  if (declaredSize < 12 || declaredSize > size + 4096) {
    return { ok: false, error: 'Neveljavna WebP slika.' }
  }
  const endIndex = Math.min(declaredSize, size)

  const chunk = bytes.slice(12, 16).toString('ascii')
  let width = 0
  let height = 0
  if (chunk === 'VP8X' && size >= 30) {
    width = 1 + readUInt24LE(bytes, 24)
    height = 1 + readUInt24LE(bytes, 27)
  } else if (chunk === 'VP8 ' && size >= 30) {
    width = bytes.readUInt16LE(26) & 0x3fff
    height = bytes.readUInt16LE(28) & 0x3fff
  } else if (chunk === 'VP8L' && size >= 26 && bytes[20] === 0x2f) {
    let bitstream = 0
    for (let k = 0; k < 5; k++) {
      bitstream |= (bytes[21 + k] ?? 0) << (8 * k)
    }
    width = 1 + (bitstream & 0x3fff)
    height = 1 + ((bitstream >> 14) & 0x3fff)
  }

  if (!validDimensions(width, height)) {
    return { ok: false, error: 'Neveljavne dimenzije WebP slike.' }
  }
  return { ok: true, mime: 'image/webp', bytes, endIndex }
}

function lastIndexOfPair(bytes: Buffer, first: number, second: number): number {
  for (let i = bytes.length - 1; i >= 0; i--) {
    if (bytes[i] === first && bytes[i + 1] === second) return i
  }
  return -1
}

function readUInt24LE(bytes: Buffer, offset: number): number {
  return bytes[offset] | (bytes[offset + 1] << 8) | (bytes[offset + 2] << 16)
}