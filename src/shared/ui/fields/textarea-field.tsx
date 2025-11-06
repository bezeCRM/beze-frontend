import React from 'react'
import { TextInput, StyleSheet, TextInputProps } from 'react-native'
import { theme } from '@/shared/theme'
import SectionCard from '../section/section-card'

type Props = TextInputProps & { label: string; error?: boolean; placeholder: string }

export default function TextField({ label, error, style, placeholder, ...rest }: Props) {
    return (
        <SectionCard title={label}>
            <TextInput
                style={[styles.input, error && styles.inputError, style as any]}
                placeholderTextColor={theme.colors.mainGray}
                placeholder={placeholder}
                {...rest}
            />
        </SectionCard>
    )
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: theme.colors.mainWhite,
        borderRadius: 15,
        height: 100,
        lineHeight: 16.8,
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderWidth: 1,
        borderColor: theme.colors.lineGray,
        fontSize: 14,
        color: theme.colors.mainBlack,
    },
    inputError: { borderColor: theme.colors.errorRed },
})
