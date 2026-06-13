import type { ExchangeRates, Rate } from './types'

const MONTHS: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
}

function parseDateLine(line: string): {
  dateText: string
  date: Date | null
  sequence: number
} {
  const hashIdx = line.indexOf('#')
  const sequence = hashIdx >= 0 ? parseInt(line.slice(hashIdx + 1), 10) || 0 : 0
  const dateText = (hashIdx >= 0 ? line.slice(0, hashIdx) : line).trim()

  let date: Date | null = null
  const match = dateText.match(/^(\d{1,2})\.(\w{3})\.(\d{4})$/)
  if (match) {
    const day = parseInt(match[1]!, 10)
    const month = MONTHS[match[2]!]
    const year = parseInt(match[3]!, 10)
    if (month !== undefined && !isNaN(day) && !isNaN(year)) {
      date = new Date(year, month, day)
      if (isNaN(date.getTime())) date = null
    }
  }

  return { dateText, date, sequence }
}

function parseRow(line: string): Rate | null {
  const parts = line.split('|')
  if (parts.length !== 5) return null

  const country = parts[0]!.trim()
  const currencyName = parts[1]!.trim()
  const amount = parseInt(parts[2]!.trim(), 10)
  const code = parts[3]!.trim()
  const rate = Number(parts[4]!.trim())

  if (!country || !currencyName || !code) return null
  if (!isFinite(amount) || amount <= 0) return null
  if (!isFinite(rate) || rate <= 0) return null

  return { country, currencyName, amount, code, rate }
}

export function parseRates(raw: string): ExchangeRates {
  if (!raw || !raw.trim()) {
    throw new Error('Empty exchange rate data')
  }

  const lines = raw.replace(/\r\n/g, '\n').split('\n')

  const dateLine = lines[0]
  if (!dateLine?.trim()) {
    throw new Error('Missing date line')
  }
  const { dateText, date, sequence } = parseDateLine(dateLine.trim())

  const headerLine = lines[1]
  if (!headerLine?.trim().startsWith('Country|Currency|Amount|Code|Rate')) {
    throw new Error('Missing or invalid header line')
  }

  const rates: Rate[] = []
  for (let i = 2; i < lines.length; i++) {
    const line = lines[i]!
    if (line.trim() === '') break
    const rate = parseRow(line)
    if (rate) rates.push(rate)
  }

  if (rates.length === 0) {
    throw new Error('No valid rate rows found')
  }

  return { dateText, date, sequence, rates }
}
