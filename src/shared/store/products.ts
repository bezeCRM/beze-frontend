import { create } from 'zustand'
import type { Product } from '../types/types'
import { mockProducts } from '@/shared/utils/mock-products'

export type NewProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>

type ProductsStore = {
    products: Product[]
    addProduct: (data: NewProductInput) => string
    updateProduct: (
        id: string,
        patch: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>,
    ) => void
    removeProduct: (id: string) => void
    getById: (id: string) => Product | undefined
    clear: () => void
}

export const useProductsStore = create<ProductsStore>((set, get) => ({
    products: [...mockProducts],

    addProduct: data => {
        const id = Date.now().toString()
        const now = new Date().toISOString()

        const fillings = (data.fillings ?? [])
            .map(f => ({ id: f.id, name: f.name.trim() }))
            .filter(f => f.name.length > 0)

        const ingredients = (data.ingredients ?? [])
            .map(i => ({
                id: i.id,
                name: i.name.trim(),
                weightGrams: i.weightGrams.trim(),
            }))
            .filter(i => i.name.length > 0 || i.weightGrams.length > 0)

        const recipe = data.recipe?.trim()
        const photoes = (data.photoes ?? []).filter(Boolean)
        const product: Product = {
            id,
            name: data.name.trim(),
            price: data.price,
            unit: data.unit,
            createdAt: now,
            updatedAt: now,
            ...(data.category ? { category: data.category } : {}),
            ...(fillings.length ? { fillings } : {}),
            ...(ingredients.length ? { ingredients } : {}),
            ...(recipe ? { recipe } : {}),
            ...(photoes.length ? { photoes } : {}),
        }

        set(state => ({ products: [product, ...state.products] }))
        return id
    },

    updateProduct: (id, patch) => {
        const p = { ...patch }

        if ('fillings' in p) {
            const arr = (p.fillings ?? [])
                .map(f => ({ id: f.id!, name: f.name?.trim() ?? '' }))
                .filter(f => f.name)
            p.fillings = arr.length ? arr : undefined
        }

        if ('ingredients' in p) {
            const arr = (p.ingredients ?? [])
                .map(i => ({
                    id: i.id!,
                    name: i.name?.trim() ?? '',
                    weightGrams: i.weightGrams?.trim() ?? '',
                }))
                .filter(i => i.name || i.weightGrams)
            p.ingredients = arr.length ? arr : undefined
        }

        if ('recipe' in p) {
            const r = p.recipe?.trim()
            p.recipe = r ? r : undefined
        }

        if ('photoes' in p) {
            const arr = (p.photoes ?? []).filter(Boolean)
            p.photoes = arr.length ? arr : undefined
        }

        set(state => ({
            products: state.products.map(prod =>
                prod.id === id
                    ? { ...prod, ...p, updatedAt: new Date().toISOString() }
                    : prod,
            ),
        }))
    },

    removeProduct: id =>
        set(state => ({ products: state.products.filter(p => p.id !== id) })),

    getById: id => get().products.find(p => p.id === id),

    clear: () => set({ products: [] }),
}))
