import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { OrderCreateFormValues } from '../hooks/useOrderFormBase'

type OrderCreateDraftState = {
    draft?: OrderCreateFormValues
    hasHydrated: boolean
    setDraft: (draft: OrderCreateFormValues) => void
    clearDraft: () => void
    setHasHydrated: (v: boolean) => void
}

export const useOrderCreateDraftStore = create<OrderCreateDraftState>()(
    persist(
        set => ({
            draft: undefined,
            hasHydrated: false,
            setDraft: draft => set({ draft }),
            clearDraft: () => set({ draft: undefined }),
            setHasHydrated: v => set({ hasHydrated: v }),
        }),
        {
            name: 'order-create-draft-v2',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: s => ({ draft: s.draft }),
            onRehydrateStorage: () => s => {
                s?.setHasHydrated(true)
            },
        },
    ),
)
