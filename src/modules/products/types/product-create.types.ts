import type { Filling, Category, ProductUnit } from '@/shared/types/types'

export type DraftIngredient = {
    id: string
    name: string
    weightGrams: number
}

export type DraftPhoto = {
    id: string
    url: string
}

export type ProductCreateForm = {
    name: string
    category: Category | null
    fillings: Filling[] | null
    ingredients: DraftIngredient[] | null
    recipe: string | null
    unit: ProductUnit
    price: string
    photoes: DraftPhoto[] | null
}
