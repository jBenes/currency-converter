import styled from 'styled-components'
import { PageLayout } from '@/layouts'
import { Heading, Text, Card, Stack } from '@/components/ui'
import { strings } from '@/config'

const Disclaimer = styled(Text).attrs({ variant: 'subtle' as const })`
  max-width: 400px;
  text-align: center;
`

export function ConverterPage() {
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
