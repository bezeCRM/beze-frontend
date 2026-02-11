import MainHeader from '@/shared/components/headers/main-header'
import ScreenContainer from '@/shared/components/layout/screen-container'
import Search from '@/shared/components/search/search'
import { ToastViewport } from '@/shared/components/toast/toast-provider'
import { useCategoryStore } from '../store/categories.store'
import { useSearchHistoryStore } from '@/shared/store/searchHistory.store'
import { useMemo, useState } from 'react'
import ProductsFilters from '../components/list/products-filters'
import ProductsHeader from '../components/list/products-header'
import ProductsList from '../components/list/products-list'
import { useProductsSearch } from '../hooks/useProductsSearch'
import { useProductsStore } from '../store/products.store'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { TOAST_SCOPES } from '@/shared/components/toast/scopes'

import { applySort, makeNumberComparator } from '@/shared/components/sort/utils'
import { Product } from '@/shared/types/types'
import { SortOption } from '@/shared/components/sort/types'
import SortSelect from '@/shared/components/sort/sort-select'
import { Icon } from '@/shared/ui/icon/icon'

type ProductsSortId = 'priceAsc' | 'priceDesc'

const PRODUCT_SORT_OPTIONS: SortOption<ProductsSortId>[] = [
    { id: 'priceAsc', label: 'Сначала дешёвые' },
    { id: 'priceDesc', label: 'Сначала дорогие' },
]

const PRODUCT_COMPARATORS = {
    priceAsc: makeNumberComparator<Product>(p => p.price, 'asc'),
    priceDesc: makeNumberComparator<Product>(p => p.price, 'desc'),
} as const

export default function ProductsListScreen() {
    const [query, setQuery] = useState('')
    const [sortId, setSortId] = useState<ProductsSortId>('priceAsc')

    const activeCategoryId = useCategoryStore(s => s.activeCategoryId)
    const results = useProductsSearch({ query, activeCategoryId })
    const addQuery = useSearchHistoryStore(s => s.addQuery)

    const hasHydrated = useProductsStore(s => s.hasHydrated)

    const sortedResults = useMemo(
        () => applySort(results, sortId, PRODUCT_COMPARATORS),
        [results, sortId],
    )

    if (!hasHydrated) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator />
            </View>
        )
    }

    return (
        <ScreenContainer>
            <MainHeader />
            <ProductsHeader />

            <Search
                value={query}
                onChangeText={setQuery}
                placeholder="Поиск по названию"
                onSubmit={() => addQuery('products', query)}
            />

            <ProductsFilters />
            <View style={styles.sortRow}>
                <SortSelect
                    title="Сортировка"
                    options={PRODUCT_SORT_OPTIONS}
                    value={sortId}
                    onChange={setSortId}
                    left={<Icon name="sort-icon" size={20} />}
                />
            </View>

            <ProductsList items={sortedResults} />

            <ToastViewport
                scope={TOAST_SCOPES.Products}
                bottomOffset={90}
                horizontalInset={15}
            />
        </ScreenContainer>
    )
}

const styles = StyleSheet.create({
    sortRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
})
