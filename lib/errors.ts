export function getErrorMessage(error: unknown, fallback = 'Prišlo je do napake.'): string {
  return error instanceof Error && error.message ? error.message : fallback
}