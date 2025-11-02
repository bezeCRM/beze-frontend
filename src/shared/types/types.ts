export type FiltersItem = {
    id: number
    name: string
}

type ProductUnit = 'piece' | 'kg'

export type Product = {
    id: string
    name: string
    category: Category[]
    price: number
    fillings?: string[]
    ingredients?: string[]
    recipe?: string
    unit: ProductUnit
    photo?: string
    createdAt: string
    updatedAt: string
}

export type Category = {
    id: string
    name: string
}
