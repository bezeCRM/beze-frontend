import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native'
import type { OrderStatus } from '@/shared/types/types'
import PillSelect from './pill-select'
import {
    ORDER_PAYMENT_OPTIONS,
    ORDER_STATUS_OPTIONS,
    paymentPillMeta,
    statusPillMeta,
} from '../../utils/order-meta'
import { formatMoney } from '../../utils/order-format'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'
import { useTheme } from '@/shared/theme/useTheme'
import { toApiError } from '@/api'

export type DerivedOrderPaymentStatus = 'unpaid' | 'partial' | 'paid'

type Props = {
    status: OrderStatus
    paymentStatus: DerivedOrderPaymentStatus
    totalPrice: number
    paidAmount: number

    // должны быть async, чтобы мы могли показывать loading и ловить ошибки
    onChangeStatus: (v: OrderStatus) => Promise<void>
    onChangePaidAmount: (v: number) => Promise<void>

    // сюда прокинешь show toast снаружи
    onError?: (message: string) => void
}

function parseMoney(text: string) {
    const n = Number(
        String(text ?? '')
            .replace(/\s/g, '')
            .replace(',', '.'),
    )
    return Number.isFinite(n) ? n : 0
}

function toErrorMessage(e: unknown) {
    return toApiError(e).message
}

