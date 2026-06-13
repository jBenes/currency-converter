import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { ThemeProvider as SCThemeProvider } from 'styled-components'
import { lightTheme, darkTheme } from './themes'
import {
  ColorModeContext,
  type ColorMode,
  type ColorModeContextValue,
} from './useColorMode'

const mediaQuery = '(prefers-color-scheme: dark)'

function getSystemMode(): ColorMode {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia(mediaQuery).matches ? 'dark' : 'light'
}

function resolveInitialMode(forcedMode?: ColorMode): ColorMode {
  return forcedMode ?? getSystemMode()
}

interface ThemeProviderProps {
  children: ReactNode
  forcedMode?: ColorMode
}

export function ThemeProvider({ children, forcedMode }: ThemeProviderProps) {
  const [mode, setMode] = useState<ColorMode>(() =>
    resolveInitialMode(forcedMode),
  )

  useEffect(() => {
    if (forcedMode !== undefined) return

    const mql = window.matchMedia(mediaQuery)
    const handler = (e: MediaQueryListEvent) =>
      setMode(e.matches ? 'dark' : 'light')
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [forcedMode])

  const actualMode = forcedMode ?? mode

  const contextValue = useMemo<ColorModeContextValue>(
    () => ({
      mode: actualMode,
      setMode,
      toggleMode: () => setMode((m) => (m === 'light' ? 'dark' : 'light')),
    }),
    [actualMode],
  )

  const theme = actualMode === 'dark' ? darkTheme : lightTheme

  return (
    <ColorModeContext.Provider value={contextValue}>
      <SCThemeProvider theme={theme}>{children}</SCThemeProvider>
    </ColorModeContext.Provider>
  )
}
