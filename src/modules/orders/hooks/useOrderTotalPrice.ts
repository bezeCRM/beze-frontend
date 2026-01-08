import { useMemo } from 'react'
import type { OrderCreateItem } from './useOrderCreateForm'

function parseNumber(text: string) {
    const s = String(text ?? '')
        .replace(/\s/g, '')
        .replace(',', '.')
    const n = Number(s)
    return Number.isFinite(n) ? n : 0
}

export function useOrderTotalPrice(
    items: OrderCreateItem[],
    extra:
        | {
              delivery?: string
              urgency?: string
              urgent?: string
              other?: string
              discount?: string
          }
        | null
        | undefined,
) {
    const delivery = extra?.delivery ?? '0'
    const urgency = (extra?.urgency ?? extra?.urgent ?? '0') as string
    const other = extra?.other ?? '0'
    const discount = extra?.discount ?? '0'

    return useMemo(() => {
        const itemsTotal = items.reduce((sum, it) => {
            const unit = it.product?.unit
            if (unit === 'kg') {
                const w = parseNumber(it.weightKg)
                return sum + (it.product?.price ?? 0) * w
            }
            return sum + (it.product?.price ?? 0) * (it.count ?? 1)
        }, 0)

        const decorTotal = items.reduce((sum, it) => sum + parseNumber(it.decorPrice), 0)

        const extraTotal =
            parseNumber(delivery) +
            parseNumber(urgency) +
            parseNumber(other) -
            parseNumber(discount)

        const res = itemsTotal + decorTotal + extraTotal
        return res < 0 ? 0 : Math.round(res)
    }, [items, delivery, urgency, other, discount])
}
