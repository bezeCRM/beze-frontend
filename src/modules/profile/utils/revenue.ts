import type { Order } from '@/shared/types/types'

export type FinancePeriod = 'month' | 'year'

function parseOrderDate(dateStr: string): Date | null {
    if (!dateStr) return null
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr)
    if (!m) return null

    const y = Number(m[1])
    const mo = Number(m[2])
    const d = Number(m[3])

    if (!y || !mo || !d) return null
    return new Date(y, mo - 1, d, 0, 0, 0, 0)
}

function isSameCalendarMonth(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

function isSameCalendarYear(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear()
}

function isInPeriod(orderDate: Date, now: Date, period: FinancePeriod) {
    return period === 'month'
        ? isSameCalendarMonth(orderDate, now)
        : isSameCalendarYear(orderDate, now)
}

function toNum(v: unknown) {
    const n = Number(v)
    return Number.isFinite(n) ? n : 0
}

function clamp(min: number, v: number, max: number) {
    return Math.max(min, Math.min(v, max))
}

export function calcReceivedRevenue(
    orders: Order[] | null | undefined,
    period: FinancePeriod,
    now: Date = new Date(),
): number {
    if (!orders?.length) return 0

    let sum = 0

    for (const o of orders) {
        const od = parseOrderDate(o.date)
        if (!od) continue
        if (!isInPeriod(od, now, period)) continue

        const total = Math.max(0, toNum(o.totalPrice))
        const paidRaw = Math.max(0, toNum(o.paidAmount))
        const paid = clamp(0, paidRaw, total)

        if (o.paymentStatus === 'paid') sum += total
        else if (o.paymentStatus === 'partial') sum += paid
    }

    return sum
}

export function calcExpectedRest(
    orders: Order[] | null | undefined,
    period: FinancePeriod,
    now: Date = new Date(),
): number {
    if (!orders?.length) return 0

    let sum = 0

    for (const o of orders) {
        if (o.status === 'canceled') continue
        const od = parseOrderDate(o.date)
        if (!od) continue
        if (!isInPeriod(od, now, period)) continue

        const total = Math.max(0, toNum(o.totalPrice))
        if (total <= 0) continue

        const paidRaw = Math.max(0, toNum(o.paidAmount))
        const paid = clamp(0, paidRaw, total)

        // unpaid -> ожидаем всю сумму
        // partial -> ожидаем остаток
        // paid -> 0
        if (o.paymentStatus === 'paid') continue

        sum += Math.max(0, total - paid)
    }

    return sum
}

/**
 * "средний чек" за период:
 * считаем среднее по заказам, которые попали в период и имеют полученные деньги (paid или partial),
 * берём фактически полученную сумму по заказу (paid -> totalPrice, partial -> paidAmount),
 * округляем до целого.
 */
export function calcAverageCheck(
    orders: Order[] | null | undefined,
    period: FinancePeriod,
    now: Date = new Date(),
): number {
    if (!orders?.length) return 0

    let sum = 0
    let count = 0

    for (const o of orders) {
        if (o.status === 'canceled') continue
        const od = parseOrderDate(o.date)
        if (!od) continue
        if (!isInPeriod(od, now, period)) continue

        const total = Math.max(0, toNum(o.totalPrice))
        if (total <= 0) continue

        sum += total
        count += 1
    }

    if (count === 0) return 0
    return Math.round(sum / count)
}

/**
 * Считаем количество заказов, которые попали в период и имеют статус оплаты paid или partial, и по которым была получена фактическая сумма > 0
 */

export function calcPaidOrdersCount(
    orders: Order[] | null | undefined,
    period: FinancePeriod,
    now: Date = new Date(),
): number {
    if (!orders?.length) return 0

    let count = 0

    for (const o of orders) {
        if (o.status === 'canceled') continue
        const od = parseOrderDate(o.date)
        if (!od) continue
        if (!isInPeriod(od, now, period)) continue

        if (o.paymentStatus !== 'paid' && o.paymentStatus !== 'partial') continue

        const total = Math.max(0, toNum(o.totalPrice))
        if (total <= 0) continue

        const paidRaw = Math.max(0, toNum(o.paidAmount))
        const paid = clamp(0, paidRaw, total)
        if (paid <= 0) continue

        count += 1
    }

    return count
}

export function getLargestOrderInPeriod(
    orders: Order[] | null | undefined,
    period: FinancePeriod,
    now: Date = new Date(),
): Order | undefined {
    if (!orders?.length) return undefined

    let best: Order | undefined
    let bestTotal = 0

    for (const o of orders) {
        if (o.status === 'canceled') continue
        const od = parseOrderDate(o.date)
        if (!od) continue
        if (!isInPeriod(od, now, period)) continue

        const total = Math.max(0, toNum(o.totalPrice))
        if (total <= 0) continue

        if (!best || total > bestTotal) {
            best = o
            bestTotal = total
        }
    }

    return best
}
