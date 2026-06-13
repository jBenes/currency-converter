// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { lightTheme } from '@/theme'
import { ConverterRegion } from './ConverterRegion'
import type { CurrencyInfo } from '../currencies'

vi.mock('@/config/flags', () => ({
  flagUrls: {},
}))

const eurCurrency: CurrencyInfo = {
  code: 'EUR',
  name: 'Euro',
  symbol: '\u20AC',
  country: 'EU',
  flag: 'eu',
}

const eurRate = {
  country: 'EMU',
  currencyName: 'euro',
  amount: 1,
  code: 'EUR',
  rate: 24.875,
}

const jpyCurrency: CurrencyInfo = {
  code: 'JPY',
  name: 'Japanese Yen',
  symbol: '\u00A5',
  country: 'Japan',
  flag: 'jp',
}

const jpyRate = {
  country: 'Japan',
  currencyName: 'yen',
  amount: 100,
  code: 'JPY',
  rate: 15.987,
}

function renderRegion(overrides?: Record<string, unknown>) {
  const defaults = {
    currency: eurCurrency,
    rate: eurRate,
    czkValue: '',
    foreignValue: '',
    onCzkChange: () => {},
  }
  const props = { ...defaults, ...overrides }
  return render(
    <ThemeProvider theme={lightTheme}>
      <ConverterRegion {...props} />
    </ThemeProvider>,
  )
}

describe('ConverterRegion', () => {
  it('shows the selected currency code', () => {
    renderRegion()
    expect(screen.getByText('EUR')).toBeInTheDocument()
  })

  it('shows the normalized rate for a per-1 currency', () => {
    renderRegion()
    expect(screen.getByText(/24\.875.* CZK/)).toBeInTheDocument()
  })

  it('shows the normalized rate for a per-100 currency', () => {
    renderRegion({ currency: jpyCurrency, rate: jpyRate })
    expect(screen.getByText(/0\.1599 CZK/)).toBeInTheDocument()
  })

  it('renders the CZK input with a label', () => {
    renderRegion()
    expect(screen.getByLabelText(/From/i)).toBeInTheDocument()
  })

  it('renders the result as plain text (not an input)', () => {
    renderRegion({ foreignValue: '4.02' })
    expect(screen.getByText('4.02')).toBeInTheDocument()
    expect(screen.queryByDisplayValue('4.02')).not.toBeInTheDocument()
  })

  it('displays CZK and foreign values', () => {
    renderRegion({ czkValue: '100', foreignValue: '4.02' })
    const czkInput = screen.getByLabelText(/From/i) as HTMLInputElement
    expect(czkInput.value).toBe('100')
    expect(screen.getByText('4.02')).toBeInTheDocument()
  })

  it('calls onCzkChange when CZK input changes', () => {
    const onCzkChange = vi.fn()
    renderRegion({ onCzkChange })
    fireEvent.change(screen.getByLabelText(/From/i), {
      target: { value: '500' },
    })
    expect(onCzkChange).toHaveBeenCalledWith('500')
  })

  it('has an aria-live region for the result', () => {
    renderRegion()
    const liveRegion = document.querySelector('[aria-live="polite"]')
    expect(liveRegion).toBeInTheDocument()
  })
})
