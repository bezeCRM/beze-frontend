import { useState } from 'react'
import { View, TextInput, StyleSheet, Text } from 'react-native'
import ModalHeader from '@/modules/modal/base/modal-header'
import ModalFooter from '@/modules/modal/base/modal-footer'
import { BaseModalProps } from '@/modules/modal/types/base-modal-props'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'
import { useTheme } from '@/shared/theme/useTheme'

export type FormModalProps = BaseModalProps & {
    title: string
    placeholder: string
    buttonTitle: string
    onSubmit: (value: string) => void
    success?: boolean
    successMessage?: string
    error?: string
    validate?: (value: string) => string | null // функция валидации, вызывается при сабмите
}

export default function FormModal({
    title,
    placeholder,
    buttonTitle,
    onSubmit,
    onClose,
    success,
    successMessage,
    error,
    validate,
}: FormModalProps) {
    const styles = useStyles()
    const colors = useTheme().theme.colors
    const [value, setValue] = useState('')
    const [localError, setLocalError] = useState<string | null>(null)

    const trimmed = value.trim()
    const primaryDisabled = !trimmed // только пустое поле блокирует кнопку

    function handlePress() {
        if (validate) {
            const validationMessage = validate(trimmed)
            if (validationMessage) {
                setLocalError(validationMessage)
                return
            }
        }

        // если ошибок нет
        setLocalError(null)
        onSubmit(trimmed)
    }

    if (success)
        return (
            <View style={styles.container}>
                <ModalHeader title={title} onClose={onClose} />
                <Text style={styles.success}>{successMessage || 'Успешно!'}</Text>
                <ModalFooter primaryTitle="Закрыть" onPrimaryPress={onClose} />
            </View>
        )

    return (
        <View style={styles.container}>
            <ModalHeader title={title} onClose={onClose} />

            <TextInput
                value={value}
                onChangeText={t => {
                    setValue(t)
                    if (localError) setLocalError(null) // сбрасываем ошибку при изменении текста
                }}
                placeholder={placeholder}
                placeholderTextColor={colors.textMuted}
                style={styles.input}
            />

            {/* приоритет — локальная ошибка валидации, потом общая */}
            {!!localError && <Text style={styles.error}>{localError}</Text>}
            {!!error && !localError && <Text style={styles.error}>{error}</Text>}

            <ModalFooter
                primaryTitle={buttonTitle}
                onPrimaryPress={handlePress}
                primaryDisabled={primaryDisabled}
            />
        </View>
    )
}
const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        container: {},
        input: {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            borderWidth: 1,
            borderRadius: 15,
            paddingHorizontal: 15,
            height: 45,
            fontFamily: 'Epilogue-Regular',
            marginBottom: 20,
            marginHorizontal: 15,
            fontSize: 16,
            color: theme.colors.text,
        },
        error: {
            color: theme.colors.danger,
            fontSize: 13,
            marginBottom: 12,
            textAlign: 'center',
        },
        success: {
            color: theme.colors.success,
            fontSize: 16,
            marginBottom: 10,
            textAlign: 'center',
        },
    }),
)
