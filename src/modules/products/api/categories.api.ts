import { http } from '@/api'
import type { Category } from '@/shared/types/types'

type CreateCategoryRequest = { name: string }

export async function getCategories(): Promise<Category[]> {
    const { data } = await http.get<Category[]>('/categories')
    return data
}

export async function createCategory(payload: CreateCategoryRequest): Promise<Category> {
    const { data } = await http.post<Category>('/categories', payload)
    return data
}

export async function deleteCategoryApi(id: string): Promise<void> {
    await http.delete(`/categories/${id}`)
}
