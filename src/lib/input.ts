export function sanitizeAmount(value: string): string {
  let result = ''
  let hasDot = false
  for (const ch of value) {
    if (ch >= '0' && ch <= '9') {
      result += ch
    } else if (ch === '.' && !hasDot) {
      hasDot = true
      result += ch
    }
  }
  return result
}

export function parseAmount(raw: string): number {
  if (!raw) return 0
  const n = parseFloat(raw)
  return isFinite(n) ? n : 0
}
