import { useMemo } from 'react'
import ScreenContainer from '@/shared/components/screen-container'
import MainHeader from '@/shared/components/main-header'
import ProductsHeader from '../components/products-header'
import Search from '@/shared/components/search'
import ProductsList from '../components/products-list'
import ProductsFilters from '../components/products-filters'
import { mockProducts } from '@/shared/utils/mock-products'
import { useCategoryStore } from '@/shared/store/categories'

export default function ProductsScreen() {
    const { activeCategoryId } = useCategoryStore()

    const filteredProducts = useMemo(() => {
        if (!activeCategoryId) return mockProducts
        return mockProducts.filter(product =>
            product.category.some(cat => cat.id === activeCategoryId),
        )
    }, [activeCategoryId])

    return (
        <ScreenContainer>
            <MainHeader />
            <ProductsHeader />
            <Search />
            <ProductsFilters />
            <ProductsList items={filteredProducts} />
        </ScreenContainer>
    )
}
