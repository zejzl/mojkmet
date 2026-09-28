export interface Coordinates {
  latitude: number
  longitude: number
}

const EARTH_RADIUS_KM = 6371

export function haversineKm(a: Coordinates, b: Coordinates): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(b.latitude - a.latitude)
  const dLon = toRad(b.longitude - a.longitude)
  const lat1 = toRad(a.latitude)
  const lat2 = toRad(b.latitude)
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(Math.min(1, h)))
}

export function formatDistanceKm(km: number): string {
  const sl = (value: number, fractionDigits: number) =>
    value.toFixed(fractionDigits).replace('.', ',')
  if (km < 1) return `${Math.max(1, Math.round(km * 1000))} m`
  if (km < 100) return `${sl(km, 1)} km`
  return `${Math.round(km)} km`
}