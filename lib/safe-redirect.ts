/**
 * Returns `target` only if it is a same-site relative path, otherwise `fallback`.
 * Guards the post-login redirect (`?redirect=` / `?callbackUrl=`) against open redirects:
 * "//evil.com", a slash followed by a backslash, and absolute URLs would all leave the site.
 */
export function safeRedirectPath(target: string | null | undefined, fallback = '/'): string {
  if (!target) return fallback
  if (!target.startsWith('/')) return fallback
  if (target.startsWith('//') || target.startsWith('/\\')) return fallback
  // Control characters (tab/newline) are stripped by browsers and can smuggle "//" past the checks
  if (/[\u0000-\u001f]/.test(target)) return fallback
  return target
}
