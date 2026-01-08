import { theme } from '@/shared/theme'
import type { OrderPaymentStatus, OrderStatus } from '@/shared/types/types'

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

export function statusPillMeta(status: OrderStatus) {
    if (status === 'inWork') return { label: 'В работе', bg: theme.colors.inworkYellow }
    if (status === 'new') return { label: 'Новый', bg: theme.colors.mainBlue }
    if (status === 'ready') return { label: 'Готов', bg: theme.colors.successGreen }
    if (status === 'delivered') return { label: 'Выдан', bg: theme.colors.mainGray }
    return { label: 'Отменён', bg: theme.colors.errorRed }
}

export function paymentPillMeta(payment: OrderPaymentStatus) {
    if (payment === 'paid') return { label: 'Оплачено', bg: theme.colors.successGreen }
    if (payment === 'partial')
        return { label: 'Частичная оплата', bg: theme.colors.inworkYellow }
    return { label: 'Не оплачен', bg: theme.colors.errorRed }
}
