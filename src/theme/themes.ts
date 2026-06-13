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
      white: p.white,
    },

    shadow: {
      card: s.card,
      dropdown: s.dropdown,
    },
  } as const
}

export const lightTheme = createTheme('light')
export const darkTheme = createTheme('dark')

export type Theme = ReturnType<typeof createTheme>
