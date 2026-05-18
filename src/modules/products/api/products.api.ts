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

type ProductPhotoUploadResponse = {
    uri: string
}

function getFileNameFromUri(uri: string): string {
    const fallback = `product-photo-${Date.now()}.jpg`
    const name = uri.split('/').pop()
    return name || fallback
}

function getMimeTypeFromFileName(fileName: string): string {
    const lower = fileName.toLowerCase()

    if (lower.endsWith('.png')) return 'image/png'
    if (lower.endsWith('.webp')) return 'image/webp'
    if (lower.endsWith('.heic')) return 'image/heic'
    if (lower.endsWith('.heif')) return 'image/heif'

    return 'image/jpeg'
}

export async function uploadProductPhoto(localUri: string): Promise<string> {
    const fileName = getFileNameFromUri(localUri)

    const formData = new FormData()
    formData.append('file', {
        uri: localUri,
        name: fileName,
        type: getMimeTypeFromFileName(fileName),
    } as any)

    const { data } = await http.post<ProductPhotoUploadResponse>(
        '/products/photos',
        formData,
    )

    return data.uri
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
