import MainHeader from '@/shared/components/headers/main-header'
import ScreenContainer from '@/shared/components/layout/screen-container'
import Search from '@/shared/components/search/search'
import { ToastViewport } from '@/shared/components/toast/toast-provider'
import { useCategoryStore } from '../store/categories.store'
import { useSearchHistoryStore } from '@/shared/store/searchHistory.store'
import { useState } from 'react'
import ProductsFilters from '../components/list/products-filters'
import ProductsHeader from '../components/list/products-header'
import ProductsList from '../components/list/products-list'
import { useProductsSearch } from '../hooks/useProductsSearch'
import { useProductsStore } from '../store/products.store'
import { View, ActivityIndicator } from 'react-native'

const PRODUCTS_LIST_TOAST_SCOPE = 'productsList'

export default function ProductsListScreen() {
    const [query, setQuery] = useState('')

    const activeCategoryId = useCategoryStore(s => s.activeCategoryId)
    const results = useProductsSearch({ query, activeCategoryId })
    const addQuery = useSearchHistoryStore(s => s.addQuery)

    const hasHydrated = useProductsStore(s => s.hasHydrated)

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
            <ProductsList items={results} />

            <ToastViewport
                scope={PRODUCTS_LIST_TOAST_SCOPE}
                bottomOffset={90}
                horizontalInset={15}
            />
        </ScreenContainer>
    )
}
