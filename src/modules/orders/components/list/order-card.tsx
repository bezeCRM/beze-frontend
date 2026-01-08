import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import type { Order, OrderStatus } from '@/shared/types/types'
import { theme } from '@/shared/theme'
import PaymentStatus from './payment-status'

type Props = {
    order: Order
    onPress?: () => void
}

function statusPill(status: OrderStatus) {
    if (status === 'inWork') return { label: 'В работе', bg: theme.colors.inworkYellow }
    if (status === 'new') return { label: 'Новый', bg: theme.colors.mainBlue }
    if (status === 'ready') return { label: 'Готов', bg: theme.colors.successGreen }
    if (status === 'delivered') return { label: 'Выдан', bg: theme.colors.mainGray }
    return { label: 'Отменён', bg: theme.colors.errorRed }
}

export default function OrderCard({ order, onPress }: Props) {
    const title = order.name?.trim() ? order.name : `Заказ #${order.id}`
    const s = statusPill(order.status)

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

            {!!order.date && <Text style={styles.date}>{`К ${order.date}`}</Text>}

            <View style={styles.bottomRow}>
                <Text style={styles.price}>
                    {order.totalPrice.toLocaleString('ru-RU')} ₽
                </Text>
                <PaymentStatus status={order.paymentStatus} />
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.mainWhite,
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
        color: theme.colors.mainBlack,
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
        color: theme.colors.mainWhite,
        fontFamily: 'Epilogue-SemiBold',
    },
    date: {
        marginTop: 8,
        fontSize: 13,
        color: theme.colors.mainGray,
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
        color: theme.colors.mainBlack,
        fontFamily: 'Epilogue-SemiBold',
    },
})
