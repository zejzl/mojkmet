export const PICKUP_TIME_ZONE = 'Europe/Ljubljana'
export const PICKUP_DURATION_MINUTES = 30

const DAY_MS = 24 * 60 * 60 * 1000
const SLOT_STEP_MS = 30 * 60 * 1000

let partsFormatter: Intl.DateTimeFormat | null = null
function getPartsFormatter() {
  if (!partsFormatter) {
    partsFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: PICKUP_TIME_ZONE,
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }
  return partsFormatter
}

interface LocalParts {
  year: number
  month: number // 1-12
  day: number
  hour: number
  minute: number
}

function toLocalParts(date: Date): LocalParts {
  const parts = getPartsFormatter().formatToParts(date)
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0)
  // "24" rolls over to 00 for midnight when hour12:false
  const hour = get('hour') === 24 ? 0 : get('hour')
  return { year: get('year'), month: get('month'), day: get('day'), hour, minute: get('minute') }
}

// Zone offset (local - UTC) in ms at a given UTC instant.
function zoneOffsetAt(utcMs: number): number {
  const local = toLocalParts(new Date(utcMs))
  const asUtc = Date.UTC(local.year, local.month - 1, local.day, local.hour, local.minute, 0)
  return asUtc - utcMs
}

// Interpret a wall-clock time (HH:MM) on a calendar day in the pickup timezone as a UTC instant.
export function wallClockToUtc(year: number, month: number, day: number, hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  const naiveUtc = Date.UTC(year, month - 1, day, h, m, 0)
  // Refine once: DST changes near 02:00/03:00 only, slots are in daylight hours.
  return naiveUtc - zoneOffsetAt(naiveUtc)
}

export interface PickupWindowRow {
  id: string
  dayOfWeek: number // 0 = Sunday..6 = Saturday
  startTime: string // HH:MM
  endTime: string // HH:MM
  active: boolean
}

export interface PickupSlot {
  id: string
  start: string // ISO
  end: string // ISO
  dayOfWeek: number
  startTime: string // HH:MM (local)
  endTime: string // HH:MM (local)
}

export function localDateAt(utcMs: number): { year: number; month: number; day: number } {
  const p = toLocalParts(new Date(utcMs))
  return { year: p.year, month: p.month, day: p.day }
}

export function weekdayAt(utcMs: number): number {
  // Weekday of the local calendar day at utcMs (0=Sunday..6=Saturday)
  const { year, month, day } = localDateAt(utcMs)
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay()
}

// Generate upcoming open slots from recurring weekly windows.
// "from" is the earliest allowed start; "days" is the horizon in days.
export function generateSlots(
  windows: PickupWindowRow[],
  opts: { from?: Date; days?: number } = {}
): PickupSlot[] {
  const active = (windows || []).filter((w) => w.active)
  if (active.length === 0) return []

  const from = opts.from ? new Date(opts.from) : new Date()
  const days = Math.min(Math.max(opts.days ?? 7, 1), 30)

  // Start from the next full day (tomorrow) — give the farmer a lead.
  const fromParts = localDateAt(from.getTime())
  const startOfToday = Date.UTC(fromParts.year, fromParts.month - 1, fromParts.day)
  const horizon = startOfToday + days * DAY_MS

  const slots: PickupSlot[] = []
  const durationMs = PICKUP_DURATION_MINUTES * 60 * 1000
  for (let dayMs = startOfToday + DAY_MS; dayMs <= horizon; dayMs += DAY_MS) {
    const { year, month, day } = localDateAt(dayMs)
    const dow = new Date(dayMs).getUTCDay()
    for (const w of active) {
      if (w.dayOfWeek !== dow) continue
      const windowStart = wallClockToUtc(year, month, day, w.startTime)
      const windowEnd = wallClockToUtc(year, month, day, w.endTime)
      for (let t = windowStart; t + durationMs <= windowEnd; t += SLOT_STEP_MS) {
        if (t < from.getTime()) continue
        const startParts = toLocalParts(new Date(t))
        const endParts = toLocalParts(new Date(t + durationMs))
        const pad = (n: number) => String(n).padStart(2, '0')
        slots.push({
          id: `${w.id}:${t}`,
          start: new Date(t).toISOString(),
          end: new Date(t + durationMs).toISOString(),
          dayOfWeek: dow,
          startTime: `${pad(startParts.hour)}:${pad(startParts.minute)}`,
          endTime: `${pad(endParts.hour)}:${pad(endParts.minute)}`,
        })
      }
    }
  }
  return slots.sort((a, b) => (a.start < b.start ? -1 : 1))
}

// Is the chosen [pickupStart, pickupEnd] period inside one of the active windows?
export function isPickupPeriodOpen(
  pickupStart: Date,
  pickupEnd: Date,
  windows: PickupWindowRow[]
): boolean {
  const active = (windows || []).filter((w) => w.active)
  if (active.length === 0) {
    // No windows configured yet — allow a free-form slot (grace path).
    return true
  }
  const startMs = pickupStart.getTime()
  const endMs = pickupEnd.getTime()
  if (!(endMs > startMs)) return false

  const { year, month, day } = localDateAt(startMs)
  const dowStart = new Date(Date.UTC(year, month - 1, day)).getUTCDay()

  for (const w of active) {
    if (w.dayOfWeek !== dowStart) continue
    const wStart = wallClockToUtc(year, month, day, w.startTime)
    const wEnd = wallClockToUtc(year, month, day, w.endTime)
    if (startMs >= wStart && endMs <= wEnd) return true
  }
  return false
}