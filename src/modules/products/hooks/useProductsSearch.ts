import { useMemo } from 'react'
import { useSmartSearch } from '@/shared/hooks/useSmartSearch'
import { useProductsStore } from '../store/products.store'
import type { Product } from '@/shared/types/types'

const productEngineOptions = {
    getId: (p: Product) => p.id,
    getText: (p: Product) => p.name ?? '',
} as const

export function useProductsSearch(args: {
    query: string
    activeCategoryId: string | null
    limit?: number
}) {
    const { query, activeCategoryId, limit = 5000 } = args

    const products = useProductsStore(s => s.products) as Product[]

    const candidates = useMemo(() => {
        if (!activeCategoryId) return products
        return products.filter(p => p.category?.id === activeCategoryId)
    }, [products, activeCategoryId])

    const results = useSmartSearch<Product>({
        items: candidates,
        query,
        debounceMs: 200,
        engineOptions: productEngineOptions,
        searchConfig: {
            minQueryLength: 3,
            returnAllWhenQueryTooShort: true,
            limit,
            useFuzzyFallback: true,
            fuzzyTriggerBelow: 10,
            fuzzyLimit: 40,
        },
    })

    return results
}
