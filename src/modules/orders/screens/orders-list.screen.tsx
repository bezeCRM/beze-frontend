import MainHeader from '@/shared/components/headers/main-header'
import ScreenContainer from '@/shared/components/layout/screen-container'
import Search from '@/shared/components/search/search'
import { ToastViewport } from '@/shared/components/toast/toast-provider'
import { useSearchHistoryStore } from '@/shared/store/searchHistory.store'
// import { useOrdersStore } from '@/shared/store/orders.store'
import { useState } from 'react'
import OrdersFilters, { OrdersFilterId } from '../components/list/orders-filters'
import OrdersHeader from '../components/list/orders-header'
import OrdersList from '../components/list/orders-list'
import { useOrdersSearch } from '../hooks/useOrdersSearch'

const ORDERS_LIST_TOAST_SCOPE = 'ordersList'

export default function OrdersListScreen() {
    const [query, setQuery] = useState('')
    const [activeFilterId, setActiveFilterId] = useState<OrdersFilterId>('all')

    const activeStatus = activeFilterId === 'all' ? null : activeFilterId
    const results = useOrdersSearch({ query, activeStatus })

    const addQuery = useSearchHistoryStore(s => s.addQuery)

    return (
        <ScreenContainer>
            <MainHeader />
            <OrdersHeader />

            <Search
                value={query}
                onChangeText={setQuery}
                placeholder="Поиск по названию или клиенту"
                onSubmit={() => addQuery('orders' as any, query)}
            />

            <OrdersFilters value={activeFilterId} onChange={setActiveFilterId} />
            <OrdersList items={results} />

            <ToastViewport
                scope={ORDERS_LIST_TOAST_SCOPE}
                bottomOffset={75}
                horizontalInset={15}
            />
        </ScreenContainer>
    )
}
