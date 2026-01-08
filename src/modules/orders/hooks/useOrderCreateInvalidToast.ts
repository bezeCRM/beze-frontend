import { useCallback } from 'react'
import type { FieldErrors } from 'react-hook-form'
import type { OrderCreateFormValues } from './useOrderCreateForm'

type ToastVariant = 'error' | 'info' | 'success'
type ToastShow = (
    message: string,
    variant?: ToastVariant,
    options?: { scope?: string },
) => void

const LABELS = {
    clientName: 'Имя клиента',
    deliveryDate: 'Дата доставки',
    deliveryTime: 'Время доставки',
    deliveryAddress: 'Адрес доставки',
} as const

function getMessage(errors: FieldErrors<OrderCreateFormValues>) {
    const missing: string[] = []
    const invalid: string[] = []

    if (errors.clientName) missing.push(LABELS.clientName)

    const d: any = (errors as any)?.delivery
    const dateMsg = d?.date?.message as string | undefined
    const timeMsg = d?.time?.message as string | undefined
    const addrMsg = d?.address?.message as string | undefined

    if (d?.date) {
        if (dateMsg === 'обязательное поле') missing.push(LABELS.deliveryDate)
        else invalid.push(LABELS.deliveryDate)
    }

    if (d?.time) {
        if (timeMsg === 'обязательное поле') missing.push(LABELS.deliveryTime)
        else invalid.push(LABELS.deliveryTime)
    }

    if (d?.address) {
        if (addrMsg === 'обязательное поле') missing.push(LABELS.deliveryAddress)
        else invalid.push(LABELS.deliveryAddress)
    }

    if (missing.length && invalid.length) {
        return `Не заполнены следующие поля: ${missing.join(', ')}. Проверьте: ${invalid.join(
            ', ',
        )}`
    }

    if (missing.length) {
        return `Не заполнены следующие поля: ${missing.join(', ')}`
    }

    if (invalid.length) {
        return `Проверьте корректность полей: ${invalid.join(', ')}`
    }

    return 'Проверьте введённые данные'
}

export function useOrderCreateInvalidToast(show: ToastShow, scope: string) {
    return useCallback(
        (errors: FieldErrors<OrderCreateFormValues>) => {
            show(getMessage(errors), 'error', { scope })
        },
        [show, scope],
    )
}
