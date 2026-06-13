import { useMemo, useState } from 'react'
import { PageLayout } from '@/layouts'
import { Heading, Text, Stack, Button, Box } from '@/components/ui'
import { strings } from '@/config'
import {
  useRates,
  selectAvailableCurrencies,
  RatesList,
  ConverterRegion,
} from '@/features/exchange-rates'
import { useConverter } from '@/features/exchange-rates/useConverter'
import type { Rate } from '@/features/exchange-rates'


export function ConverterPage() {
  const { data, isLoading, isError, error, refetch, isFetching } = useRates()

  const currencies = useMemo(
    () => (data ? selectAvailableCurrencies(data.rates) : []),
    [data],
  )

  const ratesByCode = useMemo(() => {
    if (!data) return new Map<string, Rate>()
    return new Map(data.rates.map((r) => [r.code, r]))
  }, [data])

  const [userSelectedCode, setUserSelectedCode] = useState<string | null>(null)

  const selectedCode =
    userSelectedCode && currencies.some((c) => c.code === userSelectedCode)
      ? userSelectedCode
      : (currencies[0]?.code ?? '')

  const selectedCurrency = currencies.find((c) => c.code === selectedCode)
  const selectedRate = selectedCode ? ratesByCode.get(selectedCode) : undefined

  const [czkRaw, setCzkRaw] = useState('')
  const converter = useConverter(selectedRate, czkRaw, setCzkRaw)

  return (
    <PageLayout>
      <Stack gap={5}>
        <Stack gap={1} align="center">
          <Heading as="h1">{strings.pageTitle}</Heading>
          <Text variant="muted">{strings.pageSubtitle}</Text>
        </Stack>

        {isLoading && !data && <Text variant="muted">{strings.loading}</Text>}

        {isError && !data && (
          <Box py={5} role="alert">
            <Stack gap={3} align="center">
              <Text variant="muted" align="center">
                {strings.error} {error instanceof Error ? error.message : ''}
              </Text>
              <Button
                variant="primary"
                onClick={() => refetch()}
                disabled={isFetching}
              >
                {strings.retry}
              </Button>
            </Stack>
          </Box>
        )}

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
              onSelect={setUserSelectedCode}
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
