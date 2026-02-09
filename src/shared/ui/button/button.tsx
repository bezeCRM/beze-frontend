import { createThemedStyles } from '@/shared/theme/create-themed-styles'
import React from 'react'
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native'

type Props = {
    small?: boolean
    blue?: boolean
    red?: boolean
    modalWide?: boolean
    title: string
    onPress?: () => void
    style?: ViewStyle | [ViewStyle, ViewStyle]
    disabled?: boolean
}

export default function Button({
    small,
    blue,
    red,
    modalWide,
    title,
    onPress,
    style,
    disabled,
}: Props) {
    const styles = useStyles()
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            disabled={disabled}
            style={[
                styles.btn,
                small && styles.smallBtn,
                blue && styles.blueBtn,
                red && styles.redBtn,
                modalWide && styles.modalWideBtn,
                disabled && styles.disabled,
                style,
            ]}
        >
            <Text style={[styles.text, small && styles.smallText]}>{title}</Text>
        </TouchableOpacity>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        btn: {
            minHeight: 50,
            backgroundColor: theme.colors.brand,
            width: '100%',
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
        },
        smallBtn: { minHeight: 40 },
        blueBtn: { backgroundColor: theme.colors.info },
        redBtn: { backgroundColor: theme.colors.danger },
        modalWideBtn: {
            minHeight: 50,
            borderRadius: 0,
        },
        text: {
            color: theme.colors.fixedWhite,
            fontSize: 16,
            fontFamily: 'Epilogue-SemiBold',
        },
        smallText: { fontSize: 14 },
        disabled: { backgroundColor: theme.colors.textMuted },
    }),
)
