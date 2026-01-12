import { create } from 'zustand'
import type { Order, OrderPaymentStatus } from '@/shared/types/types'
import { mockOrders } from '@/shared/utils/mock-orders'

export type NewOrderInput = Omit<
    Order,
    'id' | 'createdAt' | 'updatedAt' | 'paidAmount'
> & {
    paidAmount?: number
}

type OrdersStore = {
    orders: Order[]
    addOrder: (data: NewOrderInput) => string
    updateOrder: (
        id: string,
        patch: Partial<Omit<Order, 'id' | 'createdAt' | 'updatedAt'>>,
    ) => void
    removeOrder: (id: string) => void
    getById: (id: string) => Order | undefined
    clear: () => void
}

function calcOrderTotal(data: NewOrderInput) {
    const productsSum = (data.products ?? []).reduce(
        (acc, line) => acc + (Number(line.price) || 0) * (Number(line.amount) || 0),
        0,
    )

    const decorSum = (data.decorPrices ?? []).reduce(
        (acc, d) => acc + (Number(d.price) || 0),
        0,
    )

    const extra = data.extra
    const extraSum =
        (Number(extra?.delivery) || 0) +
        (Number(extra?.urgency) || 0) +
        (Number(extra?.other) || 0) -
        (Number(extra?.discount) || 0)

    const total = productsSum + decorSum + extraSum
    return total > 0 ? total : 0
}

function clampPaidAmount(total: number, paid: number) {
    const t = Math.max(0, total || 0)
    const p = Math.max(0, paid || 0)
    return Math.min(p, t)
}

function defaultPartialPaid(total: number) {
    const t = Math.max(0, total || 0)
    return t > 0 ? Math.round(t * 0.5) : 0
}

function derivePaymentStatus(total: number, paid: number): OrderPaymentStatus {
    const t = Math.max(0, total || 0)
    const p = clampPaidAmount(t, paid)
    if (p <= 0) return 'unpaid'
    if (p >= t && t > 0) return 'paid'
    return t === 0 ? 'unpaid' : 'partial'
}

function resolvePaidAmount(
    total: number,
    status: OrderPaymentStatus,
    paidAmount?: number,
) {
    if (status === 'unpaid') return 0
    if (status === 'paid') return Math.max(0, total || 0)

    const base = typeof paidAmount === 'number' ? paidAmount : defaultPartialPaid(total)
    return clampPaidAmount(total, base)
}

