import { Platform } from 'react-native'
import { File, UploadType } from 'expo-file-system'

import { http } from '@/api'
import { ENV } from '@/api/config/env'
import { getAccessToken } from '@/api/storage/tokenStorage'
import { forceLogoutLocal, refreshTokensOnce } from '@/api/http/refreshManager'
import { shouldLogoutOnRefreshError } from '@/api/http/refreshPolicy'
import { toApiError, type ApiError } from '@/api/http/errors'
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

const MAX_PHOTO_SIZE = 10 * 1024 * 1024

function getFileNameFromUri(uri: string): string {
    const fallback = `product-photo-${Date.now()}.jpg`
    const name = uri.split('?')[0].split('/').pop()

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

function parseJson(body: string): unknown {
    try {
        return JSON.parse(body)
    } catch {
        return null
    }
}

function isPhotoUploadResponse(value: unknown): value is ProductPhotoUploadResponse {
    return (
        typeof value === 'object' &&
        value !== null &&
        'uri' in value &&
        typeof value.uri === 'string' &&
        value.uri.length > 0
    )
}

function createUnauthorizedError(): ApiError {
    return {
        kind: 'http',
        status: 401,
        message: 'Требуется авторизация',
    }
}

function createUploadHttpError(status: number, body: unknown): ApiError {
    let message =
        status === 401
            ? 'Требуется авторизация'
            : `Ошибка загрузки фотографии (HTTP ${status})`

    if (typeof body === 'object' && body !== null && 'detail' in body) {
        const detail = body.detail

        if (typeof detail === 'string' && detail.trim()) {
            message = detail
        }
    }

    return {
        kind: 'http',
        status,
        message,
        details: body,
    }
}

async function refreshPhotoAccessToken(): Promise<string> {
    try {
        await refreshTokensOnce()
    } catch (error) {
        if (shouldLogoutOnRefreshError(error)) {
            await forceLogoutLocal()
        }

        throw toApiError(error)
    }

    const token = await getAccessToken()

    if (!token) {
        throw createUnauthorizedError()
    }

    return token
}

async function uploadAndroidProductPhoto(
    localUri: string,
    mimeType: string,
): Promise<string> {
    const file = new File(localUri)

    if (!file.exists || file.size <= 0) {
        throw new Error('Файл фотографии недоступен для загрузки')
    }

    if (file.size > MAX_PHOTO_SIZE) {
        throw new Error('Фотография не должна превышать 10 МБ')
    }

    const url = `${ENV.apiBaseUrl.replace(/\/$/, '')}/products/photos`

    const send = async (accessToken: string) => {
        try {
            return await file.upload(url, {
                httpMethod: 'POST',
                uploadType: UploadType.MULTIPART,
                fieldName: 'file',
                mimeType,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: 'application/json',
                },
            })
        } catch (error) {
            throw {
                kind: 'network',
                status: null,
                message: 'Не удалось отправить фотографию. Проверьте соединение',
                details: error,
            } satisfies ApiError
        }
    }

    const storedToken = await getAccessToken()
    const token = storedToken ?? (await refreshPhotoAccessToken())

    let result = await send(token)

    if (result.status === 401) {
        const currentToken = await getAccessToken()

        const retryToken =
            currentToken && currentToken !== token
                ? currentToken
                : await refreshPhotoAccessToken()

        result = await send(retryToken)
    }

    const body = parseJson(result.body)

    if (result.status < 200 || result.status >= 300) {
        throw createUploadHttpError(result.status, body)
    }

    if (!isPhotoUploadResponse(body)) {
        throw new Error('Сервер вернул некорректный ответ при загрузке фотографии')
    }

    return body.uri
}

export async function uploadProductPhoto(localUri: string): Promise<string> {
    const fileName = getFileNameFromUri(localUri)
    const mimeType = getMimeTypeFromFileName(fileName)

    if (Platform.OS === 'android') {
        return uploadAndroidProductPhoto(localUri, mimeType)
    }

    const formData = new FormData()

    formData.append('file', {
        uri: localUri,
        name: fileName,
        type: mimeType,
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
