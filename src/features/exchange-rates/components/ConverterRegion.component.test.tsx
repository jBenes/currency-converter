// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { lightTheme } from '@/theme'
import { ConverterRegion } from './ConverterRegion'

vi.mock('@/config/flags', () => ({
  flagUrls: {},
}))

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={lightTheme}>{ui}</ThemeProvider>)
}

describe('ConverterRegion', () => {
  it('shows the selected currency code and name', () => {
    renderWithTheme(
      <ConverterRegion
        currency={{
          code: 'EUR',
          name: 'Euro',
          symbol: '\u20AC',
          country: 'EU',
          flag: 'eu',
        }}
        rate={{ country: 'EMU', currencyName: 'euro', amount: 1, code: 'EUR', rate: 24.875 }}
      />,
    )

    expect(screen.getByText('EUR')).toBeInTheDocument()
    expect(screen.getByText('Euro')).toBeInTheDocument()
  })

  it('shows the normalized rate for a per-1 currency', () => {
    renderWithTheme(
      <ConverterRegion
        currency={{
          code: 'EUR',
          name: 'Euro',
          symbol: '\u20AC',
          country: 'EU',
          flag: 'eu',
        }}
        rate={{ country: 'EMU', currencyName: 'euro', amount: 1, code: 'EUR', rate: 24.875 }}
      />,
    )

    expect(screen.getByText(/24\.875.* CZK/)).toBeInTheDocument()
  })

  it('shows the normalized rate for a per-100 currency', () => {
    renderWithTheme(
      <ConverterRegion
        currency={{
          code: 'JPY',
          name: 'Japanese Yen',
          symbol: '\u00A5',
          country: 'Japan',
          flag: 'jp',
        }}
        rate={{ country: 'Japan', currencyName: 'yen', amount: 100, code: 'JPY', rate: 15.987 }}
      />,
    )

    // 15.987 / 100 = 0.15987 → "0.1599 CZK" (up to 4 decimals)
    expect(screen.getByText(/0\.1599 CZK/)).toBeInTheDocument()
  })
})
