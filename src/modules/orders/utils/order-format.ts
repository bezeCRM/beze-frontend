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

    const dateText = formatIsoToDayMonthRu(d)
    if (dateText && t) return `${dateText}, ${t}`
    return dateText || t || '—'
}

function formatIsoToDayMonthRu(iso?: string) {
    const v = (iso ?? '').trim()
    if (!v) return ''

    const m = v.match(/^(\d{4})-(\d{2})-(\d{2})$/)
    if (!m) return v

    const monthNames = [
        'янв',
        'фев',
        'мар',
        'апр',
        'мая',
        'июн',
        'июл',
        'авг',
        'сен',
        'окт',
        'ноя',
        'дек',
    ]

    const month = Number(m[2])
    const day = Number(m[3])

    if (!Number.isFinite(month) || !Number.isFinite(day)) return v
    if (month < 1 || month > 12) return v
    if (day < 1 || day > 31) return v

    return `${day} ${monthNames[month - 1]}`
}

export function isoToDotsShort(value?: string | null) {
    const v = (value ?? '').trim()
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return ''
    const [y, m, d] = v.split('-')
    return `${d}.${m}.${y.slice(2)}`
}
