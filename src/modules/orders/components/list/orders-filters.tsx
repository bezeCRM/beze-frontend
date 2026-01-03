import Filters from '@/shared/components/filters'
import { Category } from '@/shared/types/types'
import React from 'react'

export type OrdersFilterId = 'all' | 'new' | 'inWork' | 'ready' | 'delivered' | 'canceled'

type Props = {
    value: OrdersFilterId
    onChange: (id: OrdersFilterId) => void
}

const ORDER_FILTERS: Category[] = [
    { id: 'new', name: 'Новые' },
    { id: 'inWork', name: 'В работе' },
    { id: 'ready', name: 'Готов' },
    { id: 'delivered', name: 'Выдан' },
    { id: 'canceled', name: 'Отменён' },
]

export default function OrdersFilters({ value, onChange }: Props) {
    const activeId = value === 'all' ? null : value

    const handleSelect = (item: Category) => {
        if (item.id === 'all') {
            onChange('all')
            return
        }

        const id = item.id as OrdersFilterId
        onChange(id === value ? 'all' : id)
    }

    return (
        <Filters
            items={ORDER_FILTERS}
            activeId={activeId}
            onSelect={handleSelect}
            showAllButton
            screenTitle="заказы"
        />
    )
}
