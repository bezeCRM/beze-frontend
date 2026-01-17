import React from 'react'
import { TextInput, StyleSheet, TextInputProps } from 'react-native'
import SectionCard from '../section/section-card'
import { useTheme } from '@/shared/theme/useTheme'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'

type Props = TextInputProps & { label: string; error?: boolean; placeholder: string }

export default function TextField({ label, error, style, placeholder, ...rest }: Props) {
    const colors = useTheme().theme.colors
    const styles = useStyles()
    return (
        <SectionCard title={label}>
            <TextInput
                style={[styles.input, error && styles.inputError, style as any]}
                placeholderTextColor={colors.textMuted}
                placeholder={placeholder}
                {...rest}
            />
        </SectionCard>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        input: {
            backgroundColor: theme.colors.surface,
            borderRadius: 15,
            height: 100,
            lineHeight: 16.8,
            paddingHorizontal: 15,
            paddingVertical: 10,
            borderWidth: 1,
            borderColor: theme.colors.border,
            fontSize: 14,
            color: theme.colors.text,
        },
        inputError: { borderColor: theme.colors.danger },
    }),
)
