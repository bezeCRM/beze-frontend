import { createThemedStyles } from '@/shared/theme/create-themed-styles'
import { useTheme } from '@/shared/theme/useTheme'
import React from 'react'
import {
    View,
    StyleSheet,
    Pressable,
    Text,
    type StyleProp,
    type ViewStyle,
    type PressableStateCallbackType,
} from 'react-native'

type Props = {
    primaryTitle?: string
    secondaryTitle?: string
    onPrimaryPress?: () => void
    onSecondaryPress?: () => void
    primaryDisabled?: boolean
    danger?: boolean
    gap?: number
}

export default function ModalFooter({
    primaryTitle,
    secondaryTitle,
    onPrimaryPress,
    onSecondaryPress,
    primaryDisabled,
    danger,
    gap = 20,
}: Props) {
    const colors = useTheme().theme.colors
    const styles = useStyles()

    const buttonsCount = Number(!!primaryTitle) + Number(!!secondaryTitle)
    const isDouble = buttonsCount === 2

    const radius = isDouble ? 15 : 0

    const primaryBg = danger ? colors.danger : colors.brand
    const primaryBorder = danger ? colors.danger : colors.brand

    const baseDynamicStyle: ViewStyle = {
        borderRadius: radius,
    }

    const secondaryStyle = ({
        pressed,
    }: PressableStateCallbackType): StyleProp<ViewStyle> => [
        styles.buttonBase,
        baseDynamicStyle,
        styles.secondaryButton,
        pressed ? styles.pressed : null,
    ]

    const primaryStyle = ({
        pressed,
    }: PressableStateCallbackType): StyleProp<ViewStyle> => [
        styles.buttonBase,
        baseDynamicStyle,
        styles.primaryButton,
        { backgroundColor: primaryBg, borderColor: primaryBorder },
        primaryDisabled ? styles.primaryDisabled : null,
        pressed && !primaryDisabled ? styles.pressed : null,
    ]

    return (
        <View
            style={[
                styles.container,
                { columnGap: gap },
                isDouble ? { paddingHorizontal: 40 } : null,
            ]}
        >
            {secondaryTitle && (
                <Pressable onPress={onSecondaryPress} style={secondaryStyle} hitSlop={10}>
                    <Text style={styles.secondaryText}>{secondaryTitle}</Text>
                </Pressable>
            )}

            {primaryTitle && (
                <Pressable
                    onPress={onPrimaryPress}
                    disabled={primaryDisabled}
                    style={primaryStyle}
                    hitSlop={10}
                >
                    <Text style={styles.primaryText}>{primaryTitle}</Text>
                </Pressable>
            )}
        </View>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            justifyContent: 'center',
        },

        buttonBase: {
            height: 45,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            flex: 1,
        },

        secondaryButton: {
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.brand,
        },

        primaryButton: {
            borderWidth: 1,
        },

        secondaryText: {
            fontSize: 16,
            color: theme.colors.brand,
            fontFamily: 'Epilogue-Regular',
        },

        primaryText: {
            fontSize: 16,
            color: theme.colors.fixedWhite,
            fontFamily: 'Epilogue-Semibold',
        },

        pressed: {
            opacity: 0.85,
        },

        primaryDisabled: {
            backgroundColor: theme.colors.textMuted,
            borderColor: 'transparent',
        },
    }),
)
