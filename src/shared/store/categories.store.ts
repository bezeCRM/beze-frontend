import { create } from 'zustand'
import type { Category } from '../types/types'

type CategoryStore = {
    categories: Category[]
    activeCategoryId: string | null
    setActiveCategory: (id: string | null) => void
    addCategory: (name: string) => string
    hasCategory: (name: string) => boolean
}

const norm = (s: string) => s.trim().toLowerCase()

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
    addCategory: name => {
        const id = Date.now().toString()
        set(state => ({
            categories: [...state.categories, { id, name }],
        }))
        return id
    },
    hasCategory: name => {
        const n = norm(name)
        let exists = false
        set(state => {
            exists = state.categories.some(c => norm(c.name) === n)
            return state
        })
        return exists
    },
}))
