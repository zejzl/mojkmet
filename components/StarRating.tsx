'use client'

import { useState } from 'react'

export default function StarRating({
  value,
  onChange,
  size = 'md',
}: {
  value: number
  onChange?: (next: number) => void
  size?: 'sm' | 'md' | 'lg'
}) {
  const [hovered, setHovered] = useState<number | null>(null)
  const interactive = Boolean(onChange)
  const displayValue = hovered ?? value

  const textSize = size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-sm' : 'text-lg'

  return (
    <div
      className={`inline-flex items-center gap-0.5 ${textSize}`}
      onMouseLeave={() => setHovered(null)}
      role={interactive ? 'radiogroup' : undefined}
      aria-label={interactive ? 'Ocena' : `Ocena: ${value} od 5 zvezdic`}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= displayValue
        const Star = (
          <span className={filled ? 'text-amber-500' : 'text-gray-300'}>★</span>
        )
        if (!interactive) return <span key={star}>{Star}</span>
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={star === value}
            aria-label={`${star} od 5 zvezdic`}
            onMouseEnter={() => setHovered(star)}
            onClick={() => onChange!(star)}
            className="leading-none hover:scale-110 transition-transform"
          >
            {Star}
          </button>
        )
      })}
    </div>
  )
}
