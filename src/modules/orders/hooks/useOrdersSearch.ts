import { useMemo } from 'react'
import { useSmartSearch } from '@/shared/hooks/useSmartSearch'
import { useOrdersStore } from '@/shared/store/orders.store'
import type { Order, OrderStatus } from '@/shared/types/types'

const orderEngineOptions = {
    getId: (o: Order) => o.id,
    getText: (o: Order) => `${o.name ?? ''} ${o.clientName ?? ''} ${o.id ?? ''}`,
} as const

export function useOrdersSearch(args: {
    query: string
    activeStatus: OrderStatus | null
    limit?: number
}) {
    const { query, activeStatus, limit = 5000 } = args

    const orders = useOrdersStore(s => s.orders) as Order[]

    const candidates = useMemo(() => {
        if (!activeStatus) return orders
        return orders.filter(o => o.status === activeStatus)
    }, [orders, activeStatus])

    const results = useSmartSearch<Order>({
        items: candidates,
        query,
        debounceMs: 200,
        engineOptions: orderEngineOptions,
        searchConfig: {
            minQueryLength: 2,
            returnAllWhenQueryTooShort: true,
            limit,
            useFuzzyFallback: true,
            fuzzyTriggerBelow: 10,
            fuzzyLimit: 40,
        },
    })

    return results
}
