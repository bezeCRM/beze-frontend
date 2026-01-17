import { View, Text, StyleSheet } from 'react-native'
import type { Filling } from '@/shared/types/types'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'

type Props = {
    fillings: Filling[]
}

export default function FillingsChips({ fillings }: Props) {
    const styles = useStyles()
    if (!fillings.length) return null

    return (
        <View style={styles.wrap}>
            {fillings.map(f => (
                <View key={f.id} style={styles.chip}>
                    <Text style={styles.text} numberOfLines={1}>
                        {f.name}
                    </Text>
                </View>
            ))}
        </View>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        wrap: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 7,
            marginBottom: 10,
        },
        chip: {
            backgroundColor: theme.colors.brand,
            paddingHorizontal: 15,
            paddingVertical: 10,
            borderRadius: 999,
        },
        text: {
            color: theme.colors.fixedWhite,
            fontSize: 14,
            fontFamily: 'Epilogue-Semibold',
            lineHeight: 14,
        },
    }),
)
