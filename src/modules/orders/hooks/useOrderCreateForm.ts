import { useFormDraft } from '@/shared/hooks/form/useFormDraft'
import { useOrderCreateDraftStore } from '../store/order-create-draft.store'
import {
    hasOrderCreateMeaningfulValues,
    mergeOrderCreateDraft,
} from '../draft/order-create-draft.utils'
import {
    useOrderFormBase,
    type OrderCreateFormValues,
    type OrderCreateItem,
    type OrderExtraValues,
    type OrderDeliveryValues,
    type OrderPaymentStatus,
    type OrderStatus,
} from './useOrderFormBase'

export type {
    OrderCreateFormValues,
    OrderCreateItem,
    OrderExtraValues,
    OrderDeliveryValues,
    OrderPaymentStatus,
    OrderStatus,
}

export function useOrderCreateForm() {
    const base = useOrderFormBase()
    const { defaultValues } = base

    const draft = useOrderCreateDraftStore(s => s.draft)
    const hasHydrated = useOrderCreateDraftStore(s => s.hasHydrated)
    const setDraft = useOrderCreateDraftStore(s => s.setDraft)
    const clearPersistedDraft = useOrderCreateDraftStore(s => s.clearDraft)

    const { hasDraft, clearDraft } = useFormDraft<OrderCreateFormValues>({
        enabled: true,
        form: base,
        defaultValues,
        draft,
        hasHydrated,
        setDraft,
        clearPersistedDraft,
        hasMeaningfulValues: hasOrderCreateMeaningfulValues,
        mergeDraft: mergeOrderCreateDraft,
        debounceMs: 250,
    })

    return {
        ...base,
        hasDraft,
        clearDraft,
    }
}
