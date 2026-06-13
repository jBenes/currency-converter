import styled, { css } from 'styled-components'

type ButtonVariant = 'primary' | 'ghost' | 'icon'

const variantStyles = {
  primary: css`
    background: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.white};
    padding: ${({ theme }) => `${theme.space[3]}px ${theme.space[4]}px`};
    font-weight: ${({ theme }) => theme.fontWeight.semibold};

    &:hover:not(:disabled) {
      opacity: 0.9;
    }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.text};
    padding: ${({ theme }) => `${theme.space[3]}px ${theme.space[4]}px`};
    font-weight: ${({ theme }) => theme.fontWeight.medium};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.surfaceField};
    }
  `,
  icon: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.text};
    padding: ${({ theme }) => `${theme.space[2]}px`};
    width: ${({ theme }) => theme.size.control}px;
    height: ${({ theme }) => theme.size.control}px;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.surfaceField};
    }
  `,
}

interface ButtonProps {
  variant?: ButtonVariant
}

export const Button = styled.button<ButtonProps>`
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSize.md};
  cursor: pointer;
  transition: background 0.15s, opacity 0.15s;
  line-height: 1;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${({ variant = 'primary' }) => variantStyles[variant]}
`
