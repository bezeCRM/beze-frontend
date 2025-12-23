import { View, Text, StyleSheet } from 'react-native'
import SectionCard from '@/shared/ui/section/section-card'
import type { Product } from '@/shared/types/types'
import { theme } from '@/shared/theme'

type Props = {
    product: Product
}

export default function ProductInfoBlock({ product }: Props) {
    return (
        <SectionCard title="Информация о товаре">
            {/* категория */}
            <View style={styles.row}>
                <Text style={styles.label}>Категория:&nbsp;</Text>
                <Text style={styles.value}>{product.category?.name ?? '—'}</Text>
            </View>

            {/* ингредиенты */}
            <View style={styles.block}>
                <Text style={styles.subTitle}>Ингредиенты:</Text>

                {product.ingredients?.length ? (
                    <View style={styles.list}>
                        {product.ingredients.map(i => (
                            <Text key={i.id} style={styles.text}>
                                {i.name} — {i.weightGrams} г
                            </Text>
                        ))}
                    </View>
                ) : (
                    <Text style={styles.muted}>—</Text>
                )}
            </View>

            {/* рецепт */}
            <View style={styles.block}>
                <Text style={styles.subTitle}>Рецепт:</Text>
                <Text style={styles.text}>{product.recipe?.trim() || '—'}</Text>
            </View>
        </SectionCard>
    )
}

const { colors } = theme

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    label: {
        fontSize: 14,
        fontFamily: 'Epilogue-SemiBold',
        lineHeight: 18,
    },
    value: {
        fontSize: 14,
        fontFamily: 'Epilogue-Regular',
        lineHeight: 18,
    },

    block: {
        marginTop: 10,
    },
    subTitle: {
        fontSize: 14,
        fontFamily: 'Epilogue-SemiBold',
        lineHeight: 18,
        marginBottom: 5,
    },

    list: {
        rowGap: 2,
    },
    text: {
        fontSize: 14,
        fontFamily: 'Epilogue-Regular',
        lineHeight: 18,
        color: colors.mainBlack,
    },
    muted: {
        fontSize: 14,
        fontFamily: 'Epilogue-Regular',
        lineHeight: 18,
        color: colors.mainGray,
    },
})
