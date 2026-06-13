import type { ExchangeRates } from './types'
import { parseRates } from './parse'

export async function fetchRates(): Promise<ExchangeRates> {
  const res = await fetch('/api/rates', {
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) {
    throw new Error(`Failed to fetch rates: ${res.status} ${res.statusText}`)
  }
  const text = await res.text()
  return parseRates(text)
}
