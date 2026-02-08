import { View, Pressable, Text, StyleSheet, ViewStyle } from 'react-native'
import { ProductUnit } from '@/shared/types/types'
import SectionCard from '../section/section-card'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'
import { useTheme } from '@/shared/theme/useTheme'

type Props = {
    value: ProductUnit
    onChange?: (v: ProductUnit) => void
    style?: ViewStyle
    disabled?: boolean
}

export default function UnitField({ value, onChange, style, disabled }: Props) {
    const styles = useStyles()
    const colors = useTheme().theme.colors
    const options: { label: string; value: ProductUnit }[] = [
        { label: 'Штука', value: 'piece' },
        { label: 'Килограмм', value: 'kg' },
    ]

    return (
        <SectionCard title="Единица измерения" required>
            <View style={[styles.row, style]} accessibilityRole="radiogroup">
                {options.map(opt => {
                    const checked = value === opt.value
                    return (
                        <Pressable
                            key={opt.value}
                            style={styles.item}
                            onPress={() => !disabled && onChange?.(opt.value)}
                            accessibilityRole="radio"
                            accessibilityState={{ checked, disabled }}
                            android_ripple={{ color: colors.brand }}
                            hitSlop={{ top: 7, bottom: 7, left: 7, right: 7 }}
                        >
                            <View style={styles.dot}>
                                {checked && <View style={styles.dotInner} />}
                            </View>
                            <Text style={[styles.text, checked && styles.textActive]}>
                                {opt.label}
                            </Text>
                        </Pressable>
                    )
                })}
            </View>
        </SectionCard>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        row: {
            flexDirection: 'row',
            gap: 20,
            marginTop: 5,
        },
        item: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        dot: {
            width: 20,
            height: 20,
            borderRadius: 99,
            borderWidth: 1,
            borderColor: theme.colors.brand,
            marginRight: 7,
            alignItems: 'center',
            justifyContent: 'center',
        },
        dotInner: {
            width: 12,
            height: 12,
            borderRadius: 99,
            backgroundColor: theme.colors.brand,
        },
        text: {
            color: theme.colors.text,
            fontSize: 14,
        },
        textActive: {},
    }),
)
