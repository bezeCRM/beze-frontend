import { Text, StyleSheet } from 'react-native'
import SectionCard from '@/shared/ui/section/section-card'
import type { ProductUnit } from '@/shared/types/types'
import { theme } from '@/shared/theme'

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
    return (
        <SectionCard title="Цена">
            <Text style={styles.price}>
                {formatPrice(price)} ₽/{unitLabel(unit)}
            </Text>
        </SectionCard>
    )
}

const { colors } = theme

const styles = StyleSheet.create({
    price: {
        color: colors.mainBlack,
        fontSize: 18,
        fontFamily: 'Epilogue-SemiBold',
        lineHeight: 21.6,
    },
})
