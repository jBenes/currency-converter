import styled, { css } from 'styled-components'
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  numeric?: boolean
}

const numericStyles = css`
  text-align: right;
  font-size: ${({ theme }) => theme.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
`

export const Input = styled.input.attrs<InputProps>((props) => ({
  type: props.type ?? 'text',
}))<InputProps>`
  width: 100%;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.text};
  line-height: ${({ theme }) => theme.lineHeight.normal};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSubtle};
  }

  &:focus-visible {
    outline: none;
  }

  ${({ numeric }) => numeric && numericStyles}
`
