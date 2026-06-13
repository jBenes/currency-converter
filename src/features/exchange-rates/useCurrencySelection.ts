import { useState } from 'react'
import type { Rate } from './types'
import type { CurrencyInfo } from './currencies'

export function useCurrencySelection(
  currencies: CurrencyInfo[],
  ratesByCode: Map<string, Rate>,
) {
  const [userSelectedCode, setUserSelectedCode] = useState<string | null>(null)

  const selectedCode =
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
