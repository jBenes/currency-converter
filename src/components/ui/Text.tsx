import styled, { css } from 'styled-components'

type TextVariant = 'body' | 'muted' | 'label' | 'subtle'
type TextAlign = 'left' | 'center' | 'right'

const variantStyles = {
  body: css`
    font-size: ${({ theme }) => theme.fontSize.md};
    color: ${({ theme }) => theme.colors.text};
  `,
  muted: css`
    font-size: ${({ theme }) => theme.fontSize.md};
    color: ${({ theme }) => theme.colors.textMuted};
  `,
  label: css`
    font-size: ${({ theme }) => theme.fontSize.xs};
    font-weight: ${({ theme }) => theme.fontWeight.semibold};
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.textLabel};
  `,
  subtle: css`
    font-size: ${({ theme }) => theme.fontSize.sm};
    color: ${({ theme }) => theme.colors.textSubtle};
    line-height: ${({ theme }) => theme.lineHeight.relaxed};
  `,
}

interface TextProps {
  variant?: TextVariant
  align?: TextAlign
}

export const Text = styled.span<TextProps>`
  line-height: ${({ theme }) => theme.lineHeight.normal};
  ${({ variant = 'body' }) => variantStyles[variant]}
  ${({ align }) => align && `text-align: ${align};`}
`
