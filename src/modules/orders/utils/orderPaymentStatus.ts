import type { Order } from '@/shared/types/types'

export type DerivedOrderPaymentStatus = 'unpaid' | 'partial' | 'paid'

export function getOrderPaymentStatus(
    order: Pick<Order, 'totalPrice' | 'paidAmount'>,
): DerivedOrderPaymentStatus {
    const totalCents = Math.round((order.totalPrice ?? 0) * 100)
    const paidCents = Math.round((order.paidAmount ?? 0) * 100)

    if (totalCents <= 0) return 'paid'
    if (paidCents <= 0) return 'unpaid'
    if (paidCents >= totalCents) return 'paid'
    return 'partial'
}
