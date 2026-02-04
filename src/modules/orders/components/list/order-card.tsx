import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import type { Order, OrderStatus } from '@/shared/types/types'
import PaymentStatus from './payment-status'
import { useTheme } from '@/shared/theme/useTheme'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'
import { formatDeliveryDateTime } from '../../utils/order-format'

type Props = {
    order: Order
    onPress?: () => void
}

function StatusPill(status: OrderStatus) {
    const colors = useTheme().theme.colors

    if (status === 'inWork') return { label: 'В работе', bg: colors.warning }
    if (status === 'new') return { label: 'Новый', bg: colors.info }
    if (status === 'ready') return { label: 'Готов', bg: colors.success }
    if (status === 'delivered') return { label: 'Выдан', bg: colors.textMuted }
    return { label: 'Отменён', bg: colors.danger }
}

export default function OrderCard({ order, onPress }: Props) {
    const styles = useStyles()
    const title = order.name?.trim() ? order.name : `Заказ #${order.id}`
    const s = StatusPill(order.status)

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
            <View style={styles.topRow}>
                <Text style={styles.title} numberOfLines={2}>
                    {title}
                </Text>

                <View style={[styles.pill, { backgroundColor: s.bg }]}>
                    <Text style={styles.pillText}>{s.label}</Text>
                </View>
            </View>

            {!!order.date && (
                <Text
                    style={styles.date}
                >{`к ${formatDeliveryDateTime(order.date, order.time)}`}</Text>
            )}

            <View style={styles.bottomRow}>
                <Text style={styles.price}>
                    {order.totalPrice.toLocaleString('ru-RU')} ₽
                </Text>
                <PaymentStatus status={order.paymentStatus} />
            </View>
        </TouchableOpacity>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        card: {
            backgroundColor: theme.colors.surface,
            borderRadius: 25,
            paddingHorizontal: 17,
            paddingVertical: 17,
            marginBottom: 15,
        },
        topRow: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            columnGap: 10,
        },
        title: {
            flex: 1,
            fontSize: 16,
            lineHeight: 19.2,
            color: theme.colors.text,
            fontFamily: 'Epilogue-SemiBold',
        },
        pill: {
            height: 22,
            paddingHorizontal: 10,
            borderRadius: 999,
            alignItems: 'center',
            justifyContent: 'center',
        },
        pillText: {
            fontSize: 12,
            color: theme.colors.fixedWhite,
            fontFamily: 'Epilogue-SemiBold',
        },
        date: {
            marginTop: 7,
            fontSize: 14,
            color: theme.colors.textMuted,
            fontFamily: 'Epilogue-Regular',
        },
        bottomRow: {
            marginTop: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            columnGap: 10,
        },
        price: {
            fontSize: 16,
            color: theme.colors.text,
            fontFamily: 'Epilogue-SemiBold',
        },
    }),
)
