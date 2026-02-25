import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Product } from '@/shared/types/types'
import {
    createProduct,
    deleteProductApi,
    updateProductApi,
} from '@/modules/products/api/products.api'

export type NewProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>

type ProductsStore = {
    products: Product[]

    hasHydrated: boolean
    setHasHydrated: (v: boolean) => void

    setProducts: (items: Product[]) => void

    addProduct: (data: NewProductInput) => Promise<string>
    updateProduct: (
        id: string,
        patch: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>,
    ) => Promise<void>
    removeProduct: (id: string) => Promise<void>

    getById: (id: string) => Product | undefined
    clear: () => void
    clearCategoryFromProducts: (categoryId: string) => void
}

const STORAGE_KEY = 'data.products'
const STORAGE_VERSION = 1

function normalizeNewProductToApiPayload(data: NewProductInput) {
    const fillings = (data.fillings ?? [])
        .map(f => ({ name: (f?.name ?? '').trim() }))
        .filter(f => f.name.length > 0)

    const ingredients = (data.ingredients ?? [])
        .map(i => ({
            name: (i?.name ?? '').trim(),
            weightGrams: (i?.weightGrams ?? '').trim(),
        }))
        .filter(i => i.name.length > 0 && i.weightGrams.length > 0)

    const recipe = data.recipe?.trim()
    const photoUris = (data.photoes ?? [])
        .map(p => p?.uri)
        .filter((u): u is string => typeof u === 'string' && u.length > 0)
        .slice(0, 3)

    return {
        name: data.name.trim(),
        price: data.price,
        unit: data.unit,
        ...(data.category?.id ? { categoryId: data.category.id } : {}),
        ...(recipe ? { recipe } : {}),
        ...(fillings.length ? { fillings } : {}),
        ...(ingredients.length ? { ingredients } : {}),
        ...(photoUris.length ? { photoUris } : {}),
    }
}

function normalizePatchToApiPayload(
    current: Product,
    patch: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>,
) {
    const merged: NewProductInput = {
        name: patch.name ?? current.name,
        price: patch.price ?? current.price,
        unit: patch.unit ?? current.unit,
        category: 'category' in patch ? patch.category : current.category,
        fillings: 'fillings' in patch ? patch.fillings : current.fillings,
        ingredients: 'ingredients' in patch ? patch.ingredients : current.ingredients,
        recipe: 'recipe' in patch ? patch.recipe : current.recipe,
        photoes: 'photoes' in patch ? patch.photoes : current.photoes,
    }

    return normalizeNewProductToApiPayload(merged)
}

export const useProductsStore = create<ProductsStore>()(
    persist(
        (set, get) => ({
            products: [],

            hasHydrated: false,
            setHasHydrated: v => set({ hasHydrated: v }),

            setProducts: items => set({ products: items }),

            addProduct: async data => {
                const payload = normalizeNewProductToApiPayload(data)
                const created = await createProduct(payload)

                set(state => ({ products: [created, ...state.products] }))
                return created.id
            },

            updateProduct: async (id, patch) => {
                const current = get().products.find(p => p.id === id)
                if (!current) return

                const payload = normalizePatchToApiPayload(current, patch)
                const updated = await updateProductApi(id, payload)

                set(state => ({
                    products: state.products.map(p => (p.id === id ? updated : p)),
                }))
            },

            removeProduct: async id => {
                await deleteProductApi(id)
                set(state => ({ products: state.products.filter(p => p.id !== id) }))
            },

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
            onRehydrateStorage: () => state => {
                state?.setHasHydrated(true)
            },
            merge: (persisted, current) => {
                const persistedState = (persisted ?? {}) as Partial<ProductsStore>
                return { ...current, ...persistedState, hasHydrated: true }
            },
        },
    ),
)
