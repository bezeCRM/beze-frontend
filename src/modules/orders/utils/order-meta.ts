import { useMemo } from 'react'
import { useTheme } from '@/shared/theme/useTheme'
import type { OrderPaymentStatus, OrderStatus } from '@/shared/types/types'

type Colors = {
    brand: string
    background: string
    surface: string
    text: string
    textMuted: string
    border: string
    info: string
    success: string
    danger: string
    warning: string
}

export const ORDER_STATUS_OPTIONS: { id: OrderStatus; name: string }[] = [
    { id: 'new', name: 'Новый' },
    { id: 'inWork', name: 'В работе' },
    { id: 'ready', name: 'Готов' },
    { id: 'delivered', name: 'Выдан' },
    { id: 'canceled', name: 'Отменён' },
]

export const ORDER_PAYMENT_OPTIONS: { id: OrderPaymentStatus; name: string }[] = [
    { id: 'unpaid', name: 'Не оплачен' },
    { id: 'partial', name: 'Частичная оплата' },
    { id: 'paid', name: 'Оплачено' },
]

export function statusPillMeta(status: OrderStatus, colors: Colors) {
    if (status === 'inWork') return { label: 'В работе', bg: colors.warning }
    if (status === 'new') return { label: 'Новый', bg: colors.info }
    if (status === 'ready') return { label: 'Готов', bg: colors.success }
    if (status === 'delivered') return { label: 'Выдан', bg: colors.textMuted }
    return { label: 'Отменён', bg: colors.danger }
}

export function paymentPillMeta(payment: OrderPaymentStatus, colors: Colors) {
    if (payment === 'paid') return { label: 'Оплачено', bg: colors.success }
    if (payment === 'partial') return { label: 'Частичная оплата', bg: colors.warning }
    return { label: 'Не оплачен', bg: colors.danger }
}

export function useOrderPillMeta() {
    const { theme } = useTheme()
    const colors = theme.colors

    return useMemo(() => {
        return {
            statusPillMeta: (status: OrderStatus) => statusPillMeta(status, colors),
            paymentPillMeta: (payment: OrderPaymentStatus) =>
                paymentPillMeta(payment, colors),
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [theme.scheme])
}
