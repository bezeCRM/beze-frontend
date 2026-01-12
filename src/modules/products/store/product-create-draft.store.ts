import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { ProductFormValues } from '../hooks/useProductFormBase'

type ProductCreateDraftState = {
    draft?: ProductFormValues
    hasHydrated: boolean
    setDraft: (draft: ProductFormValues) => void
    clearDraft: () => void
    setHasHydrated: (v: boolean) => void
}

export const useProductCreateDraftStore = create<ProductCreateDraftState>()(
    persist(
        set => ({
            draft: undefined,
            hasHydrated: false,
            setDraft: draft => set({ draft }),
            clearDraft: () => set({ draft: undefined }),
            setHasHydrated: v => set({ hasHydrated: v }),
        }),
        {
            name: 'product-create-draft-v2',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: s => ({ draft: s.draft }),
            onRehydrateStorage: () => s => {
                s?.setHasHydrated(true)
            },
        },
    ),
)