export default function OrderStatusBar({
    status,
    paymentStatus,
    totalPrice,
    paidAmount,
    onChangeStatus,
    onChangePaidAmount,
    onError,
}: Props) {
    const styles = useStyles()
    const colors = useTheme().theme.colors

    const statusBg = useMemo(() => statusPillMeta(status, colors).bg, [status, colors])
    const payBg = useMemo(
        () => paymentPillMeta(paymentStatus, colors).bg,
        [paymentStatus, colors],
    )

    const editingRef = useRef(false)
    const [paidText, setPaidText] = useState(formatMoney(paidAmount))

    const [isSavingStatus, setIsSavingStatus] = useState(false)
    const [isSavingPaymentPreset, setIsSavingPaymentPreset] = useState(false)
    const [isSavingPaidAmount, setIsSavingPaidAmount] = useState(false)

    const statusIsBusy = isSavingStatus
    const paidAmountIsBusy = isSavingPaymentPreset || isSavingPaidAmount

    useEffect(() => {
        // синхронизируем инпут только когда partial и не редактируем руками
        if (paymentStatus !== 'partial') return
        if (editingRef.current) return
        setPaidText(formatMoney(paidAmount))
    }, [paidAmount, paymentStatus])

    const typedPaid = paymentStatus === 'partial' ? parseMoney(paidText) : paidAmount
    const paidClamped = Math.min(Math.max(0, typedPaid), Math.max(0, totalPrice || 0))
    const remaining = Math.max(0, (totalPrice || 0) - paidClamped)

    const handleChangeStatus = async (next: OrderStatus) => {
        if (statusIsBusy) return
        if (next === status) return

        try {
            setIsSavingStatus(true)
            await onChangeStatus(next)
        } catch (e) {
            onError?.(toErrorMessage(e))
        } finally {
            setIsSavingStatus(false)
        }
    }

    const handleChangePaymentPreset = async (next: DerivedOrderPaymentStatus) => {
        if (paidAmountIsBusy) return
        if (next === paymentStatus) return

        if (next === 'partial') {
            const tp = Math.max(0, totalPrice || 0)

            // если нечего делить — partial не имеет смысла
            if (tp <= 0) return

            // если уже partial (между 0 и total), ничего не делаем
            if (paidAmount > 0 && paidAmount < tp) return

            // половина суммы
            const target = Math.floor(tp / 2)

            try {
                setIsSavingPaymentPreset(true)
                await onChangePaidAmount(target)
            } catch (e) {
                onError?.(toErrorMessage(e))
            } finally {
                setIsSavingPaymentPreset(false)
            }

            return
        }

        const target = next === 'paid' ? Math.max(0, totalPrice || 0) : 0

        try {
            setIsSavingPaymentPreset(true)
            await onChangePaidAmount(target)
        } catch (e) {
            onError?.(toErrorMessage(e))
        } finally {
            setIsSavingPaymentPreset(false)
        }
    }

    const handlePaidBlur = async () => {
        editingRef.current = false
        if (paidAmountIsBusy) return

        try {
            setIsSavingPaidAmount(true)
            await onChangePaidAmount(paidClamped)
        } catch (e) {
            onError?.(toErrorMessage(e))
            // откатываем текст к текущему paidAmount, чтобы не зависнуть в неверном значении
            setPaidText(formatMoney(paidAmount))
        } finally {
            setIsSavingPaidAmount(false)
        }
    }

    return (
        <View style={styles.wrap}>
            <View style={styles.row}>
                <View style={styles.flex}>
                    <PillSelect
                        value={status}
                        options={ORDER_STATUS_OPTIONS}
                        backgroundColor={statusBg}
                        onSelect={handleChangeStatus}
                        disabled={statusIsBusy}
                    />
                </View>
                {isSavingStatus ? (
                    <ActivityIndicator size="small" />
                ) : (
                    <View style={styles.spinnerPlaceholder} />
                )}
            </View>

            <View style={styles.row}>
                <View style={styles.flex}>
                    <PillSelect
                        value={paymentStatus}
                        options={ORDER_PAYMENT_OPTIONS as any}
                        backgroundColor={payBg}
                        onSelect={handleChangePaymentPreset}
                        disabled={paidAmountIsBusy}
                    />
                </View>
                {isSavingPaymentPreset ? (
                    <ActivityIndicator size="small" />
                ) : (
                    <View style={styles.spinnerPlaceholder} />
                )}
            </View>

            {paymentStatus === 'partial' && (
                <View style={styles.payRow}>
                    <View style={styles.left}>
                        <Text style={styles.label} allowFontScaling={false}>
                            Получено
                        </Text>
                        <View style={styles.inputWrap}>
                            <TextInput
                                allowFontScaling={false}
                                value={paidText}
                                onChangeText={setPaidText}
                                editable={!paidAmountIsBusy}
                                onFocus={() => {
                                    editingRef.current = true
                                }}
                                onBlur={() => {
                                    void handlePaidBlur()
                                }}
                                keyboardType="numeric"
                                style={styles.input}
                                returnKeyType="done"
                            />
                            <Text style={styles.currency}>₽</Text>
                        </View>
                    </View>

                    <View style={styles.right}>
                        <Text style={styles.label} allowFontScaling={false}>
                            Остаток
                        </Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={true}
                            contentContainerStyle={[
                                styles.remainScrollContent,
                                { alignItems: 'center' },
                            ]}
                            style={styles.remainScroll}
                        >
                            <Text
                                style={styles.remain}
                                numberOfLines={1}
                                allowFontScaling={false}
                            >
                                {formatMoney(remaining)} ₽
                            </Text>
                        </ScrollView>
                    </View>
                </View>
            )}
        </View>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        wrap: { marginTop: 15, rowGap: 10 },

        row: {
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: 10,
        },
        flex: { flex: 1 },
        spinnerPlaceholder: { width: 20, height: 20 },

        payRow: {
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: 25,
            marginLeft: 5,
            marginTop: 8,
        },
        left: { flexDirection: 'row', alignItems: 'center', columnGap: 8 },
        right: { flexDirection: 'row', alignItems: 'center', columnGap: 8, height: 30 },

        label: {
            fontSize: 14,
            color: theme.colors.text,
            fontFamily: 'Epilogue-Regular',
        },
        inputWrap: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.surface,
        },
        input: {
            minWidth: 45,
            maxWidth: 85,
            textAlign: 'center',
            fontSize: 18,
            color: theme.colors.text,
            fontFamily: 'Epilogue-Regular',
            paddingVertical: 0,
        },
        currency: {
            marginLeft: 6,
            fontSize: 16,
            color: theme.colors.text,
            fontFamily: 'Epilogue-Regular',
        },
        remain: {
            fontSize: 18,
            color: theme.colors.text,
            fontFamily: 'Epilogue-SemiBold',
        },
        remainScroll: {
            maxWidth: 78,
            height: 40,
        },
        remainScrollContent: {
            flexGrow: 1,
            justifyContent: 'flex-end',
        },
    }),
)
