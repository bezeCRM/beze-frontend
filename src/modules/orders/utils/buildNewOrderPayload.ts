import type { OrderCreateFormValues } from '../hooks/useOrderCreateForm'
import type { OrderDeliveryType } from '@/shared/types/types'
import type { NewOrderInput } from '@/shared/store/orders.store'

function toNumber(value: unknown) {
    const s = String(value ?? '')
        .replace(/\s/g, '')
        .replace(',', '.')
    const n = Number(s)
    return Number.isFinite(n) ? n : 0
}

export function buildNewOrderPayload(
    values: OrderCreateFormValues,
    totalPrice: number,
): NewOrderInput {
    const nameClean = (values.name ?? '').trim()
    const clientNameClean = values.clientName.trim()
    const phoneClean = (values.clientPhone ?? '').trim()
    const platformClean = (values.orderPlatform ?? '').trim()

    const deliveryType: OrderDeliveryType = values.delivery.isPickup
        ? 'pickup'
        : 'delivery'

    const products = ((values.items as any[]) ?? []).map((it: any) => {
        const unit = it.product?.unit
        const amount = unit === 'kg' ? toNumber(it.weightKg) : Number(it.count ?? 1)

        return {
            id: it.id,
            product: it.product,
            filling: it.filling,

            count: Number(it.count ?? 1),
            weightKg: toNumber(it.weightKg),
            decorPrice: toNumber(it.decorPrice),

            unit,
            amount,
            price: Number(it.product?.price ?? 0),
        }
    })

    const refsClean = (values.references ?? []).filter(r => !!r?.uri).slice(0, 3)

    return {
        deliveryType,

        ...(nameClean ? { name: nameClean } : {}),
        clientName: clientNameClean,
        ...(phoneClean ? { clientPhone: phoneClean } : {}),
        ...(platformClean ? { orderPlatform: platformClean } : {}),

        address: values.delivery.isPickup ? '' : values.delivery.address.trim(),
        date: values.delivery.date.trim(),
        time: values.delivery.time.trim(),

        products,

        extra: {
            delivery: toNumber(values.extra.delivery),
            urgency: toNumber(values.extra.urgency),
            other: toNumber(values.extra.other),
            discount: toNumber(values.extra.discount),
        },

        ...(values.notes?.trim() ? { notes: values.notes.trim() } : {}),
        ...(refsClean.length ? { references: refsClean } : {}),

        paymentStatus: values.paymentStatus,
        status: values.status,
        inPlanner: values.inPlanner,
        totalPrice,
    }
}
