'use client'

import { useEffect, useState } from 'react'
import { formatDistanceKm, haversineKm, type Coordinates } from '@/lib/geo'

type LocationStatus = 'idle' | 'requesting' | 'granted' | 'denied' | 'unsupported'

let coords: Coordinates | null = null
let status: LocationStatus = 'idle'
const listeners = new Set<() => void>()

function notify() {
  listeners.forEach((l) => l())
}

function resolveLocation(position: GeolocationPosition) {
  coords = { latitude: position.coords.latitude, longitude: position.coords.longitude }
  status = 'granted'
  notify()
}

function rejectLocation() {
  status = 'denied'
  notify()
}

export function requestLocation() {
  if (status !== 'idle') return
  status = 'requesting'
  notify()
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    status = 'unsupported'
    notify()
    return
  }
  navigator.geolocation.getCurrentPosition(resolveLocation, rejectLocation, {
    enableHighAccuracy: false,
    timeout: 10_000,
    maximumAge: 60_000,
  })
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}

function getSharedLocation() {
  return { coords, status }
}

interface DistanceBadgeProps {
  latitude: number | null | undefined
  longitude: number | null | undefined
  className?: string
}

export default function DistanceBadge({ latitude, longitude, className }: DistanceBadgeProps) {
  const [location, setLocation] = useState(getSharedLocation())

  useEffect(() => subscribe(() => setLocation(getSharedLocation())), [])

  if (location.coords && latitude != null && longitude != null) {
    const km = haversineKm(location.coords, { latitude, longitude })
    return (
      <span className={`text-green-700 whitespace-nowrap ${className ?? ''}`}>
        · ≈ {formatDistanceKm(km)} stran
      </span>
    )
  }

  if (location.status === 'idle') {
    return (
      <button
        type="button"
        onClick={requestLocation}
        className={`text-green-700 underline decoration-dotted underline-offset-2 hover:text-green-800 whitespace-nowrap ${className ?? ''}`}
      >
        Uporabi mojo lokacijo
      </button>
    )
  }

  return null
}