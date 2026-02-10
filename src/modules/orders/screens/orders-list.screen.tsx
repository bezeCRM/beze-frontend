import MainHeader from '@/shared/components/headers/main-header'
import ScreenContainer from '@/shared/components/layout/screen-container'
import Search from '@/shared/components/search/search'
import { ToastViewport } from '@/shared/components/toast/toast-provider'
import { useSearchHistoryStore } from '@/shared/store/searchHistory.store'
import { useState } from 'react'
import OrdersFilters, { OrdersFilterId } from '../components/list/orders-filters'
import OrdersHeader from '../components/list/orders-header'
import OrdersList from '../components/list/orders-list'
import { useOrdersSearch } from '../hooks/useOrdersSearch'
import { View, ActivityIndicator } from 'react-native'
import { useOrdersStore } from '../store/orders.store'

const ORDERS_LIST_TOAST_SCOPE = 'ordersList'

export default function OrdersListScreen() {
    const hasHydrated = useOrdersStore(s => s.hasHydrated)
    const [query, setQuery] = useState('')
    const [activeFilterId, setActiveFilterId] = useState<OrdersFilterId>('all')

    const activeStatus = activeFilterId === 'all' ? null : activeFilterId
    const results = useOrdersSearch({ query, activeStatus })

    const addQuery = useSearchHistoryStore(s => s.addQuery)

    if (!hasHydrated) {
        return (
            <ScreenContainer>
                <MainHeader />
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator />
                </View>
            </ScreenContainer>
        )
    }

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
                bottomOffset={90}
                horizontalInset={20}
            />
        </ScreenContainer>
    )
}
