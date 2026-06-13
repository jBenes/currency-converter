import { createContext, useContext } from 'react'

export type ColorMode = 'light' | 'dark'

export interface ColorModeContextValue {
  mode: ColorMode
  setMode: (mode: ColorMode) => void
  toggleMode: () => void
}

export const ColorModeContext = createContext<ColorModeContextValue | null>(null)

export function useColorMode(): ColorModeContextValue {
  const ctx = useContext(ColorModeContext)
  if (!ctx) {
    throw new Error('useColorMode must be used within a ThemeProvider')
  }
  return ctx
}
