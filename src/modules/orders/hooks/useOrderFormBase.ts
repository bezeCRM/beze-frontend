import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Filling, PhotoItem, Product } from '@/shared/types/types'
import { sanitizeRubInt } from '@/shared/utils/utils'

export type OrderCreateItem = {
    id: string
    product: Product
    filling?: Filling
    count: number
    weightKg: string
    decorPrice: string
}

export type OrderExtraValues = {
    delivery: string
    urgency: string
    other: string
    discount: string
}

export type OrderDeliveryValues = {
    isPickup: boolean
    address: string
    date: string
    time: string
}

export type OrderPaymentStatus = 'unpaid' | 'paid' | 'partial'
export type OrderStatus = 'new' | 'inWork' | 'ready' | 'delivered' | 'canceled'

function makeId() {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function isValidIsoDateString(value: string) {
    const v = (value ?? '').trim()
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false

    const [yStr, mStr, dStr] = v.split('-')
    const y = Number(yStr)
    const m = Number(mStr)
    const d = Number(dStr)

    if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return false
    if (m < 1 || m > 12) return false
    if (d < 1) return false

    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    const isLeap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0
    const maxDay = m === 2 && isLeap ? 29 : daysInMonth[m - 1]
    return d <= maxDay
}

function isValidTimeString(value: string) {
    const v = (value ?? '').trim()
    if (!/^\d{2}:\d{2}$/.test(v)) return false

    const hh = Number(v.slice(0, 2))
    const mm = Number(v.slice(3, 5))

    if (!Number.isFinite(hh) || !Number.isFinite(mm)) return false
    if (hh < 0 || hh > 23) return false
    if (mm < 0 || mm > 59) return false
    return true
}

export const OrderFormSchema = z
    .object({
        name: z.string().optional(),
        clientName: z.string().trim().min(1, 'обязательное поле'),
        clientPhone: z.string().optional(),
        orderPlatform: z.string().optional(),

        delivery: z.object({
            isPickup: z.boolean(),
            address: z.string(),
            date: z.string(),
            time: z.string(),
        }),

        items: z.array(z.any()).optional(),

        extra: z.object({
            delivery: z.string(),
            urgency: z.string(),
            other: z.string(),
            discount: z.string(),
        }),

        notes: z.string().optional(),

        references: z
            .array(z.object({ id: z.string(), uri: z.string() }))
            .max(3, 'максимум 3 фото')
            .optional(),

        paymentStatus: z.enum(['unpaid', 'paid', 'partial'] as const),
        paidAmount: z.string().optional(),
        status: z.enum(['new', 'inWork', 'ready', 'delivered', 'canceled'] as const),
        inPlanner: z.boolean(),
    })
    .superRefine((data, ctx) => {
        const date = data.delivery.date?.trim() ?? ''
        if (!date || date.length < 8) {
            ctx.addIssue({
                code: 'custom',
                path: ['delivery', 'date'],
                message: 'обязательное поле',
            })
        } else if (!isValidIsoDateString(date)) {
            ctx.addIssue({
                code: 'custom',
                path: ['delivery', 'date'],
                message: 'некорректная дата',
            })
        }

        const time = data.delivery.time?.trim() ?? ''
        if (!time || time.length < 5) {
            ctx.addIssue({
                code: 'custom',
                path: ['delivery', 'time'],
                message: 'обязательное поле',
            })
        } else if (!isValidTimeString(time)) {
            ctx.addIssue({
                code: 'custom',
                path: ['delivery', 'time'],
                message: 'некорректное время',
            })
        }

        if (!data.delivery.isPickup) {
            if (!data.delivery.address.trim()) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['delivery', 'address'],
                    message: 'обязательное поле',
                })
            }
        }

        if (data.paymentStatus === 'partial') {
            const t = (data.paidAmount ?? '').trim()
            if (!t.length) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['paidAmount'],
                    message: 'обязательное поле',
                })
            }
        }
    })

export type OrderCreateFormValues = z.input<typeof OrderFormSchema>

export function makeOrderDefaultValues(): OrderCreateFormValues {
    return {
        name: '',
        clientName: '',
        clientPhone: '',
        orderPlatform: '',
        delivery: {
            isPickup: true,
            address: '',
            date: '',
            time: '',
        },
        items: [] as OrderCreateItem[],
        extra: {
            delivery: '0',
            urgency: '0',
            other: '0',
            discount: '0',
        },
        notes: '',
        references: [] as PhotoItem[],
        paymentStatus: 'unpaid',
        paidAmount: '0',
        status: 'new',
        inPlanner: true,
    }
}

