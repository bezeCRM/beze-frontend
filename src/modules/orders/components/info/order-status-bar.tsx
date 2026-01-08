import React, { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import type { OrderPaymentStatus, OrderStatus } from '@/shared/types/types'
import PillSelect from './pill-select'
import {
    ORDER_PAYMENT_OPTIONS,
    ORDER_STATUS_OPTIONS,
    paymentPillMeta,
    statusPillMeta,
} from '../../utils/order-meta'

type Props = {
    status: OrderStatus
    paymentStatus: OrderPaymentStatus
    onChangeStatus: (v: OrderStatus) => void
    onChangePayment: (v: OrderPaymentStatus) => void
}

export default function OrderStatusBar({
    status,
    paymentStatus,
    onChangeStatus,
    onChangePayment,
}: Props) {
    const statusBg = useMemo(() => statusPillMeta(status).bg, [status])
    const payBg = useMemo(() => paymentPillMeta(paymentStatus).bg, [paymentStatus])

    return (
        <View style={styles.wrap}>
            <PillSelect
                value={status}
                options={ORDER_STATUS_OPTIONS}
                backgroundColor={statusBg}
                onSelect={onChangeStatus}
            />
            <PillSelect
                value={paymentStatus}
                options={ORDER_PAYMENT_OPTIONS}
                backgroundColor={payBg}
                onSelect={onChangePayment}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    wrap: {
        marginTop: 15,
        rowGap: 10,
    },
})
