import { useCallback, useRef, useMemo } from 'react'
import {
    View,
    TextInput,
    StyleSheet,
    TextInputProps,
    TouchableOpacity,
    Keyboard,
} from 'react-native'
import SearchIcon from '@/assets/images/search.svg'
import SearchBlueIcon from '@/assets/images/search-blue.svg'
import ClearSearchIcon from '@/assets/images/clear-search-icon.svg'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'
import { useTheme } from '@/shared/theme/useTheme'

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

    const LeftIcon = useMemo(() => (canSubmit ? SearchBlueIcon : SearchIcon), [canSubmit])

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={handleSubmit}
                disabled={!canSubmit}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.leftBtn}
            >
                <LeftIcon width={16} height={16} />
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
                <ClearSearchIcon width={12} height={12} />
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
