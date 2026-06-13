export const space = [0, 4, 8, 12, 16, 22, 24, 26, 28, 40, 56] as const

export const radius = {
  sm: '8px',
  md: '10px',
  lg: '12px',
  xl: '14px',
  '2xl': '16px',
  pill: '9999px',
} as const

export const fontSize = {
  xs: '12px',
  sm: '13px',
  md: '15px',
  base: '16px',
  lg: '19px',
  xl: '26px',
  '2xl': '30px',
} as const

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const

export const lineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.6,
} as const

export const breakpoints = {
  tablet: '640px',
  desktop: '1024px',
} as const

export const palette = {
  light: {
    page: '#EAEFF6',
    header: '#134B8E',
    card: '#FFFFFF',
    cardBorder: '#E1E8F1',
    field: '#FBFCFE',
    fieldBorder: '#E1E8F1',
    text: '#15233B',
    muted: '#5B6B82',
    label: '#7A8AA0',
    badge: '#EAF1FB',
    accent: '#134B8E',
    divider: '#ECF0F6',
    dropdown: '#FFFFFF',
    subtle: '#8794A8',
    selected: '#F2F7FD',
    success: '#2E9E6B',
    white: '#FFFFFF',
  },
  dark: {
    page: '#0C1421',
    header: '#0E2B50',
    card: '#141F33',
    cardBorder: '#27344C',
    field: '#0F1A2B',
    fieldBorder: '#2A3850',
    text: '#E8EEF6',
    muted: '#94A4BB',
    label: '#7E8EA6',
    badge: '#1C2C49',
    accent: '#6BA6EC',
    divider: '#243149',
    dropdown: '#16223A',
    subtle: '#73839B',
    selected: '#1B2A45',
    success: '#2E9E6B',
    white: '#FFFFFF',
  },
} as const

export const shadow = {
  light: {
    card: '0 1px 2px rgba(20,49,89,0.04), 0 14px 40px -18px rgba(20,49,89,0.22)',
    dropdown:
      '0 20px 48px -16px rgba(20,49,89,0.3)',
  },
  dark: {
    card: '0 1px 2px rgba(0,0,0,0.4), 0 18px 44px -18px rgba(0,0,0,0.7)',
    dropdown: '0 22px 50px -16px rgba(0,0,0,0.75)',
  },
} as const
