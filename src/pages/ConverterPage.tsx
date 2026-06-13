import { useMemo, useState } from 'react'
import styled from 'styled-components'
import { PageLayout } from '@/layouts'
import { Heading, Text, Stack, Button } from '@/components/ui'
import { strings } from '@/config'
import {
  useRates,
  selectAvailableCurrencies,
  RatesList,
  ConverterRegion,
} from '@/features/exchange-rates'
import type { Rate } from '@/features/exchange-rates'

const Disclaimer = styled(Text).attrs({ variant: 'subtle' as const })`
  max-width: 400px;
  text-align: center;
`

const ErrorContainer = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.space[5]}px 0;
`

const DateLine = styled(Text).attrs({ variant: 'subtle' as const })`
  text-align: center;
`

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
      : currencies[0]?.code ?? ''

  const selectedCurrency = currencies.find((c) => c.code === selectedCode)
  const selectedRate = selectedCode ? ratesByCode.get(selectedCode) : undefined

  return (
    <PageLayout>
      <Stack gap={5} align="center">
        <Stack gap={1} align="center">
          <Heading as="h1" size="lg">
            {strings.pageTitle}
          </Heading>
          <Text variant="muted">{strings.pageSubtitle}</Text>
        </Stack>

        {isLoading && !data && (
          <Text variant="muted">{strings.loading}</Text>
        )}

        {isError && !data && (
          <ErrorContainer role="alert">
            <Stack gap={3} align="center">
              <Text variant="muted">
                {strings.error}{' '}
                {error instanceof Error ? error.message : ''}
              </Text>
              <Button
                variant="primary"
                onClick={() => refetch()}
                disabled={isFetching}
              >
                {strings.retry}
              </Button>
            </Stack>
          </ErrorContainer>
        )}

        {data && currencies.length === 0 && (
          <Text variant="muted">{strings.noRates}</Text>
        )}

        {data && selectedCurrency && selectedRate && (
          <>
            <ConverterRegion
              currency={selectedCurrency}
              rate={selectedRate}
            />
            <RatesList
              currencies={currencies}
              ratesByCode={ratesByCode}
              selectedCode={selectedCode}
              onSelect={setUserSelectedCode}
            />
            {data.dateText && (
              <DateLine>
                {strings.ratesAsOf} {data.dateText}
              </DateLine>
            )}
          </>
        )}

        <Disclaimer>{strings.disclaimer}</Disclaimer>
      </Stack>
    </PageLayout>
  )
}
