import React from 'react'
import { StyleSheet, Text, TextInput, View, type KeyboardTypeOptions } from 'react-native'
import SectionCard from '@/shared/ui/section/section-card'
import { theme } from '@/shared/theme'

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
    return (
        <SectionCard title={title}>
            <View>
                <TextInput
                    value={value ?? ''}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={theme.colors.mainGray}
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

const styles = StyleSheet.create({
    input: {
        backgroundColor: theme.colors.mainWhite,
        height: 40,
        borderRadius: 15,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: theme.colors.lineGray,
        fontSize: 14,
        color: theme.colors.mainBlack,
        fontFamily: 'Epilogue-Regular',
    },
    inputDisabled: {
        backgroundColor: theme.colors.lineGray,
        borderColor: theme.colors.lineGray,
        color: theme.colors.mainGray,
    },
    inputError: { borderColor: theme.colors.errorRed },
    errorText: {
        marginTop: 6,
        fontSize: 12,
        color: theme.colors.errorRed,
        fontFamily: 'Epilogue-Regular',
    },
})
