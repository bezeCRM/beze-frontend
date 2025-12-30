// import { useMemo } from 'react'
// import { useSmartSearch } from '@/shared/hooks/useSmartSearch'

// /*
//   адаптируй импорты под твой проект:
//   - useOrdersStore должен вернуть массив заказов
//   - Order должен иметь id, title (или name), status и опционально clientName
// */
// import { useOrdersStore } from '@/shared/store/orders'
// import type { Order } from '../types/types'

// const orderEngineOptions = {
//     getId: (o: Order) => o.id,
//     getText: (o: Order) => {
//         const title = (o as any).title ?? (o as any).name ?? ''
//         const client = (o as any).clientName ?? ''
//         const number = (o as any).number ?? ''
//         return `${title} ${client} ${number}`
//     },
// } as const

// export function useOrdersSearch(args: {
//     query: string
//     activeStatusId: string | null
//     limit?: number
// }) {
//     const { query, activeStatusId, limit = 80 } = args

//     const orders = useOrdersStore((s: { orders: any }) => s.orders) as Order[]

//     const candidates = useMemo(() => {
//         if (!activeStatusId) return orders
//         return orders.filter(o => (o as any).statusId === activeStatusId || (o as any).status === activeStatusId)
//     }, [orders, activeStatusId])

//     const results = useSmartSearch<Order>({
//         items: candidates,
//         query,
//         debounceMs: 200,
//         engineOptions: orderEngineOptions,
//         searchConfig: {
//             minQueryLength: 3,
//             returnAllWhenQueryTooShort: true,
//             limit,
//             useFuzzyFallback: true,
//             fuzzyTriggerBelow: 10,
//             fuzzyLimit: 40,
//         },
//     })

//     return results
// }
