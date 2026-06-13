import { useEffect } from 'react'
import { PageLayout } from '@/layouts'
import { Heading, Text, Stack, Alert } from '@/components/ui'
import { strings } from '@/config'
import { logger } from '@/lib/logger'
import {
  useRates,
  useCurrencySelection,
  useConverter,
  RatesList,
  ConverterRegion,
} from '@/features/exchange-rates'

export function ConverterPage() {
  const { data, isError, error, currencies, ratesByCode } = useRates()
  const { selectedCode, selectedCurrency, selectedRate, selectCurrency } =
    useCurrencySelection(currencies, ratesByCode)
  const converter = useConverter(selectedRate)

  useEffect(() => {
    if (isError && error) {
      logger.error('Failed to load rates', error)
    }
  }, [isError, error])

  return (
    <PageLayout>
      <Stack gap={5}>
        <Stack gap={1} align="center">
          <Heading as="h1">{strings.pageTitle}</Heading>
          <Text variant="muted" align="center">{strings.pageSubtitle}</Text>
        </Stack>

        {isError && !data && <Alert>{strings.error}</Alert>}

        {data && currencies.length === 0 && (
          <Text variant="muted">{strings.noRates}</Text>
        )}

        {data && selectedCurrency && selectedRate && (
          <>
            <ConverterRegion
              currency={selectedCurrency}
              rate={selectedRate}
              czkValue={converter.czkValue}
              foreignValue={converter.foreignValue}
              onCzkChange={converter.onCzkChange}
            />
            <RatesList
              currencies={currencies}
              ratesByCode={ratesByCode}
              selectedCode={selectedCode}
              onSelect={selectCurrency}
            />
            {data.dateText && (
              <Text variant="subtle" align="center">
                {strings.ratesAsOf} {data.dateText}
              </Text>
            )}
          </>
        )}
      </Stack>
    </PageLayout>
  )
}
