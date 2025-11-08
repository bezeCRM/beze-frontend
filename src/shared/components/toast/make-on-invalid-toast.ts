import type { FieldErrors, FieldValues, SubmitErrorHandler } from 'react-hook-form'

type Options<T extends FieldValues, TReq extends readonly (keyof T)[]> = {
    required: TReq
    labels: Record<TReq[number], string>
    show: (message: string) => void
    prefix?: string
    extra?: (errors: FieldErrors<T>) => string[] // добавлено
}

export function makeOnInvalidToast<
    T extends FieldValues,
    TReq extends readonly (keyof T)[],
>(opts: Options<T, TReq>): SubmitErrorHandler<T> {
    const { required, labels, show, prefix = 'Заполните следующие поля: ', extra } = opts

    return (errors: FieldErrors<T>) => {
        const missing = required.filter(k => !!errors[k]).map(k => labels[k])
        const extraItems = extra ? extra(errors) : []
        const all = [...missing, ...extraItems]
        if (all.length === 0) return
        show(`${prefix}${all.join(', ')}`)
    }
}
