import React from 'react'
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native'
import { theme } from '@/shared/theme'

type Props = {
    small?: boolean
    blue?: boolean
    title: string
    onPress?: () => void
    style?: ViewStyle
    disabled?: boolean
}

export default function Button({ small, blue, title, onPress, style, disabled }: Props) {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            disabled={disabled}
            style={[
                styles.btn,
                small && styles.smallBtn,
                blue && styles.blueBtn,
                disabled && styles.disabled,
                style,
            ]}
        >
            <Text style={[styles.text, small && styles.smallText]}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    btn: {
        height: 50,
        backgroundColor: theme.colors.mainPink,
        width: '100%',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    smallBtn: { height: 40 },
    blueBtn: { backgroundColor: theme.colors.mainBlue },
    text: {
        color: theme.colors.mainWhite,
        fontSize: 16,
        fontFamily: 'Epilogue-SemiBold',
    },
    smallText: { fontSize: 14 },
    disabled: { backgroundColor: theme.colors.mainGray },
})
