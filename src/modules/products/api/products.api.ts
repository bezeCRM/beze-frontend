import { http } from '@/api'
import type { Product, ProductUnit } from '@/shared/types/types'

type CreateOrUpdateProductRequest = {
    name: string
    price: number
    categoryId?: string
    recipe?: string
    unit: ProductUnit
    fillings?: { name: string }[]
    ingredients?: { name: string; weightGrams: string }[]
    photoUris?: string[]
}

export async function getProducts(): Promise<Product[]> {
    const { data } = await http.get<Product[]>('/products')
    return data
}

export async function getProductById(id: string): Promise<Product> {
    const { data } = await http.get<Product>(`/products/${id}`)
    return data
}

export async function createProduct(
    payload: CreateOrUpdateProductRequest,
): Promise<Product> {
    const { data } = await http.post<Product>('/products', payload)
    return data
}

export async function updateProductApi(
    id: string,
    payload: CreateOrUpdateProductRequest,
): Promise<Product> {
    const { data } = await http.put<Product>(`/products/${id}`, payload)
    return data
}

export async function deleteProductApi(id: string): Promise<void> {
    await http.delete(`/products/${id}`)
}
