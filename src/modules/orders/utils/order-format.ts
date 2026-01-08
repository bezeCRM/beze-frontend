import type { OrderDeliveryType, ProductUnit } from '@/shared/types/types'

function pad2(n: number) {
    return String(n).padStart(2, '0')
}

export function formatCreatedAt(createdAt?: string) {
    if (!createdAt) return null
    const d = new Date(createdAt)
    if (Number.isNaN(d.getTime())) return null

    const day = pad2(d.getDate())
    const month = pad2(d.getMonth() + 1)
    const year = pad2(d.getFullYear() % 100)
    const hh = pad2(d.getHours())
    const mm = pad2(d.getMinutes())

    return `создан ${day}.${month}.${year} в ${hh}:${mm}`
}

export function formatMoney(value: number) {
    return value.toLocaleString('ru-RU')
}

export function formatAmount(amount: number, unit: ProductUnit) {
    if (unit === 'kg') return `${amount.toLocaleString('ru-RU')} кг`
    return `${amount.toLocaleString('ru-RU')} шт`
}

export function formatDeliveryTitle(deliveryType: OrderDeliveryType, address?: string) {
    const base = deliveryType === 'pickup' ? 'Самовывоз' : ''
    const a = (address ?? '').trim()
    return a ? `${a}` : base
}

export function formatDeliveryDateTime(date?: string, time?: string) {
    const d = (date ?? '').trim()
    const t = (time ?? '').trim()
    if (!d && !t) return '—'
    if (d && t) return `${d}, ${t}`
    return d || t
}
