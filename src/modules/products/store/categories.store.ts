import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { useProductsStore } from '@/modules/products/store/products.store'
import type { Category } from '@/shared/types/types'
import { createCategory, deleteCategoryApi } from '@/modules/products/api/categories.api'

type CategoryStore = {
    categories: Category[]
    activeCategoryId: string | null

    hasHydrated: boolean
    setHasHydrated: (v: boolean) => void

    setCategories: (items: Category[]) => void
    setActiveCategory: (id: string | null) => void

    addCategory: (name: string) => Promise<string>
    removeCategory: (id: string) => Promise<void>
    hasCategory: (name: string) => boolean
}

const norm = (s: string) => s.trim().toLowerCase()

export const useCategoryStore = create<CategoryStore>()(
    persist(
        (set, get) => ({
            categories: [],
            activeCategoryId: null,

            hasHydrated: false,
            setHasHydrated: v => set({ hasHydrated: v }),

            setCategories: items =>
                set(state => ({
                    categories: items,
                    activeCategoryId:
                        state.activeCategoryId &&
                        items.some(c => c.id === state.activeCategoryId)
                            ? state.activeCategoryId
                            : null,
                })),

            setActiveCategory: id => set({ activeCategoryId: id }),

            addCategory: async name => {
                const clean = name.trim()
                const created = await createCategory({ name: clean })

                set(state => ({ categories: [...state.categories, created] }))
                return created.id
            },

            removeCategory: async id => {
                await deleteCategoryApi(id)

                set(state => ({
                    categories: state.categories.filter(c => c.id !== id),
                }))

                useProductsStore.getState().clearCategoryFromProducts(id)

                set(state => ({
                    activeCategoryId:
                        state.activeCategoryId === id ? null : state.activeCategoryId,
                }))
            },

            hasCategory: name => {
                const n = norm(name)
                return get().categories.some(c => norm(c.name) === n)
            },
        }),
        {
            name: 'data.categories',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: s => ({
                categories: s.categories,
                activeCategoryId: s.activeCategoryId,
            }),
            onRehydrateStorage: () => state => {
                state?.setHasHydrated(true)
            },
            merge: (persisted, current) => {
                const persistedState = (persisted ?? {}) as Partial<CategoryStore>
                return { ...current, ...persistedState, hasHydrated: true }
            },
        },
    ),
)
