import { createThemedStyles } from '@/shared/theme/create-themed-styles'
import { useTheme } from '@/shared/theme/useTheme'
import React, { PropsWithChildren } from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'

type Props = PropsWithChildren<{ title?: string; style?: ViewStyle; required?: boolean }>

function RequiredStar() {
    const colors = useTheme().theme.colors
    return <Text style={{ color: colors.danger }}>{} *</Text>
}

export default function SectionCard({ title, children, style, required }: Props) {
    const styles = useStyles()
    return (
        <View style={[styles.wrap, style]}>
            {!!title && (
                <Text style={styles.title}>
                    {title}
                    {required ? <RequiredStar /> : null}
                </Text>
            )}
            <View style={styles.card}>{children}</View>
        </View>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        wrap: {
            paddingBottom: 18,
            paddingTop: 15,
            paddingHorizontal: 15,
            borderRadius: 25,
            backgroundColor: theme.colors.surface,
        },
        title: {
            fontSize: 13,
            color: theme.colors.textMuted,
            marginBottom: 10,
            fontFamily: 'Epilogue-Regular',
        },
        card: {
            shadowColor: '#888888',
            shadowOpacity: 0.03,
            shadowRadius: 15,
            shadowOffset: { width: 0, height: 7 },
        },
    }),
)
