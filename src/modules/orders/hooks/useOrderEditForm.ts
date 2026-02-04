import { useEffect, useRef } from 'react'
import type { Order, PhotoItem } from '@/shared/types/types'
import {
    useOrderFormBase,
    type OrderCreateFormValues,
    type OrderCreateItem,
} from './useOrderFormBase'

function toText(n: unknown) {
    const num = typeof n === 'number' ? n : Number(n)
    return Number.isFinite(num) ? String(num) : '0'
}

function normalizeReferences(orderId: string, raw?: PhotoItem[] | null): PhotoItem[] {
    const list = Array.isArray(raw) ? raw : []

    return list
        .map((p, idx) => {
            const uri = String((p as any)?.uri ?? '')
            if (!uri) return null
            const id = String((p as any)?.id ?? `${orderId}-${idx}`)
            return { id, uri }
        })
        .filter((p: PhotoItem | null): p is PhotoItem => !!p)
        .slice(0, 3)
}

function toIsoDate(value: string) {
    const v = (value ?? '').trim()
    if (!v) return ''

    // already iso
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v

    // dd.mm.yy
    if (/^\d{2}\.\d{2}\.\d{2}$/.test(v)) {
        const dd = v.slice(0, 2)
        const mm = v.slice(3, 5)
        const yy = v.slice(6, 8)
        return `20${yy}-${mm}-${dd}`
    }

    // dd.mm.yyyy (на всякий случай)
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(v)) {
        const dd = v.slice(0, 2)
        const mm = v.slice(3, 5)
        const yyyy = v.slice(6, 10)
        return `${yyyy}-${mm}-${dd}`
    }

    return v
}

export function useOrderEditForm(order?: Order | null) {
    const base = useOrderFormBase()
    const lastOrderId = useRef<string | null>(null)

    useEffect(() => {
        if (!order) return
        if (lastOrderId.current === order.id) return
        lastOrderId.current = order.id

        const isPickup = order.deliveryType === 'pickup'

        const items: OrderCreateItem[] = (order.products ?? []).map((l: any, idx) => {
            const unit = l?.unit ?? l?.product?.unit
            const amount = typeof l?.amount === 'number' ? l.amount : 1

            const count =
                typeof l?.count === 'number'
                    ? l.count
                    : unit === 'piece'
                      ? Math.max(1, Math.round(amount))
                      : 1

            const weightKg =
                unit === 'kg' ? String(l?.weightKg ?? amount ?? 1).replace('.', ',') : ''

            const decorPrice = toText(l?.decorPrice ?? 0)

            return {
                id: String(l?.id ?? `${order.id}-${idx}`),
                product: l.product,
                filling: l.filling,
                count,
                weightKg,
                decorPrice,
            }
        })

        const extra = order.extra

        const values: OrderCreateFormValues = {
            name: order.name ?? '',
            clientName: order.clientName ?? '',
            clientPhone: order.clientPhone ?? '',
            orderPlatform: order.orderPlatform ?? '',
            delivery: {
                isPickup,
                address: isPickup ? '' : (order.address ?? ''),
                date: toIsoDate(order.date ?? ''),
                time: order.time ?? '',
            },
            items,
            extra: {
                delivery: toText(extra?.delivery ?? 0),
                urgency: toText(extra?.urgency ?? 0),
                other: toText(extra?.other ?? 0),
                discount: toText(extra?.discount ?? 0),
            },
            notes: order.notes ?? '',
            references: normalizeReferences(order.id, order.references),
            paymentStatus: (order as any).paymentStatus ?? 'unpaid',
            status: (order as any).status ?? 'new',
            inPlanner: !!(order as any).inPlanner,
            ...(typeof (order as any).paidAmount !== 'undefined'
                ? { paidAmount: toText((order as any).paidAmount) }
                : {}),
        } as any

        base.reset(values)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order?.id])

    return base
}
