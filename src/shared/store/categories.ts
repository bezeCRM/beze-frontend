import { create } from 'zustand'
import type { Category } from '../types/types'

type CategoryStore = {
    categories: Category[]
    activeCategoryId: string | null
    setActiveCategory: (id: string | null) => void
    addCategory: (name: string) => void
}

export const useCategoryStore = create<CategoryStore>(set => ({
    categories: [
        { id: 'cakes', name: 'Торты' },
        { id: 'cupcakes', name: 'Капкейки' },
        { id: 'macarons', name: 'Макароны' },
        { id: 'desserts', name: 'Другое' },
        { id: 'popular', name: 'Популярное' },
    ],
    activeCategoryId: null,
    setActiveCategory: id => set({ activeCategoryId: id }),
    addCategory: name =>
        set(state => ({
            categories: [...state.categories, { id: Date.now().toString(), name }],
        })),
}))
