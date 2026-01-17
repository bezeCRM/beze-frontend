import React from 'react'
import { StyleSheet, Switch, Text, View } from 'react-native'
import { useTheme } from '@/shared/theme/useTheme'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'

type Props = {
    value: boolean
    onChange: (v: boolean) => void
}

export default function OrderPlannerToggle({ value, onChange }: Props) {
    const styles = useStyles()
    const { theme } = useTheme()

    return (
        <View style={styles.card}>
            <Text style={styles.text}>В планере</Text>

            <View style={{ transform: [{ scale: 0.95 }] }}>
                <Switch
                    value={value}
                    onValueChange={onChange}
                    trackColor={{
                        false: theme.colors.border,
                        true: theme.colors.brand,
                    }}
                    thumbColor={theme.colors.surface}
                    ios_backgroundColor={theme.colors.border}
                />
            </View>
        </View>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        card: {
            backgroundColor: theme.colors.surface,
            borderRadius: 25,
            paddingRight: 15,
            paddingLeft: 18,
            paddingVertical: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        text: {
            fontSize: 14,
            color: theme.colors.text,
            fontFamily: 'Epilogue-Regular',
        },
    }),
)
