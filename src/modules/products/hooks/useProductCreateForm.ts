import { useMemo } from 'react'
import type { Category } from '@/shared/types/types'
import { useFormDraft } from '@/shared/hooks/form/useFormDraft'

import { useProductCreateDraftStore } from '../store/product-create-draft.store'
import {
    hasProductCreateMeaningfulValues,
    mergeProductCreateDraft,
} from '../draft/product-create-draft.utils'
import {
    makeProductDefaultValues,
    useProductFormBase,
    type ProductFormValues,
} from './useProductFormBase'

export type ProductCreateFormValues = ProductFormValues

export function useProductCreateForm(defaultCategory?: Category) {
    const defaultValues = useMemo(
        () => makeProductDefaultValues(defaultCategory),
        [defaultCategory],
    )

    const form = useProductFormBase(defaultValues)

    const draft = useProductCreateDraftStore(s => s.draft)
    const hasHydrated = useProductCreateDraftStore(s => s.hasHydrated)
    const setDraft = useProductCreateDraftStore(s => s.setDraft)
    const clearPersistedDraft = useProductCreateDraftStore(s => s.clearDraft)

    const { hasDraft, clearDraft } = useFormDraft<ProductCreateFormValues>({
        enabled: true,
        form,
        defaultValues,
        draft,
        hasHydrated,
        setDraft,
        clearPersistedDraft,
        hasMeaningfulValues: hasProductCreateMeaningfulValues,
        mergeDraft: mergeProductCreateDraft,
        debounceMs: 250,
    })

    return {
        ...form,
        hasDraft,
        clearDraft,
    }
}