export const useOrdersStore = create<OrdersStore>((set, get) => ({
    orders: [...mockOrders],

    addOrder: data => {
        const id = Date.now().toString()
        const now = new Date().toISOString()

        const name = data.name?.trim()
        const clientName = data.clientName.trim()
        const clientPhone = data.clientPhone?.trim()
        const orderPlatform = data.orderPlatform?.trim()
        const address = data.address?.trim()
        const notes = data.notes?.trim()

        const products = (data.products ?? []).map(l => ({
            ...l,
            amount: Number(l.amount) || 0,
            price: Number(l.price) || 0,
        }))

        const decorPrices = (data.decorPrices ?? [])
            .map(d => ({ ...d, name: d.name.trim(), price: Number(d.price) || 0 }))
            .filter(d => d.name.length > 0 || d.price > 0)

        const references = (data.references ?? []).filter(p => !!p?.uri)

        const base: NewOrderInput = {
            ...data,
            ...(name ? { name } : {}),
            clientName,
            ...(clientPhone ? { clientPhone } : {}),
            ...(orderPlatform ? { orderPlatform } : {}),
            ...(address ? { address } : {}),
            ...(notes ? { notes } : {}),
            products,
            ...(decorPrices.length ? { decorPrices } : {}),
            ...(references.length ? { references } : {}),
        }

        const totalPrice = Number(base.totalPrice) || calcOrderTotal(base)

        const paidAmount = resolvePaidAmount(
            totalPrice,
            base.paymentStatus,
            typeof (data as any).paidAmount === 'number'
                ? (data as any).paidAmount
                : undefined,
        )

        const paymentStatus = derivePaymentStatus(totalPrice, paidAmount)

        const order: Order = {
            id,
            ...base,
            totalPrice,
            paidAmount,
            paymentStatus,
            createdAt: now,
            updatedAt: now,
        }

        set(state => ({ orders: [order, ...state.orders] }))
        return id
    },

    updateOrder: (id, patch) => {
        const p = { ...patch }

        if ('name' in p) {
            const n = p.name?.trim()
            p.name = n ? n : undefined
        }

        if ('clientName' in p) {
            p.clientName = (p.clientName ?? '').trim()
        }

        if ('clientPhone' in p) {
            const t = p.clientPhone?.trim()
            p.clientPhone = t ? t : undefined
        }

        if ('orderPlatform' in p) {
            const t = p.orderPlatform?.trim()
            p.orderPlatform = t ? t : undefined
        }

        if ('address' in p) {
            const t = p.address?.trim()
            p.address = t ? t : undefined
        }

        if ('notes' in p) {
            const t = p.notes?.trim()
            p.notes = t ? t : undefined
        }

        if ('products' in p) {
            p.products = (p.products ?? []).map(l => ({
                ...l,
                amount: Number(l.amount) || 0,
                price: Number(l.price) || 0,
            }))
        }

        if ('decorPrices' in p) {
            const arr = (p.decorPrices ?? [])
                .map(d => ({
                    ...d,
                    name: d.name?.trim() ?? '',
                    price: Number(d.price) || 0,
                }))
                .filter(d => d.name || d.price > 0)
            p.decorPrices = arr.length ? arr : undefined
        }

        if ('references' in p) {
            const arr = (p.references ?? []).filter(r => !!r?.uri)
            p.references = arr.length ? arr : undefined
        }

        const affectsTotal =
            typeof (p as any).totalPrice === 'number' ||
            'products' in p ||
            'decorPrices' in p ||
            'extra' in p

        const affectsPayment = 'paymentStatus' in p || 'paidAmount' in p

        set(state => ({
            orders: state.orders.map(o => {
                if (o.id !== id) return o

                const nextBase = { ...o, ...p }

                const totalPrice = affectsTotal
                    ? typeof (p as any).totalPrice === 'number'
                        ? (p as any).totalPrice
                        : calcOrderTotal({
                              name: nextBase.name,
                              clientName: nextBase.clientName,
                              clientPhone: nextBase.clientPhone,
                              orderPlatform: nextBase.orderPlatform,
                              deliveryType: nextBase.deliveryType,
                              address: nextBase.address,
                              date: nextBase.date,
                              time: nextBase.time,
                              products: nextBase.products,
                              decorPrices: nextBase.decorPrices,
                              extra: nextBase.extra,
                              notes: nextBase.notes,
                              references: nextBase.references,
                              paymentStatus: nextBase.paymentStatus,
                              status: nextBase.status,
                              inPlanner: nextBase.inPlanner,
                              totalPrice: nextBase.totalPrice,
                          })
                    : o.totalPrice

                const prevPaid =
                    typeof o.paidAmount === 'number'
                        ? o.paidAmount
                        : resolvePaidAmount(o.totalPrice, o.paymentStatus)

                let nextPaid = prevPaid
                let nextPaymentStatus = o.paymentStatus

                if (affectsPayment) {
                    if ('paymentStatus' in p) {
                        const s = p.paymentStatus
                        if (s === 'unpaid') nextPaid = 0
                        if (s === 'paid') nextPaid = totalPrice

                        if (s === 'partial') {
                            if ('paidAmount' in p && typeof p.paidAmount === 'number') {
                                nextPaid = p.paidAmount
                            } else {
                                nextPaid = defaultPartialPaid(totalPrice)
                            }
                        }
                    } else if ('paidAmount' in p) {
                        nextPaid = typeof p.paidAmount === 'number' ? p.paidAmount : 0
                    }

                    nextPaid = clampPaidAmount(totalPrice, nextPaid)
                    nextPaymentStatus = derivePaymentStatus(totalPrice, nextPaid)
                } else if (affectsTotal) {
                    nextPaid = clampPaidAmount(totalPrice, nextPaid)
                    nextPaymentStatus = derivePaymentStatus(totalPrice, nextPaid)
                } else {
                    nextPaid = o.paidAmount
                    nextPaymentStatus = o.paymentStatus
                }

                return {
                    ...nextBase,
                    totalPrice,
                    paidAmount: nextPaid,
                    paymentStatus: nextPaymentStatus,
                    updatedAt: new Date().toISOString(),
                }
            }),
        }))
    },

    removeOrder: id => set(state => ({ orders: state.orders.filter(o => o.id !== id) })),

    getById: id => get().orders.find(o => o.id === id),

    clear: () => set({ orders: [] }),
}))
