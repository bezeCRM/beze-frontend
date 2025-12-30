import MainHeader from '@/shared/components/main-header'
import ScreenContainer from '@/shared/components/screen-container'
import Search from '@/shared/components/search/search'
import { useCategoryStore } from '@/shared/store/categories.store'
import { useState } from 'react'
import ProductsFilters from '../components/list/products-filters'
import ProductsHeader from '../components/list/products-header'
import ProductsList from '../components/list/products-list'
import { useProductsSearch } from '../hooks/useProductsSearch'
import { useSearchHistoryStore } from '@/shared/store/searchHistory.store'

export default function ProductsScreen() {
    const [query, setQuery] = useState('')

    const activeCategoryId = useCategoryStore(s => s.activeCategoryId)

    const results = useProductsSearch({ query, activeCategoryId })

    const addQuery = useSearchHistoryStore(s => s.addQuery)

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
        </ScreenContainer>
    )
}
