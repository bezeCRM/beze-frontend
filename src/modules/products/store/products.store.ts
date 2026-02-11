import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Product } from '@/shared/types/types'
import { mockProducts } from '@/shared/utils/mock-products'

export type NewProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>

type ProductsStore = {
    products: Product[]
    hasHydrated: boolean
    setHasHydrated: (v: boolean) => void

    addProduct: (data: NewProductInput) => string
    updateProduct: (
        id: string,
        patch: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>,
    ) => void
    removeProduct: (id: string) => void
    getById: (id: string) => Product | undefined
    clear: () => void
    clearCategoryFromProducts: (categoryId: string) => void
}

const STORAGE_KEY = 'data.products'
const STORAGE_VERSION = 1

const buildProduct = (data: NewProductInput): Product => {
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

    return {
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
}

export const useProductsStore = create<ProductsStore>()(
    persist(
        (set, get) => ({
            products: [...mockProducts],
            hasHydrated: false,
            setHasHydrated: v => set({ hasHydrated: v }),

            addProduct: data => {
                const product = buildProduct(data)
                set(state => ({ products: [product, ...state.products] }))
                return product.id
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

            clearCategoryFromProducts: categoryId =>
                set(state => ({
                    products: state.products.map(p =>
                        p.category?.id === categoryId ? { ...p, category: undefined } : p,
                    ),
                })),
        }),
        {
            name: STORAGE_KEY,
            version: STORAGE_VERSION,
            storage: createJSONStorage(() => AsyncStorage),

            partialize: state => ({ products: state.products }),

            onRehydrateStorage: () => (state, error) => {
                if (error) {
                    // console.log('products rehydrate error', error)
                }
                state?.setHasHydrated(true)
            },

            merge: (persisted, current) => {
                const persistedState = (persisted ?? {}) as Partial<ProductsStore>
                return { ...current, ...persistedState, hasHydrated: true }
            },
        },
    ),
)
