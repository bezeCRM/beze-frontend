import { useEffect, useMemo } from 'react'
import type { PlannerListItem, PlannerTask, Order } from '@/shared/types/types'
import { usePlannerStore } from '../store/planner.store'
import { splitUpcomingPast, sortPast, sortUpcoming } from '../utils/planner-tasks'
import { useOrdersStore } from '@/modules/orders/store/orders.store'
import { normalizeToDateKey } from '../utils/planner-date'

const EMPTY_ORDERS: Order[] = []

function orderTitle(o: Order) {
    return o.name?.trim() || `Заказ #${o.id}`
}

function mapOrdersToPlannerItems(orders: Order[]): PlannerListItem[] {
    return orders
        .filter(o => o.inPlanner)
        .map(o => ({
            id: `order_${o.id}`,
            kind: 'order',
            orderId: o.id,
            title: orderTitle(o),
            date: normalizeToDateKey(o.date),
            time: o.time,
            deliveryType: o.deliveryType,
        }))
}

function mapManualTasks(tasks: PlannerTask[]): PlannerListItem[] {
    return tasks.map(t => ({
        id: t.id,
        kind: 'manual',
        taskId: t.id,
        title: t.title,
        date: t.date,
        time: t.time,
    }))
}

export type PlannerUiItem = PlannerListItem & { completed: boolean }

type Result = {
    items: PlannerUiItem[]
    upcoming: PlannerUiItem[]
    past: PlannerUiItem[]
}

export function usePlannerItems(today: string): Result {
    const tasks = usePlannerStore(s => s.tasks)
    const completedById = usePlannerStore(s => s.completedById)
    const pruneCompletedIds = usePlannerStore(s => s.pruneCompletedIds)

    const ordersFromStore = useOrdersStore(
        s => (s.orders as Order[] | undefined) ?? EMPTY_ORDERS,
    )

    const items = useMemo<PlannerListItem[]>(() => {
        const manual = mapManualTasks(tasks)
        const orderItems = mapOrdersToPlannerItems(ordersFromStore)
        return [...manual, ...orderItems]
    }, [tasks, ordersFromStore])

    const validIds = useMemo(() => items.map(i => i.id), [items])

    useEffect(() => {
        pruneCompletedIds(validIds)
    }, [pruneCompletedIds, validIds])

    const decorated = useMemo<PlannerUiItem[]>(
        () =>
            items.map(it => ({
                ...it,
                completed: !!completedById[it.id],
            })),
        [items, completedById],
    )

    const { upcoming, past } = useMemo(
        () => splitUpcomingPast(decorated, today),
        [decorated, today],
    )

    const upcomingSorted = useMemo<PlannerUiItem[]>(
        () => sortUpcoming(upcoming) as PlannerUiItem[],
        [upcoming],
    )
    const pastSorted = useMemo<PlannerUiItem[]>(
        () => sortPast(past) as PlannerUiItem[],
        [past],
    )

    return {
        items: decorated,
        upcoming: upcomingSorted,
        past: pastSorted,
    }
}
