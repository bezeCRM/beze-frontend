import { ScrollView, StyleSheet, Text, Pressable, View } from 'react-native'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'

type NotificationRowProps<T extends string> = {
    label: string
    hint?: string
    options: readonly { value: T; label: string }[]
    value: T
    onChange: (value: T) => void
}

export function NotificationRow<T extends string>({
    label,
    hint,
    options,
    value,
    onChange,
}: NotificationRowProps<T>) {
    const styles = useStyles()

    return (
        <View style={styles.row}>
            <View style={styles.labelBlock}>
                <Text style={styles.label}>{label}</Text>
                {hint ? <Text style={styles.hint}>{hint}</Text> : null}
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipsContent}
            >
                {options.map(opt => {
                    const active = opt.value === value
                    return (
                        <Pressable
                            key={opt.value}
                            style={[styles.chip, active && styles.chipActive]}
                            onPress={() => onChange(opt.value)}
                            hitSlop={6}
                        >
                            <Text
                                style={[styles.chipText, active && styles.chipTextActive]}
                            >
                                {opt.label}
                            </Text>
                        </Pressable>
                    )
                })}
            </ScrollView>
        </View>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        row: { rowGap: 10 },
        labelBlock: { rowGap: 2 },
        label: {
            fontSize: 13,
            fontFamily: 'Epilogue-SemiBold',
            color: theme.colors.text,
        },
        hint: {
            fontSize: 12,
            color: theme.colors.textMuted,
            fontFamily: 'Epilogue-Regular',
        },
        chipsContent: {
            flexDirection: 'row',
            gap: 7,
            paddingRight: 4,
        },
        chip: {
            paddingHorizontal: 12,
            paddingVertical: 7,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.surface,
        },
        chipActive: {
            borderColor: theme.colors.brand,
            backgroundColor: theme.colors.brand,
        },
        chipText: {
            fontSize: 14,
            fontFamily: 'Epilogue-Regular',
            color: theme.colors.textMuted,
        },
        chipTextActive: {
            color: theme.colors.background,
            fontFamily: 'Epilogue-Regular',
        },
    }),
)
