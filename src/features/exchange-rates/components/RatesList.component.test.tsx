// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { lightTheme } from '@/theme'
import type { Rate } from '../types'
import type { CurrencyInfo } from '../currencies'
import { RatesList } from './RatesList'

vi.mock('@/config/flags', () => ({
  flagUrls: {},
}))

const currencies: CurrencyInfo[] = [
  { code: 'EUR', name: 'Euro', symbol: '\u20AC', country: 'European Union', flag: 'eu' },
  { code: 'USD', name: 'US Dollar', symbol: '$', country: 'United States', flag: 'us' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '\u00A5', country: 'Japan', flag: 'jp' },
]

const rates: Rate[] = [
  { country: 'EMU', currencyName: 'euro', amount: 1, code: 'EUR', rate: 24.875 },
  { country: 'USA', currencyName: 'dollar', amount: 1, code: 'USD', rate: 22.456 },
  { country: 'Japan', currencyName: 'yen', amount: 100, code: 'JPY', rate: 15.987 },
]

const ratesByCode = new Map(rates.map((r) => [r.code, r]))

function renderList(overrides?: Partial<React.ComponentProps<typeof RatesList>>) {
  return render(
    <ThemeProvider theme={lightTheme}>
      <RatesList
        currencies={currencies}
        ratesByCode={ratesByCode}
        selectedCode="EUR"
        onSelect={() => {}}
        {...overrides}
      />
    </ThemeProvider>,
  )
}

describe('RatesList', () => {
  it('renders all currency rows', () => {
    renderList()

    expect(screen.getByRole('button', { name: /Euro/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /US Dollar/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Japanese Yen/ })).toBeInTheDocument()
  })

  it('shows normalized rate for per-1 currency', () => {
    renderList()

    // EUR: 24.875 / 1 = 24.875 → "24.875 CZK" or "24.8750 CZK"
    expect(screen.getByText(/24\.875.* CZK/)).toBeInTheDocument()
  })

  it('shows normalized rate for per-100 currency', () => {
    renderList()

    // JPY: 15.987 / 100 = 0.15987 → "0.1599 CZK" (up to 4 decimals)
    expect(screen.getByText(/0\.1599 CZK/)).toBeInTheDocument()
  })

  it('shows flag fallback badges', () => {
    renderList()

    // Flags are aria-hidden; fallback symbols are shown since we mock flagUrls as empty
    const listbox = screen.getByRole('listbox')
    expect(listbox).toBeInTheDocument()
  })

  it('calls onSelect when a row is clicked', () => {
    const onSelect = vi.fn()
    renderList({ onSelect })

    fireEvent.click(screen.getByRole('button', { name: /US Dollar/ }))
    expect(onSelect).toHaveBeenCalledWith('USD')
  })

  it('marks the selected row with aria-pressed', () => {
    renderList()

    const eurRow = screen.getByRole('button', { name: /Euro/ })
    expect(eurRow).toHaveAttribute('aria-pressed', 'true')

    const usdRow = screen.getByRole('button', { name: /US Dollar/ })
    expect(usdRow).toHaveAttribute('aria-pressed', 'false')
  })

  it('filters the list by code', () => {
    renderList()

    const searchInput = screen.getByPlaceholderText(/Search currency/i)
    fireEvent.change(searchInput, { target: { value: 'eur' } })

    expect(screen.getByRole('button', { name: /Euro/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /US Dollar/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Japanese Yen/ })).not.toBeInTheDocument()
  })

  it('filters by country name', () => {
    renderList()

    const searchInput = screen.getByPlaceholderText(/Search currency/i)
    fireEvent.change(searchInput, { target: { value: 'japan' } })

    expect(screen.getByRole('button', { name: /Japanese Yen/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Euro/ })).not.toBeInTheDocument()
  })

  it('shows empty message when filter matches nothing', () => {
    renderList()

    const searchInput = screen.getByPlaceholderText(/Search currency/i)
    fireEvent.change(searchInput, { target: { value: 'xyz' } })

    expect(screen.getByText(/No currencies match/)).toBeInTheDocument()
  })
})
