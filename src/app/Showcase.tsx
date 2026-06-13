/**
 * Temporary primitive showcase — removed in iteration 3 when the real layout replaces it.
 */
import { useColorMode } from '@/theme'
import {
  Stack,
  Cluster,
  Box,
  Heading,
  Text,
  Button,
  Input,
  Card,
  FieldRow,
} from '@/components/ui'

export function Showcase() {
  const { mode, toggleMode } = useColorMode()

  return (
    <Box p={7} style={{ maxWidth: 560, margin: '0 auto', width: '100%' }}>
      <Stack gap={5}>
        <Cluster justify="space-between" align="center">
          <Heading as="h1" size="lg">
            UI Primitives
          </Heading>
          <Button variant="ghost" onClick={toggleMode}>
            {mode === 'light' ? 'Dark' : 'Light'} mode
          </Button>
        </Cluster>

        <Stack gap={3}>
          <Heading as="h2" size="md">
            Typography
          </Heading>
          <Heading as="h3" size="sm">
            Small heading (h3)
          </Heading>
          <Text>Body text — default variant</Text>
          <Text variant="muted">Muted text for secondary info</Text>
          <Text variant="label">Label text</Text>
          <Text variant="subtle">Subtle text for disclaimers</Text>
        </Stack>

        <Stack gap={3}>
          <Heading as="h2" size="md">
            Buttons
          </Heading>
          <Cluster gap={3}>
            <Button variant="primary">Primary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="icon" aria-label="Icon button">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="4" />
              </svg>
            </Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </Cluster>
        </Stack>

        <Stack gap={3}>
          <Heading as="h2" size="md">
            Card + FieldRow + Input
          </Heading>
          <Card>
            <Stack gap={4}>
              <div>
                <Text variant="label" as="label">
                  You send
                </Text>
                <FieldRow style={{ marginTop: 8 }}>
                  <Input placeholder="Type here..." />
                </FieldRow>
              </div>
              <div>
                <Text variant="label" as="label">
                  Amount
                </Text>
                <FieldRow style={{ marginTop: 8 }}>
                  <Input numeric placeholder="0.00" inputMode="decimal" />
                </FieldRow>
              </div>
            </Stack>
          </Card>
        </Stack>

        <Stack gap={2}>
          <Heading as="h2" size="md">
            Spacing
          </Heading>
          <Cluster gap={2}>
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <Box
                key={i}
                p={i}
                style={{
                  background: 'var(--showcase-swatch)',
                  borderRadius: 4,
                }}
              >
                <Text variant="subtle">{i}</Text>
              </Box>
            ))}
          </Cluster>
        </Stack>
      </Stack>
    </Box>
  )
}
