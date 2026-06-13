import {
  space,
  radius,
  fontSize,
  fontWeight,
  lineHeight,
  breakpoints,
  palette,
  shadow,
} from './tokens'

function createTheme(mode: 'light' | 'dark') {
  const p = palette[mode]
  const s = shadow[mode]

  return {
    mode,
    space,
    radius,
    fontSize,
    fontWeight,
    lineHeight,
    breakpoints,

    colors: {
      page: p.page,
      header: p.header,
      surface: p.card,
      surfaceBorder: p.cardBorder,
      surfaceField: p.field,
      surfaceFieldBorder: p.fieldBorder,
      surfaceDropdown: p.dropdown,
      surfaceSelected: p.selected,
      text: p.text,
      textMuted: p.muted,
      textLabel: p.label,
      textSubtle: p.subtle,
      accent: p.accent,
      badgeBg: p.badge,
      divider: p.divider,
      success: p.success,
      error: p.error,
      errorBg: p.errorBg,
      errorBorder: p.errorBorder,
      white: p.white,
    },

    size: {
      control: 38,
    },

    layout: {
      headerHeight: 72,
      containerMaxWidth: 1080,
    },

    header: {
      text: '#FFFFFF',
      textMuted: 'rgba(255,255,255,0.72)',
      buttonBg: 'rgba(255,255,255,0.10)',
      buttonBorder: 'rgba(255,255,255,0.22)',
      buttonHoverBg:
        mode === 'light'
          ? 'rgba(255,255,255,0.18)'
          : 'rgba(255,255,255,0.14)',
    },

    shadow: {
      card: s.card,
      dropdown: s.dropdown,
      header: s.header,
    },
  } as const
}

export const lightTheme = createTheme('light')
export const darkTheme = createTheme('dark')

export type Theme = ReturnType<typeof createTheme>
