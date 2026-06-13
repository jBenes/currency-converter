export const theme = {
  colors: {
    background: '#ffffff',
    text: '#1a1a1a',
  },
  space: [0, 4, 8, 16, 24, 32, 48, 64],
} as const

export type Theme = typeof theme
