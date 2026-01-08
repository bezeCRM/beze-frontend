import { useCallback, useMemo } from 'react'
import type { OrderPaymentStatus } from './useOrderCreateForm'
import { formatMoneyRu, parseMoneyRu } from '../utils/money'

type Params = {
    totalPrice: number
    paymentStatus: OrderPaymentStatus
    paidAmountText: string
    setPaymentStatus: (v: OrderPaymentStatus) => void
    setValue: (name: any, value: any, options?: any) => void
}

export function useOrderPayment({
    totalPrice,
    paymentStatus,
    paidAmountText,
    setPaymentStatus,
    setValue,
}: Params) {
    const paidNum = useMemo(() => parseMoneyRu(paidAmountText), [paidAmountText])

    const paidClamped = useMemo(() => {
        const t = Math.max(0, totalPrice || 0)
        const p = Math.max(0, Math.round(paidNum))
        return Math.min(p, t)
    }, [paidNum, totalPrice])

    const remaining = useMemo(() => {
        const t = Math.max(0, totalPrice || 0)
        return Math.max(0, t - paidClamped)
    }, [paidClamped, totalPrice])

    const onSelectPaymentStatus = useCallback(
        (next: OrderPaymentStatus) => {
            const total = Math.max(0, totalPrice || 0)

            if (next === 'unpaid') {
                setPaymentStatus('unpaid')
                setValue('paidAmount', '0', { shouldValidate: true })
                return
            }

            if (next === 'paid') {
                setPaymentStatus('paid')
                setValue('paidAmount', formatMoneyRu(total), { shouldValidate: true })
                return
            }

            setPaymentStatus('partial')
            const half = total > 0 ? Math.round(total * 0.5) : 0
            setValue('paidAmount', formatMoneyRu(half), { shouldValidate: true })
        },
        [setPaymentStatus, setValue, totalPrice],
    )

    const onPaidAmountBlur = useCallback(() => {
        const total = Math.max(0, totalPrice || 0)
        const clamped = Math.min(Math.max(0, Math.round(paidNum)), total)

        setValue('paidAmount', formatMoneyRu(clamped), { shouldValidate: true })

        if (paymentStatus === 'partial' && clamped <= 0) {
            setPaymentStatus('unpaid')
            return
        }

        if (paymentStatus === 'partial' && total > 0 && clamped >= total) {
            setPaymentStatus('paid')
        }
    }, [paidNum, paymentStatus, setPaymentStatus, setValue, totalPrice])

    return {
        paidNum,
        paidClamped,
        remaining,
        onSelectPaymentStatus,
        onPaidAmountBlur,
    }
}
