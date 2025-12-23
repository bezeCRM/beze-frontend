export type ProductUnit = 'piece' | 'kg'

export type Product = {
    id: string
    name: string
    category?: Category
    price: number
    fillings?: Filling[]
    ingredients?: Ingredient[]
    recipe?: string
    unit: ProductUnit
    photoes?: string[]
    createdAt: string
    updatedAt: string
}

export type Category = {
    id: string
    name: string
}

export type Filling = {
    id: string
    name: string
}

export type Ingredient = {
    id: string
    name: string
    weightGrams: string
}
