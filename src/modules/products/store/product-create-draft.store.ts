import { create } from 'zustand'
import { ProductUnit, Category } from '@/shared/types/types'

type DraftIngredient = { id: string; name: string; amount?: string }
type DraftPhoto = { id: string; uri: string }

type ProductDraft = {
  name: string
  category: Category | null
  unit: ProductUnit
  price: string
  fillings: string[]
  ingredients: DraftIngredient[]
  recipe: string
  photos: DraftPhoto[]
}

type Actions = {
  setName: (v: string) => void
  setCategory: (c: Category | null) => void
  setUnit: (u: ProductUnit) => void
  setPrice: (v: string) => void
  setRecipe: (v: string) => void

  addFilling: (name: string) => void
  removeFilling: (name: string) => void

  addIngredient: (i: DraftIngredient) => void
  removeIngredient: (id: string) => void

  addPhoto: (p: DraftPhoto) => void
  removePhoto: (id: string) => void

  reset: () => void
}

const initial: ProductDraft = {
  name: '',
  category: null,
  unit: 'piece',
  price: '',
  fillings: [],
  ingredients: [],
  recipe: '',
  photos: [],
}

export const useCreateProductDraft = create<ProductDraft & Actions>((set) => ({
  ...initial,

  setName: (v) => set({ name: v }),
  setCategory: (c) => set({ category: c }),
  setUnit: (u) => set({ unit: u }),
  setPrice: (v) => set({ price: v }),
  setRecipe: (v) => set({ recipe: v }),

  addFilling: (name) => set((s) => ({ fillings: [...s.fillings, name] })),
  removeFilling: (name) => set((s) => ({ fillings: s.fillings.filter((x) => x !== name) })),

  addIngredient: (i) => set((s) => ({ ingredients: [...s.ingredients, i] })),
  removeIngredient: (id) => set((s) => ({ ingredients: s.ingredients.filter((x) => x.id !== id) })),

  addPhoto: (p) => set((s) => ({ photos: [...s.photos, p] })),
  removePhoto: (id) => set((s) => ({ photos: s.photos.filter((x) => x.id !== id) })),

  reset: () => set(initial),
}))
