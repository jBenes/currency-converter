import styled from 'styled-components'
import { PageLayout } from '@/layouts'
import { Heading, Text, Card, Stack } from '@/components/ui'
import { strings } from '@/config'
import { useRates } from '@/features/exchange-rates'

const Disclaimer = styled(Text).attrs({ variant: 'subtle' as const })`
  max-width: 400px;
  text-align: center;
`

export function ConverterPage() {
  const { data } = useRates()

  // TODO: Remove in next iteration — temporary debug confirmation
  if (data) {
    console.info(
      `[debug] Loaded ${data.rates.length} rates as of ${data.dateText}`,
    )
  }

  return (
    <PageLayout>
      <Stack gap={5} align="center">
        <Stack gap={1} align="center">
          <Heading as="h1" size="lg">
            {strings.pageTitle}
          </Heading>
          <Text variant="muted">{strings.pageSubtitle}</Text>
        </Stack>

        <Card>{/* Converter placeholder */}</Card>

        <Disclaimer>{strings.disclaimer}</Disclaimer>
      </Stack>
    </PageLayout>
  )
}