export function useOrderFormBase() {
    const defaultValues = useMemo(() => makeOrderDefaultValues(), [])

    const form = useForm<OrderCreateFormValues>({
        defaultValues,
        resolver: zodResolver(OrderFormSchema),
        mode: 'onSubmit',
    })

    function setPickup(value: boolean) {
        form.setValue('delivery.isPickup', value, {
            shouldValidate: true,
            shouldDirty: true,
        })
        if (value) {
            form.setValue('delivery.address', '', {
                shouldValidate: true,
                shouldDirty: true,
            })
        }
    }

    function setPaymentStatus(value: OrderPaymentStatus) {
        form.setValue('paymentStatus', value, { shouldValidate: true, shouldDirty: true })
    }

    function setStatus(value: OrderStatus) {
        form.setValue('status', value, { shouldValidate: true, shouldDirty: true })
    }

    function togglePlanner(value: boolean) {
        form.setValue('inPlanner', value, { shouldValidate: true, shouldDirty: true })
    }

    function addItem(product: Product, filling?: Filling) {
        const list = (form.getValues('items') as OrderCreateItem[]) ?? []
        const fillingId = filling?.id ?? null

        if (product.unit === 'piece') {
            const idx = list.findIndex(i => {
                const iFillingId = i.filling?.id ?? null
                return i.product.id === product.id && iFillingId === fillingId
            })

            if (idx !== -1) {
                const next = list.map((it, i) =>
                    i === idx ? { ...it, count: it.count + 1 } : it,
                )
                form.setValue('items', next, { shouldDirty: true })
                return
            }
        }

        const item: OrderCreateItem = {
            id: makeId(),
            product,
            filling,
            count: 1,
            weightKg: product.unit === 'kg' ? '1' : '',
            decorPrice: '0',
        }

        form.setValue('items', [...list, item], { shouldDirty: true })
    }

    function removeItem(itemId: string) {
        const list = (form.getValues('items') as OrderCreateItem[]) ?? []
        form.setValue(
            'items',
            list.filter(i => i.id !== itemId),
            { shouldDirty: true },
        )
    }

    function incCount(itemId: string) {
        const list = (form.getValues('items') as OrderCreateItem[]) ?? []
        form.setValue(
            'items',
            list.map(i => (i.id === itemId ? { ...i, count: i.count + 1 } : i)),
            { shouldDirty: true },
        )
    }

    function decCount(itemId: string) {
        const list = (form.getValues('items') as OrderCreateItem[]) ?? []
        form.setValue(
            'items',
            list.map(i =>
                i.id === itemId ? { ...i, count: Math.max(1, i.count - 1) } : i,
            ),
            { shouldDirty: true },
        )
    }

    function setWeightKg(itemId: string, value: string) {
        const list = (form.getValues('items') as OrderCreateItem[]) ?? []
        form.setValue(
            'items',
            list.map(i => (i.id === itemId ? { ...i, weightKg: value } : i)),
            { shouldDirty: true },
        )
    }

    function setDecorPrice(itemId: string, value: string) {
        const list = (form.getValues('items') as OrderCreateItem[]) ?? []
        form.setValue(
            'items',
            list.map(i =>
                i.id === itemId ? { ...i, decorPrice: sanitizeRubInt(value) } : i,
            ),
            { shouldDirty: true },
        )
    }

    function addReferences(items: PhotoItem[]) {
        const list: PhotoItem[] = form.getValues('references') ?? []
        if (list.length >= 3) return

        const remaining = 3 - list.length
        const seen = new Set(list.map(p => p.uri))
        const toAdd: PhotoItem[] = []

        for (const p of items) {
            if (toAdd.length >= remaining) break
            if (!p?.uri) continue
            if (seen.has(p.uri)) continue
            seen.add(p.uri)
            toAdd.push({ id: p.id || makeId(), uri: p.uri })
        }

        if (!toAdd.length) return
        form.setValue('references', [...list, ...toAdd], {
            shouldValidate: true,
            shouldDirty: true,
        })
    }

    function removeReference(id: string) {
        const list: PhotoItem[] = form.getValues('references') ?? []
        form.setValue(
            'references',
            list.filter(p => p.id !== id),
            { shouldValidate: true, shouldDirty: true },
        )
    }

    return {
        ...form,
        defaultValues,
        setPickup,
        setPaymentStatus,
        setStatus,
        togglePlanner,
        addItem,
        removeItem,
        incCount,
        decCount,
        setWeightKg,
        setDecorPrice,
        addReferences,
        removeReference,
    }
}
