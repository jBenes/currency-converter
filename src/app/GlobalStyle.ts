import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.background};
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }

  #root {
    min-height: 100dvh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`
