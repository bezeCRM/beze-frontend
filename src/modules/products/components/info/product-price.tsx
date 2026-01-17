import { Text, StyleSheet } from 'react-native'
import SectionCard from '@/shared/ui/section/section-card'
import type { ProductUnit } from '@/shared/types/types'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'

type Props = {
    price: number
    unit: ProductUnit
}

function formatPrice(value: number) {
    return Math.round(value)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

function unitLabel(unit: ProductUnit) {
    return unit === 'kg' ? 'кг' : 'шт'
}

export default function ProductPrice({ price, unit }: Props) {
    const styles = useStyles()
    return (
        <SectionCard title="Цена">
            <Text style={styles.price}>
                {formatPrice(price)} ₽/{unitLabel(unit)}
            </Text>
        </SectionCard>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        price: {
            color: theme.colors.text,
            fontSize: 18,
            fontFamily: 'Epilogue-SemiBold',
            lineHeight: 21.6,
        },
    }),
)
