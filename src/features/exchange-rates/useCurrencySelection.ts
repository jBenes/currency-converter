import { useState } from 'react'
import type { Rate } from './types'
import type { CurrencyCode, CurrencyInfo } from './currencies'

export function useCurrencySelection(
  currencies: CurrencyInfo[],
  ratesByCode: Map<string, Rate>,
) {
  const [userSelectedCode, setUserSelectedCode] = useState<CurrencyCode | null>(null)

  const selectedCode: CurrencyCode | '' =
    userSelectedCode && currencies.some((c) => c.code === userSelectedCode)
      ? userSelectedCode
      : (currencies[0]?.code ?? '')

  const selectedCurrency = currencies.find((c) => c.code === selectedCode)
  const selectedRate = selectedCode ? ratesByCode.get(selectedCode) : undefined

  return {
    selectedCode,
    selectedCurrency,
    selectedRate,
    selectCurrency: setUserSelectedCode,
  }
}
