import styled from 'styled-components'

export const Alert = styled.div.attrs({ role: 'alert' })`
  padding: ${({ theme }) => `${theme.space[4]}px ${theme.space[5]}px`};
  background: ${({ theme }) => theme.colors.errorBg};
  border: 1px solid ${({ theme }) => theme.colors.errorBorder};
  border-radius: ${({ theme }) => theme.radius.lg};
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  text-align: center;
`
