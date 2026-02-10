import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Category } from '@/shared/types/types'

type CategoryStore = {
    categories: Category[]
    activeCategoryId: string | null
    hasHydrated: boolean
    setHasHydrated: (v: boolean) => void

    setActiveCategory: (id: string | null) => void
    addCategory: (name: string) => string
    hasCategory: (name: string) => boolean
}

const norm = (s: string) => s.trim().toLowerCase()

const DEFAULT_CATEGORIES: Category[] = [
    { id: 'cakes', name: 'Торты' },
    { id: 'cupcakes', name: 'Капкейки' },
    { id: 'macarons', name: 'Макароны' },
    { id: 'desserts', name: 'Другое' },
    { id: 'popular', name: 'Популярное' },
]

export const useCategoryStore = create<CategoryStore>()(
    persist(
        (set, get) => ({
            categories: DEFAULT_CATEGORIES,
            activeCategoryId: null,

            hasHydrated: false,
            setHasHydrated: v => set({ hasHydrated: v }),

            setActiveCategory: id => set({ activeCategoryId: id }),

            addCategory: name => {
                const id = Date.now().toString()
                const clean = name.trim()
                set(state => ({
                    categories: [...state.categories, { id, name: clean }],
                }))
                return id
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
