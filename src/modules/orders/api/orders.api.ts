import { http } from '@/api'
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
    const { data } = await http.patch<any>(`/orders/${id}`, patch)
    return mapOrderFromApi(data)
}
