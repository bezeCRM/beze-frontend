import React from 'react'
import { StyleSheet, Text } from 'react-native'
import SectionCard from '@/shared/ui/section/section-card'
import { theme } from '@/shared/theme'
import type { Order } from '@/shared/types/types'
import { formatDeliveryDateTime, formatDeliveryTitle } from '../../utils/order-format'

type Props = { order: Order }

export default function OrderDeliveryInfo({ order }: Props) {
    return (
        <SectionCard title="Доставка">
            <Text style={styles.title} numberOfLines={2}>
                {formatDeliveryTitle(order.deliveryType, order.address)}
            </Text>

            <Text style={styles.date}>
                {formatDeliveryDateTime(order.date, order.time)}
            </Text>
        </SectionCard>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 16,
        color: theme.colors.mainBlack,
        fontFamily: 'Epilogue-SemiBold',
    },
    date: {
        marginTop: 8,
        fontSize: 16,
        color: theme.colors.mainBlack,
        fontFamily: 'Epilogue-Regular',
    },
})
