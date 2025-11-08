import { useMemo } from 'react'
import ScreenContainer from '@/shared/components/screen-container'
import MainHeader from '@/shared/components/main-header'
import ProductsHeader from '../components/products-header'
import Search from '@/shared/components/search'
import ProductsList from '../components/products-list'
import ProductsFilters from '../components/products-filters'
import { useCategoryStore } from '@/shared/store/categories'
import { useProductsStore } from '@/shared/store/products'

export default function ProductsScreen() {
    const products = useProductsStore(s => s.products)

    const { activeCategoryId } = useCategoryStore()

    const filteredProducts = useMemo(() => {
        if (!activeCategoryId) return products
        return products.filter(product => product.category?.id === activeCategoryId)
    }, [activeCategoryId, products])

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
