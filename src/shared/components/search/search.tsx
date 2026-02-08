import { useCallback, useRef } from 'react'
import {
    View,
    TextInput,
    StyleSheet,
    TextInputProps,
    TouchableOpacity,
    Keyboard,
} from 'react-native'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'
import { useTheme } from '@/shared/theme/useTheme'
import { Icon } from '@/shared/ui/icon/icon'

type Props = {
    value: string
    onChangeText: (text: string) => void
    placeholder?: string
    editable?: boolean
    onSubmit?: () => void
} & Omit<TextInputProps, 'value' | 'onChangeText' | 'placeholder' | 'editable'>

export default function Search({
    value,
    onChangeText,
    placeholder = 'Поиск по названию',
    editable = true,
    onSubmit,
    ...rest
}: Props) {
    const styles = useStyles()
    const colors = useTheme().theme.colors
    const inputRef = useRef<TextInput>(null)

    const trimmed = value.trim()
    const canSubmit = trimmed.length > 0

    const blurAndDismiss = useCallback(() => {
        inputRef.current?.blur()
        Keyboard.dismiss()
    }, [])

    const handleClear = useCallback(() => {
        onChangeText('')
        blurAndDismiss()
    }, [onChangeText, blurAndDismiss])

    const handleSubmit = useCallback(() => {
        if (!canSubmit) return
        onSubmit?.()
        blurAndDismiss()
    }, [canSubmit, onSubmit, blurAndDismiss])

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={handleSubmit}
                disabled={!canSubmit}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.leftBtn}
            >
                <Icon
                    name="search-icon"
                    size={16}
                    color={canSubmit ? colors.info : colors.textMuted}
                    rotateDeg={0}
                />
            </TouchableOpacity>

            <TextInput
                ref={inputRef}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.textMuted}
                editable={editable}
                returnKeyType="search"
                onSubmitEditing={handleSubmit}
                style={styles.input}
                {...rest}
            />

            <TouchableOpacity
                onPress={handleClear}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.clearBtn}
            >
                <Icon
                    name="x-icon"
                    size={12}
                    color={canSubmit ? colors.danger : colors.textMuted}
                    rotateDeg={0}
                />
            </TouchableOpacity>
        </View>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        container: {
            height: 40,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.surface,
            borderRadius: 999,
            paddingHorizontal: 14,
            marginBottom: 12,
            borderColor: theme.colors.border,
            borderWidth: 1,
        },
        leftBtn: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        input: {
            flex: 1,
            height: '100%',
            fontSize: 14,
            marginHorizontal: 10,
            fontFamily: 'Epilogue-Regular',
            color: theme.colors.text,
        },
        clearBtn: {
            justifyContent: 'center',
            alignItems: 'center',
        },
    }),
)
