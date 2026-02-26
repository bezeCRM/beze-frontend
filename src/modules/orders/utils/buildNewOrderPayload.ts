import type { OrderUpsertRequest } from '@/modules/orders/api/orders.api'
import type { OrderCreateFormValues, OrderCreateItem } from '../hooks/useOrderCreateForm'
import { parseRubInt } from '@/shared/utils/utils'

function toNumber(value: unknown, fallback = 0): number {
    const s = String(value ?? '')
        .trim()
        .replace(',', '.')
    const n = Number(s)
    return Number.isFinite(n) ? n : fallback
}

function clamp(n: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, n))
}

function trimOrUndef(value: unknown): string | undefined {
    const s = String(value ?? '').trim()
    return s.length ? s : undefined
}

function calcPaidAmount(values: OrderCreateFormValues, totalPrice: number): number {
    const status = (values as any).paymentStatus as 'unpaid' | 'paid' | 'partial'
    const tp = Math.max(0, totalPrice)

    if (status === 'paid') return tp
    if (status === 'unpaid') return 0

    // partial
    const raw = parseRubInt((values as any).paidAmount)
    return clamp(raw, 0, tp)
}

function normalizeAmount(item: OrderCreateItem): number {
    const unit = item.product.unit
    const count = Math.max(1, Math.round(toNumber(item.count, 1)))

    if (unit === 'piece') return count

    const weight = toNumber(item.weightKg, 1)
    return Math.max(0, weight) * count
}

function groupProducts(items: OrderCreateItem[]) {
    const map = new Map<
        string,
        { productId: string; fillingId?: string; amount: number }
    >()
    for (const it of items) {
        const productId = it?.product?.id
        if (!productId) continue
        const fillingId = it.filling?.id
        const amount = normalizeAmount(it)
        if (amount <= 0) continue

        const key = `${productId}:${fillingId ?? ''}`
        const prev = map.get(key)
        if (!prev) {
            map.set(key, { productId, ...(fillingId ? { fillingId } : {}), amount })
        } else {
            prev.amount += amount
        }
    }
    return Array.from(map.values())
}

function groupDecorPrices(items: OrderCreateItem[]) {
    const map = new Map<string, number>()
    for (const it of items) {
        const productId = it?.product?.id
        if (!productId) continue
        const price = toNumber(it.decorPrice, 0)
        if (price <= 0) continue
        map.set(productId, (map.get(productId) ?? 0) + price)
    }
    return Array.from(map.entries()).map(([productId, price]) => ({ productId, price }))
}

export function buildNewOrderPayload(
    values: OrderCreateFormValues,
    totalPrice: number,
): OrderUpsertRequest {
    const deliveryType = values.delivery.isPickup ? 'pickup' : 'delivery'
    const address =
        deliveryType === 'delivery' ? trimOrUndef(values.delivery.address) : undefined

    const items = ((values as any).items ?? []) as OrderCreateItem[]
    const paidAmount = calcPaidAmount(values, totalPrice)

    const extra = values.extra
        ? {
              delivery: toNumber(values.extra.delivery, 0),
              urgency: toNumber(values.extra.urgency, 0),
              other: toNumber(values.extra.other, 0),
              discount: toNumber(values.extra.discount, 0),
          }
        : undefined

    const referencesRaw = (values as any).references as { uri?: string }[] | undefined
    const references = (referencesRaw ?? [])
        .map(r => ({ uri: String(r?.uri ?? '').trim() }))
        .filter(r => r.uri.length > 0)
        .slice(0, 3)

    const decorPrices = groupDecorPrices(items)
    const products = groupProducts(items)

    return {
        name: trimOrUndef(values.name),
        clientName: String(values.clientName ?? '').trim(),
        clientPhone: trimOrUndef(values.clientPhone),
        orderPlatform: trimOrUndef(values.orderPlatform),

        deliveryType,
        ...(address ? { address } : {}),

        date: String(values.delivery.date ?? '').trim(),
        time: String(values.delivery.time ?? '').trim(),

        products,
        ...(decorPrices.length ? { decorPrices } : {}),
        ...(extra ? { extra } : {}),

        notes: trimOrUndef(values.notes),
        ...(references.length ? { references } : {}),

        status: (values as any).status,
        paidAmount,
        inPlanner: !!(values as any).inPlanner,
    }
}
