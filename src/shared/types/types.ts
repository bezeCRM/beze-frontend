export type ProductUnit = 'piece' | 'kg'
export type PhotoItem = { id: string; uri: string }

export type Product = {
    id: string
    name: string
    category?: Category
    price: number
    fillings?: Filling[]
    ingredients?: Ingredient[]
    recipe?: string
    unit: ProductUnit
    photoes?: PhotoItem[]
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
