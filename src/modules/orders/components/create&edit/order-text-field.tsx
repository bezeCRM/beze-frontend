import React from 'react'
import { StyleSheet, Text, TextInput, View, type KeyboardTypeOptions } from 'react-native'
import SectionCard from '@/shared/ui/section/section-card'
import { useTheme } from '@/shared/theme/useTheme'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'

type Props = {
    title: string
    value?: string
    placeholder?: string
    onChangeText?: (t: string) => void
    error?: boolean
    errorText?: string
    keyboardType?: KeyboardTypeOptions
    editable?: boolean
}

export default function OrderTextField({
    title,
    value,
    placeholder,
    onChangeText,
    error,
    errorText,
    keyboardType,
    editable = true,
}: Props) {
    const styles = useStyles()
    const colors = useTheme().theme.colors

    return (
        <SectionCard title={title}>
            <View>
                <TextInput
                    value={value ?? ''}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={colors.textMuted}
                    style={[
                        styles.input,
                        !editable && styles.inputDisabled,
                        error && styles.inputError,
                    ]}
                    keyboardType={keyboardType}
                    editable={editable}
                    returnKeyType="done"
                />
                {!!errorText && <Text style={styles.errorText}>{errorText}</Text>}
            </View>
        </SectionCard>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        input: {
            backgroundColor: theme.colors.surface,
            height: 40,
            borderRadius: 15,
            paddingHorizontal: 15,
            paddingVertical: 10,
            borderWidth: 1,
            borderColor: theme.colors.border,
            fontSize: 14,
            color: theme.colors.text,
            fontFamily: 'Epilogue-Regular',
        },
        inputDisabled: {
            backgroundColor: theme.colors.border,
            borderColor: theme.colors.border,
            color: theme.colors.textMuted,
        },
        inputError: { borderColor: theme.colors.danger },
        errorText: {
            marginTop: 6,
            fontSize: 12,
            color: theme.colors.danger,
            fontFamily: 'Epilogue-Regular',
        },
    }),
)
