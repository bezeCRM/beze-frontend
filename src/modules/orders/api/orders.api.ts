import { Platform } from 'react-native'
import { File, UploadType } from 'expo-file-system'

import { http } from '@/api'
import { ENV } from '@/api/config/env'
import { getAccessToken } from '@/api/storage/tokenStorage'
import { forceLogoutLocal, refreshTokensOnce } from '@/api/http/refreshManager'
import { shouldLogoutOnRefreshError } from '@/api/http/refreshPolicy'
import { toApiError, type ApiError } from '@/api/http/errors'
import type {
    Filling,
    Order,
    OrderDecorPrice,
    OrderExtra,
    OrderProductLine,
    OrderStatus,
    PhotoItem,
} from '@/shared/types/types'

export type OrderUpsertProductDto = {
    productId: string
    amount: number
    fillingId?: string
}

export type OrderUpsertDecorPriceDto = {
    productId: string
    price: number
}

export type OrderUpsertReferenceDto = {
    uri: string
}

export type OrderUpsertRequest = {
    name?: string
    clientName: string
    clientPhone?: string
    orderPlatform?: string

    deliveryType: 'pickup' | 'delivery'
    address?: string

    date: string
    time: string

    products: OrderUpsertProductDto[]
    decorPrices?: OrderUpsertDecorPriceDto[]
    extra?: OrderExtra
    notes?: string
    references?: OrderUpsertReferenceDto[]

    status: OrderStatus
    paidAmount: number
    inPlanner: boolean
}

export type OrderPatchRequest = {
    name?: string | null

    clientName?: string | null
    clientPhone?: string | null
    orderPlatform?: string | null

    deliveryType?: 'pickup' | 'delivery'
    address?: string | null

    date?: string | null
    time?: string | null

    products?: { productId: string; amount: number; fillingId?: string | null }[] | null
    decorPrices?: { productId: string; price: number }[] | null
    extra?: { delivery: number; urgency: number; other: number; discount: number } | null

    notes?: string | null
    references?: { uri: string }[] | null

    status?: OrderStatus | null
    paidAmount?: number | null
    inPlanner?: boolean | null
}

type OrderApiDto = Omit<
    Order,
    | 'decorPrices'
    | 'extra'
    | 'references'
    | 'products'
    | 'name'
    | 'clientPhone'
    | 'orderPlatform'
    | 'address'
    | 'notes'
    | 'lastPaymentAt'
> & {
    decorPrices?: OrderDecorPrice[] | null
    extra?: OrderExtra | null
    references?: PhotoItem[] | null

    products: (Omit<OrderProductLine, 'filling'> & { filling?: Filling | null })[]

    name?: string | null
    clientPhone?: string | null
    orderPlatform?: string | null
    address?: string | null
    notes?: string | null
    lastPaymentAt?: string | null

    paymentStatus?: 'unpaid' | 'partial' | 'paid'
}

type OrderReferenceUploadResponse = {
    uri: string
}

function getFileNameFromUri(uri: string): string {
    const fallback = `order-reference-${Date.now()}.jpg`
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

function parseUploadJson(body: string): unknown {
    try {
        return JSON.parse(body)
    } catch {
        return null
    }
}

function isReferenceUploadResponse(
    value: unknown,
): value is OrderReferenceUploadResponse {
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

async function refreshReferenceAccessToken(): Promise<string> {
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

async function uploadAndroidOrderReference(
    localUri: string,
    mimeType: string,
): Promise<string> {
    const file = new File(localUri)

    if (!file.exists || file.size <= 0) {
        throw new Error('Файл фотографии недоступен для загрузки')
    }

    const url = `${ENV.apiBaseUrl.replace(/\/$/, '')}/orders/references`

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
    const token = storedToken ?? (await refreshReferenceAccessToken())

    let result = await send(token)

    if (result.status === 401) {
        const currentToken = await getAccessToken()

        const retryToken =
            currentToken && currentToken !== token
                ? currentToken
                : await refreshReferenceAccessToken()

        result = await send(retryToken)
    }

    const body = parseUploadJson(result.body)

    if (result.status < 200 || result.status >= 300) {
        throw createUploadHttpError(result.status, body)
    }

    if (!isReferenceUploadResponse(body)) {
        throw new Error('Сервер вернул некорректный ответ при загрузке фотографии')
    }

    return body.uri
}

export async function uploadOrderReference(localUri: string): Promise<string> {
    const fileName = getFileNameFromUri(localUri)
    const mimeType = getMimeTypeFromFileName(fileName)

    if (Platform.OS === 'android') {
        return uploadAndroidOrderReference(localUri, mimeType)
    }

    const formData = new FormData()

    formData.append('file', {
        uri: localUri,
        name: fileName,
        type: mimeType,
    } as any)

    const { data } = await http.post<OrderReferenceUploadResponse>(
        '/orders/references',
        formData,
    )

    return data.uri
}

function optString(v: string | null | undefined): string | undefined {
    return v == null ? undefined : v
}

function optObj<T>(v: T | null | undefined): T | undefined {
    return v == null ? undefined : v
}

function mapOrderFromApi(dto: OrderApiDto): Order {
    return {
        id: dto.id,

        name: optString(dto.name),

        clientName: dto.clientName,
        clientPhone: optString(dto.clientPhone),
        orderPlatform: optString(dto.orderPlatform),

        deliveryType: dto.deliveryType,
        address: optString(dto.address),

        date: dto.date,
        time: dto.time,

        products: (dto.products ?? []).map(p => ({
            ...p,
            filling: optObj(p.filling),
        })),

        decorPrices: optObj(dto.decorPrices),
        extra: optObj(dto.extra),

        notes: optString(dto.notes),
        references: optObj(dto.references),

        status: dto.status,
        paidAmount: dto.paidAmount,

        inPlanner: dto.inPlanner,

        totalPrice: dto.totalPrice,
        lastPaymentAt: optString(dto.lastPaymentAt),

        createdAt: dto.createdAt,
        updatedAt: dto.updatedAt,
    }
}

export async function getOrders(): Promise<Order[]> {
    const { data } = await http.get<OrderApiDto[]>('/orders')
    return data.map(mapOrderFromApi)
}

export async function getOrderById(id: string): Promise<Order> {
    const { data } = await http.get<OrderApiDto>(`/orders/${id}`)
    return mapOrderFromApi(data)
}

export async function createOrder(payload: OrderUpsertRequest): Promise<Order> {
    const { data } = await http.post<OrderApiDto>('/orders', payload)
    return mapOrderFromApi(data)
}

export async function updateOrderApi(
    id: string,
    payload: OrderUpsertRequest,
): Promise<Order> {
    const { data } = await http.put<OrderApiDto>(`/orders/${id}`, payload)
    return mapOrderFromApi(data)
}

export async function deleteOrderApi(id: string): Promise<void> {
    await http.delete(`/orders/${id}`)
}

export async function patchOrderApi(
    id: string,
    patch: OrderPatchRequest,
): Promise<Order> {
    const { data } = await http.patch<OrderApiDto>(`/orders/${id}`, patch)
    return mapOrderFromApi(data)
}
