import { useCallback, useMemo } from 'react'
import { useOrdersStore } from '../store/orders.store'
import type { OrderStatus } from '@/shared/types/types'
import {
    getOrderPaymentStatus,
    type DerivedOrderPaymentStatus,
} from '../utils/orderPaymentStatus'

export function useOrderInfo(orderId: string) {
    const order = useOrdersStore(s => s.getById(orderId))
    const patchOrder = useOrdersStore(s => s.patchOrder)
    const removeOrder = useOrdersStore(s => s.removeOrder)

    const paymentStatus = order ? getOrderPaymentStatus(order) : 'unpaid'

    const setStatus = useCallback(
        (status: OrderStatus) => patchOrder(orderId, { status }),
        [orderId, patchOrder],
    )

    const setPaidAmount = useCallback(
        (paidAmount: number) => patchOrder(orderId, { paidAmount }),
        [orderId, patchOrder],
    )

    const setInPlanner = useCallback(
        (inPlanner: boolean) => patchOrder(orderId, { inPlanner }),
        [orderId, patchOrder],
    )

    // замена setPaymentStatus: меняем paidAmount
    const setPaymentStatus = useCallback(
        (next: DerivedOrderPaymentStatus) => {
            const total = order?.totalPrice ?? 0
            if (next === 'paid') return patchOrder(orderId, { paidAmount: total })
            if (next === 'unpaid') return patchOrder(orderId, { paidAmount: 0 })
            // partial: ничего не выставляем автоматически, пользователь введёт paidAmount отдельно
            return Promise.resolve()
        },
        [order?.totalPrice, orderId, patchOrder],
    )

    const api = useMemo(
        () => ({
            paymentStatus,
            setStatus,
            setPaymentStatus,
            setPaidAmount,
            setInPlanner,
            removeOrder,
        }),
        [
            paymentStatus,
            setStatus,
            setPaymentStatus,
            setPaidAmount,
            setInPlanner,
            removeOrder,
        ],
    )

    return { order, ...api }
}
