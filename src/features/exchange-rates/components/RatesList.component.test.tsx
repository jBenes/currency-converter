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

    expect(screen.getByRole('listitem', { name: /Euro/ })).toBeInTheDocument()
    expect(screen.getByRole('listitem', { name: /US Dollar/ })).toBeInTheDocument()
    expect(screen.getByRole('listitem', { name: /Japanese Yen/ })).toBeInTheDocument()
  })

  it('shows normalized rate for per-1 currency', () => {
    renderList()

    expect(screen.getByText(/24\.875.* CZK/)).toBeInTheDocument()
  })

  it('shows normalized rate for per-100 currency', () => {
    renderList()

    expect(screen.getByText(/0\.1599 CZK/)).toBeInTheDocument()
  })

  it('renders flag fallback symbols when no flag URLs available', () => {
    renderList()

    // Flag URLs are mocked as empty, so fallback symbols render
    expect(screen.getByText('\u20AC')).toBeInTheDocument() // EUR €
    expect(screen.getByText('$')).toBeInTheDocument() // USD
    expect(screen.getByText('\u00A5')).toBeInTheDocument() // JPY ¥
  })

  it('calls onSelect when a row is clicked', () => {
    const onSelect = vi.fn()
    renderList({ onSelect })

    fireEvent.click(screen.getByRole('listitem', { name: /US Dollar/ }))
    expect(onSelect).toHaveBeenCalledWith('USD')
  })

  it('marks the selected row with aria-current', () => {
    renderList()

    const eurRow = screen.getByRole('listitem', { name: /Euro/ })
    expect(eurRow).toHaveAttribute('aria-current', 'true')

    const usdRow = screen.getByRole('listitem', { name: /US Dollar/ })
    expect(usdRow).not.toHaveAttribute('aria-current')
  })

  it('filters the list by code', () => {
    renderList()

    const searchInput = screen.getByPlaceholderText(/Search currency/i)
    fireEvent.change(searchInput, { target: { value: 'eur' } })

    expect(screen.getByRole('listitem', { name: /Euro/ })).toBeInTheDocument()
    expect(screen.queryByRole('listitem', { name: /US Dollar/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('listitem', { name: /Japanese Yen/ })).not.toBeInTheDocument()
  })

  it('filters by country name', () => {
    renderList()

    const searchInput = screen.getByPlaceholderText(/Search currency/i)
    fireEvent.change(searchInput, { target: { value: 'japan' } })

    expect(screen.getByRole('listitem', { name: /Japanese Yen/ })).toBeInTheDocument()
    expect(screen.queryByRole('listitem', { name: /Euro/ })).not.toBeInTheDocument()
  })

  it('shows empty message when filter matches nothing', () => {
    renderList()

    const searchInput = screen.getByPlaceholderText(/Search currency/i)
    fireEvent.change(searchInput, { target: { value: 'xyz' } })

    expect(screen.getByText(/No currencies match/)).toBeInTheDocument()
  })
})
