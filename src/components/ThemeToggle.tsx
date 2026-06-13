import styled from 'styled-components'
import { useColorMode } from '@/theme'
import { SunIcon, MoonIcon } from '@/components/ui/icons'

const ToggleButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({ theme }) => theme.size.control}px;
  height: ${({ theme }) => theme.size.control}px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.header.buttonBorder};
  background: ${({ theme }) => theme.header.buttonBg};
  color: ${({ theme }) => theme.header.text};
  cursor: pointer;
  flex-shrink: 0;
  padding: 0;

  &:hover {
    background: ${({ theme }) => theme.header.buttonHoverBg};
  }
`

export function ThemeToggle() {
  const { mode, toggleMode } = useColorMode()

  return (
    <ToggleButton onClick={toggleMode} aria-label="Toggle theme">
      {mode === 'dark' ? <SunIcon aria-hidden="true" /> : <MoonIcon aria-hidden="true" />}
    </ToggleButton>
  )
}
