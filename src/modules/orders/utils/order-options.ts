import type { OrderPaymentStatus, OrderStatus } from '../hooks/useOrderCreateForm'

export const ORDER_PAYMENT_OPTIONS: { id: OrderPaymentStatus; name: string }[] = [
    { id: 'unpaid', name: 'Не оплачен' },
    { id: 'partial', name: 'Частичная оплата' },
    { id: 'paid', name: 'Оплачено' },
]

export const ORDER_STATUS_OPTIONS: { id: OrderStatus; name: string }[] = [
    { id: 'new', name: 'Новый' },
    { id: 'inWork', name: 'В работе' },
    { id: 'ready', name: 'Готов' },
    { id: 'delivered', name: 'Выдан' },
    { id: 'canceled', name: 'Отменён' },
]
