import { toApiError } from '@/api'
import { useCategoryStore } from '@/modules/products/store/categories.store'
import { useProductsStore } from '@/modules/products/store/products.store'
import { getCategories } from '@/modules/products/api/categories.api'
import { getProducts } from '@/modules/products/api/products.api'

export async function syncCatalog(): Promise<
    { ok: true } | { ok: false; error: string }
> {
    try {
        const categories = await getCategories()
        useCategoryStore.getState().setCategories(categories)

        const products = await getProducts()
        useProductsStore.getState().setProducts(products)

        return { ok: true }
    } catch (e) {
        return { ok: false, error: toApiError(e).message }
    }
}
