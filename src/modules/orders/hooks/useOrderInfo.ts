import { useCallback, useMemo } from 'react'
import { useOrdersStore } from '../store/orders.store'
import type { OrderPaymentStatus, OrderStatus } from '@/shared/types/types'

export function useOrderInfo(orderId: string) {
    const order = useOrdersStore(s => s.getById(orderId))
    const updateOrder = useOrdersStore(s => s.updateOrder)
    const removeOrder = useOrdersStore(s => s.removeOrder)

    const setStatus = useCallback(
        (status: OrderStatus) => updateOrder(orderId, { status }),
        [orderId, updateOrder],
    )

    const setPaymentStatus = useCallback(
        (paymentStatus: OrderPaymentStatus) => updateOrder(orderId, { paymentStatus }),
        [orderId, updateOrder],
    )

    const setPaidAmount = useCallback(
        (paidAmount: number) => updateOrder(orderId, { paidAmount }),
        [orderId, updateOrder],
    )

    const setInPlanner = useCallback(
        (inPlanner: boolean) => updateOrder(orderId, { inPlanner }),
        [orderId, updateOrder],
    )

    const api = useMemo(
        () => ({ setStatus, setPaymentStatus, setPaidAmount, setInPlanner, removeOrder }),
        [setStatus, setPaymentStatus, setPaidAmount, setInPlanner, removeOrder],
    )

    return { order, ...api }
}
