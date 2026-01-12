import { useEffect, useRef } from 'react'
import type { Product, Filling, Ingredient, PhotoItem } from '@/shared/types/types'
import {
    useProductFormBase,
    type ProductFormValues,
    makeProductDefaultValues,
} from './useProductFormBase'

function normalizePhotoes(product: Product): PhotoItem[] {
    const raw = (product as any).photoes ?? []
    if (!Array.isArray(raw)) return []

    return raw
        .map((p: any, index: number) => {
            if (typeof p === 'string') {
                return { id: `${product.id}-${index}`, uri: p }
            }
            if (p && typeof p === 'object') {
                const uri = String(p.uri ?? '')
                const id = String(p.id ?? `${product.id}-${index}`)
                return { id, uri }
            }
            return null
        })
        .filter((p: PhotoItem | null): p is PhotoItem => !!p && !!p.uri)
        .slice(0, 3)
}

export function useProductEditForm(product?: Product | null) {
    const form = useProductFormBase(makeProductDefaultValues())
    const lastProductId = useRef<string | null>(null)

    useEffect(() => {
        if (!product) return
        if (lastProductId.current === product.id) return
        lastProductId.current = product.id

        const fillings: Filling[] = product.fillings?.length
            ? product.fillings
            : [{ id: String(Date.now()), name: '' }]

        const ingredients: Ingredient[] = product.ingredients?.length
            ? product.ingredients
            : [{ id: String(Date.now()), name: '', weightGrams: '' }]

        const photoes: PhotoItem[] = normalizePhotoes(product)

        const values: ProductFormValues = {
            name: product.name ?? '',
            category: product.category,
            unit: product.unit ?? 'piece',
            price: String(product.price ?? ''),
            recipe: product.recipe ?? '',
            fillings,
            ingredients,
            photoes,
        }

        form.reset(values)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product?.id])

    return form
}
