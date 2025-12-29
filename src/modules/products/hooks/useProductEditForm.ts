import { useEffect, useRef } from 'react'
import type { Product, Filling, Ingredient } from '@/shared/types/types'
import {
    type Photo,
    type ProductCreateFormValues,
    useProductCreateForm,
} from './useProductCreateForm'

export function useProductEditForm(product?: Product | null) {
    const form = useProductCreateForm()
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

        const photoes: Photo[] = (product.photoes ?? []).map((uri, index) => ({
            id: `${product.id}-${index}`,
            uri,
        }))

        const values: ProductCreateFormValues = {
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
