/**
 * Slovenian noun forms for "izdelek" (item), which has a dual:
 * 1 -> izdelek, 2 -> izdelka, 3-4 -> izdelki, everything else -> izdelkov.
 * The rule works on the last two digits, so 101 -> izdelek, 102 -> izdelka, 111 -> izdelkov.
 */
export function izdelekForm(count: number): string {
  const lastTwo = Math.abs(count) % 100
  if (lastTwo === 1) return 'izdelek'
  if (lastTwo === 2) return 'izdelka'
  if (lastTwo === 3 || lastTwo === 4) return 'izdelki'
  return 'izdelkov'
}
