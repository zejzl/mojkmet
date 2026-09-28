import * as Sentry from '@sentry/nextjs'

export function getErrorMessage(error: unknown, fallback = 'Prišlo je do napake.'): string {
  Sentry.captureException(error)

  if (process.env.NODE_ENV !== 'production') {
    return error instanceof Error && error.message ? error.message : fallback
  }
  return fallback
}