import MainHeader from '@/shared/components/headers/main-header'
import ScreenContainer from '@/shared/components/layout/screen-container'
import Search from '@/shared/components/search/search'
import { ToastViewport, useToast } from '@/shared/components/toast/toast-provider'
import { useSearchHistoryStore } from '@/shared/store/searchHistory.store'
import { useEffect, useMemo, useState } from 'react'
import OrdersFilters, { OrdersFilterId } from '../components/list/orders-filters'
import OrdersHeader from '../components/list/orders-header'
import OrdersList from '../components/list/orders-list'
import { useOrdersSearch } from '../hooks/useOrdersSearch'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import {
    applySort,
    makeDateComparator,
    makeNumberComparator,
} from '@/shared/components/sort/utils'
import { Order } from '@/shared/types/types'
import { SortOption } from '@/shared/components/sort/types'
import SortSelect from '@/shared/components/sort/sort-select'
import { Icon } from '@/shared/ui/icon/icon'
import { ModeSwitch, SwitchItem } from '@/shared/components/mode-switch/mode-switch'
import { TOAST_SCOPES } from '@/shared/components/toast/scopes'
import { useOrdersSync } from '../hooks/useOrdersSync' // добавь

type OrdersSortId = 'priceAsc' | 'priceDesc' | 'dateAsc' | 'dateDesc'
type OrdersMode = 'active' | 'archive'

const ORDER_COMPARATORS = {
    priceAsc: makeNumberComparator<Order>(o => o.totalPrice, 'asc'),
    priceDesc: makeNumberComparator<Order>(o => o.totalPrice, 'desc'),
    dateAsc: makeDateComparator<Order>(o => `${o.date}T${o.time || '00:00'}`, 'asc'),
    dateDesc: makeDateComparator<Order>(o => `${o.date}T${o.time || '00:00'}`, 'desc'),
} as const

const ORDER_SORT_OPTIONS: SortOption<OrdersSortId>[] = [
    { id: 'priceAsc', label: 'Сначала дешёвые' },
    { id: 'priceDesc', label: 'Сначала дорогие' },
    { id: 'dateAsc', label: 'Сначала ранние' },
    { id: 'dateDesc', label: 'Сначала поздние' },
]

function pad2(n: number) {
    return String(n).padStart(2, '0')
}

function todayDateValue() {
    const d = new Date()
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

export default function OrdersListScreen() {
    const [query, setQuery] = useState('')
    const [activeFilterId, setActiveFilterId] = useState<OrdersFilterId>('all')
    const [sortId, setSortId] = useState<OrdersSortId>('dateAsc')
    const [mode, setMode] = useState<OrdersMode>('active')
    const { show } = useToast()

    const addQuery = useSearchHistoryStore(s => s.addQuery)

    const activeStatus = activeFilterId === 'all' ? null : activeFilterId
    const results = useOrdersSearch({ query, activeStatus })

    const switchItems = useMemo<SwitchItem<OrdersMode>[]>(
        () => [
            { key: 'active', label: 'текущие' },
            { key: 'archive', label: 'архив' },
        ],
        [],
    )

    const filteredByMode = useMemo(() => {
        const today = todayDateValue()
        return results.filter(o => {
            if (!o.date) return mode === 'active'
            return mode === 'archive' ? o.date < today : o.date >= today
        })
    }, [results, mode])

    const sortedResults = useMemo(
        () => applySort(filteredByMode, sortId, ORDER_COMPARATORS),
        [filteredByMode, sortId],
    )

    const { hasHydrated, isSyncing, refetch, error, clearError } = useOrdersSync()

    useEffect(() => {
        if (error) {
            show('Ошибка соединения', 'error', { scope: TOAST_SCOPES.Orders })
            clearError()
        }
    }, [error, show, clearError])

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

            <View style={styles.topRow}>
                <SortSelect
                    title="Сортировка"
                    options={ORDER_SORT_OPTIONS}
                    value={sortId}
                    onChange={setSortId}
                    left={<Icon name="sort-icon" size={20} />}
                />
                <ModeSwitch<OrdersMode>
                    items={switchItems}
                    value={mode}
                    onChange={setMode}
                    height={35}
                    radius={15}
                    inset={3}
                    itemGap={0}
                    contentPaddingX={12}
                />
            </View>

            <OrdersList
                items={sortedResults}
                emptyTitle={
                    mode === 'archive' ? 'В архиве пока нет заказов' : 'Заказов пока нет'
                }
                showCreateButton={mode !== 'archive'}
                refreshing={isSyncing}
                onRefresh={refetch}
            />

            <ToastViewport
                scope={TOAST_SCOPES.Orders}
                bottomOffset={80}
                horizontalInset={20}
            />
        </ScreenContainer>
    )
}

const styles = StyleSheet.create({
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        columnGap: 12,
        marginBottom: 15,
    },
})
