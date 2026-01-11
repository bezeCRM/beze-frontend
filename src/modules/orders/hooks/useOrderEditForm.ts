import { useEffect, useRef } from 'react'
import type { Order, PhotoItem } from '@/shared/types/types'
import {
    type OrderCreateFormValues,
    type OrderCreateItem,
    useOrderCreateForm,
} from './useOrderCreateForm'

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

export function useOrderEditForm(order?: Order | null) {
    const form = useOrderCreateForm()
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
                date: order.date ?? '',
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

        form.reset(values)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order?.id])

    return form
}
