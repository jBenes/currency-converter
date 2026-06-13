import styled from 'styled-components'

export const FieldRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]}px;
  border: 1.5px solid ${({ theme }) => theme.colors.surfaceFieldBorder};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => `${theme.space[3]}px ${theme.space[3]}px`};
  background: ${({ theme }) => theme.colors.surfaceField};
`
