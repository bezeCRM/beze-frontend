import { Pressable, StyleSheet, Text } from 'react-native'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'

type Props = {
    active: boolean
    onPress: () => void
    title?: string
    disabled?: boolean
}

export default function TasksBtn({
    active,
    onPress,
    title = 'Все задачи',
    disabled = false,
}: Props) {
    const styles = useStyles()

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={[
                styles.btn,
                active && styles.btnActive,
                disabled && styles.btnDisabled,
            ]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
            <Text style={[styles.text, disabled && styles.textDisabled]}>{title}</Text>
        </Pressable>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        btn: {
            height: 40,
            paddingHorizontal: 16,
            borderRadius: 16,
            backgroundColor: theme.colors.surface,
            borderWidth: 2,
            borderColor: theme.colors.border,
            justifyContent: 'center',
            alignItems: 'center',
        },
        btnActive: {
            borderColor: theme.colors.brand,
        },
        btnDisabled: {
            opacity: 0.55,
        },
        text: {
            fontFamily: 'Epilogue-Regular',
            fontSize: 14,
            color: theme.colors.text,
        },
        textDisabled: {
            color: theme.colors.textMuted,
        },
    }),
)
