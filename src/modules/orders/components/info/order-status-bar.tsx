import React, { useEffect, useMemo, useRef, useState } from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import type { OrderPaymentStatus, OrderStatus } from '@/shared/types/types'
import PillSelect from './pill-select'
import {
    ORDER_PAYMENT_OPTIONS,
    ORDER_STATUS_OPTIONS,
    paymentPillMeta,
    statusPillMeta,
} from '../../utils/order-meta'
import { theme } from '@/shared/theme'
import { formatMoney } from '../../utils/order-format'

type Props = {
    status: OrderStatus
    paymentStatus: OrderPaymentStatus
    totalPrice: number
    paidAmount: number
    onChangeStatus: (v: OrderStatus) => void
    onChangePayment: (v: OrderPaymentStatus) => void
    onChangePaidAmount: (v: number) => void
}

function parseMoney(text: string) {
    const n = Number(
        String(text ?? '')
            .replace(/\s/g, '')
            .replace(',', '.'),
    )
    return Number.isFinite(n) ? n : 0
}

export default function OrderStatusBar({
    status,
    paymentStatus,
    totalPrice,
    paidAmount,
    onChangeStatus,
    onChangePayment,
    onChangePaidAmount,
}: Props) {
    const statusBg = useMemo(() => statusPillMeta(status).bg, [status])
    const payBg = useMemo(() => paymentPillMeta(paymentStatus).bg, [paymentStatus])

    const editingRef = useRef(false)
    const [paidText, setPaidText] = useState(formatMoney(paidAmount))

    useEffect(() => {
        if (paymentStatus !== 'partial') return
        if (editingRef.current) return
        setPaidText(formatMoney(paidAmount))
    }, [paidAmount, paymentStatus])

    const typedPaid = paymentStatus === 'partial' ? parseMoney(paidText) : paidAmount
    const paidClamped = Math.min(Math.max(0, typedPaid), Math.max(0, totalPrice || 0))
    const remaining = Math.max(0, (totalPrice || 0) - paidClamped)

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

            {paymentStatus === 'partial' && (
                <View style={styles.payRow}>
                    <View style={styles.left}>
                        <Text style={styles.label}>Получено</Text>
                        <View style={styles.inputWrap}>
                            <TextInput
                                value={paidText}
                                onChangeText={setPaidText}
                                onFocus={() => {
                                    editingRef.current = true
                                }}
                                onBlur={() => {
                                    editingRef.current = false
                                    onChangePaidAmount(paidClamped)
                                }}
                                keyboardType="numeric"
                                style={styles.input}
                                returnKeyType="done"
                            />
                            <Text style={styles.currency}>₽</Text>
                        </View>
                    </View>

                    <View style={styles.right}>
                        <Text style={styles.label}>Остаток</Text>
                        <Text style={styles.remain}>{formatMoney(remaining)} ₽</Text>
                    </View>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    wrap: { marginTop: 15, rowGap: 10 },

    payRow: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 25,
        marginLeft: 5,
        marginTop: 8,
    },
    left: { flexDirection: 'row', alignItems: 'center', columnGap: 8 },
    right: { flexDirection: 'row', alignItems: 'center', columnGap: 8 },

    label: {
        fontSize: 14,
        color: theme.colors.mainBlack,
        fontFamily: 'Epilogue-Regular',
    },
    inputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: theme.colors.lineGray,
        backgroundColor: theme.colors.mainWhite,
    },
    input: {
        minWidth: 45,
        maxWidth: 85,
        textAlign: 'center',
        fontSize: 18,
        color: theme.colors.mainBlack,
        fontFamily: 'Epilogue-Regular',
        paddingVertical: 0,
    },
    currency: {
        marginLeft: 6,
        fontSize: 16,
        color: theme.colors.mainBlack,
        fontFamily: 'Epilogue-Regular',
    },
    remain: {
        fontSize: 18,
        color: theme.colors.mainBlack,
        fontFamily: 'Epilogue-SemiBold',
    },
})
