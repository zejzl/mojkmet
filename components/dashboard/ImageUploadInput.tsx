'use client'

import { useRef, useState } from 'react'
import { getErrorMessage } from '@/lib/errors'

// UX-only pre-check so users get instant feedback — the real, security-relevant validation
// (magic-byte sniffing, dimension caps, canonicalization) happens server-side in
// lib/image-upload.ts and cannot be bypassed by skipping this check.
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_BYTES = 1_500_000

export default function ImageUploadInput({
  value,
  onChange,
}: {
  value: string
  onChange: (next: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')

  const handleFile = (file: File | undefined) => {
    setError('')
    if (!file) return

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Dovoljene vrste slik: JPEG, PNG, WebP in GIF.')
      return
    }
    if (file.size > MAX_BYTES) {
      setError('Slika je prevelika (največ 1,5 MB).')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      onChange(String(reader.result || ''))
    }
    reader.onerror = () => {
      setError(getErrorMessage('FileReader error', 'Napaka pri branju datoteke.'))
    }
    reader.readAsDataURL(file)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Fotografija</label>
      <div className="mt-1 flex items-start space-x-4">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt="Predogled fotografije"
            className="h-20 w-20 rounded-lg object-cover border border-gray-200"
          />
        ) : null}
        <div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
          >
            {value ? 'Zamenjaj sliko' : 'Naloži sliko'}
          </button>
          {value ? (
            <button
              type="button"
              onClick={() => {
                onChange('')
                if (inputRef.current) inputRef.current.value = ''
              }}
              className="ml-2 px-3 py-2 text-sm text-red-600 hover:text-red-800 transition"
            >
              Odstrani
            </button>
          ) : null}
          <p className="text-xs text-gray-500 mt-1">JPEG, PNG, WebP ali GIF · največ 1,5 MB</p>
          {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  )
}