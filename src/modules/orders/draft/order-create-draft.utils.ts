import type { OrderCreateFormValues } from '../hooks/useOrderFormBase'

const isNonEmpty = (v?: string) => (v ?? '').trim().length > 0

const toNumber = (v?: string) => {
    const t = String(v ?? '')
        .trim()
        .replace(',', '.')
    const n = Number(t)
    return Number.isFinite(n) ? n : 0
}

export function hasOrderCreateMeaningfulValues(values?: OrderCreateFormValues) {
    if (!values) return false

    if (isNonEmpty(values.name)) return true
    if (isNonEmpty(values.clientName)) return true
    if (isNonEmpty(values.clientPhone)) return true
    if (isNonEmpty(values.orderPlatform)) return true

    if (values.delivery) {
        if (isNonEmpty(values.delivery.date)) return true
        if (isNonEmpty(values.delivery.time)) return true
        if (values.delivery.isPickup === false && isNonEmpty(values.delivery.address))
            return true
    }

    if ((values.items ?? []).length > 0) return true
    if ((values.references ?? []).length > 0) return true
    if (isNonEmpty(values.notes)) return true

    if (toNumber(values.paidAmount) !== 0) return true
    if (values.paymentStatus !== 'unpaid') return true
    if (values.status !== 'new') return true
    if (values.inPlanner !== true) return true

    const extra = values.extra
    if (toNumber(extra?.delivery) !== 0) return true
    if (toNumber(extra?.urgency) !== 0) return true
    if (toNumber(extra?.other) !== 0) return true
    if (toNumber(extra?.discount) !== 0) return true

    return false
}

export function mergeOrderCreateDraft(
    base: OrderCreateFormValues,
    draft: OrderCreateFormValues,
): OrderCreateFormValues {
    return {
        ...base,
        ...draft,
        delivery: { ...base.delivery, ...(draft.delivery ?? {}) },
        extra: { ...base.extra, ...(draft.extra ?? {}) },
        items: draft.items ?? base.items,
        references: draft.references ?? base.references,
    }
}
