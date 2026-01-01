import { useCallback, useMemo, useState } from 'react'

import CopyIngredientsModal from '@/modules/products/components/create&edit/copy-ingredients-modal'
import { useProductsStore } from '@/shared/store/products.store'

type IngredientFormValue = {
    id: string
    name: string
    weightGrams: string
}

type Params = {
    excludeProductId?: string
    onApply: (ingredients: IngredientFormValue[]) => void
    onAfterApply?: () => void
}

function makeLocalId(prefix: string) {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

export function useCopyIngredientsFromProduct({
    excludeProductId,
    onApply,
    onAfterApply,
}: Params) {
    const [visible, setVisible] = useState(false)
    const getById = useProductsStore(s => s.getById)

    const openCopyIngredients = useCallback(() => setVisible(true), [])
    const closeCopyIngredients = useCallback(() => setVisible(false), [])

    const handlePickProduct = useCallback(
        (sourceProductId: string) => {
            const source = getById(sourceProductId)
            if (!source) return

            const copied: IngredientFormValue[] = (source.ingredients ?? []).map(i => ({
                id: makeLocalId('ing'),
                name: i.name,
                weightGrams: i.weightGrams,
            }))

            onApply(copied)
            onAfterApply?.()
            closeCopyIngredients()
        },
        [getById, onApply, onAfterApply, closeCopyIngredients],
    )

    const copyIngredientsModal = useMemo(() => {
        return (
            <CopyIngredientsModal
                visible={visible}
                onClose={closeCopyIngredients}
                excludeProductId={excludeProductId}
                onPickProduct={handlePickProduct}
            />
        )
    }, [visible, closeCopyIngredients, excludeProductId, handlePickProduct])

    return {
        openCopyIngredients,
        closeCopyIngredients,
        copyIngredientsModal,
        visible,
    }
}
