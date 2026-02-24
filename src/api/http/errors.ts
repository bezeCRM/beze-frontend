import { AxiosError, isAxiosError } from 'axios'

export type ApiErrorKind = 'network' | 'timeout' | 'http' | 'unknown'

export type ApiError = {
    kind: ApiErrorKind
    status: number | null
    message: string
    details?: unknown
}

function isObject(v: unknown): v is Record<string, unknown> {
    return typeof v === 'object' && v !== null
}

function translateValidationMessage(msg: string): string {
    if (msg.includes('at least 8 characters')) {
        return 'Пароль должен содержать минимум 8 символов'
    }

    if (msg.includes('at least 3 characters')) {
        return 'Логин должен содержать минимум 3 символа'
    }

    if (msg.includes('Field required')) {
        return 'Поле обязательно для заполнения'
    }

    if (msg.includes('login already exists')) {
        return 'Логин занят'
    }

    if (msg.includes('network error')) {
        return 'Ошибка сети'
    }

    return msg
}

function pickFastApiMessage(data: unknown): string | null {
    if (typeof data === 'string' && data.trim().length > 0) {
        return translateValidationMessage(data)
    }

    if (!isObject(data)) return null

    const detail = data['detail']

    if (typeof detail === 'string') {
        return translateValidationMessage(detail)
    }

    if (Array.isArray(detail)) {
        const first = detail[0]
        if (isObject(first) && typeof first['msg'] === 'string') {
            return translateValidationMessage(first['msg'])
        }
        return 'Ошибка валидации'
    }

    if (typeof data['message'] === 'string') {
        return translateValidationMessage(data['message'] as string)
    }

    return null
}

export function toApiError(err: unknown): ApiError {
    if (!isAxiosError(err)) {
        if (err instanceof Error) {
            return { kind: 'unknown', status: null, message: err.message, details: err }
        }
        return { kind: 'unknown', status: null, message: 'unknown error', details: err }
    }

    const e = err as AxiosError<unknown>

    const code = typeof e.code === 'string' ? e.code : null
    const status = typeof e.response?.status === 'number' ? e.response.status : null
    const data = e.response?.data

    if (code === 'ECONNABORTED') {
        return { kind: 'timeout', status, message: 'request timeout', details: err }
    }

    if (!e.response) {
        return { kind: 'network', status: null, message: 'network error', details: err }
    }

    const fastApiMsg = pickFastApiMessage(data)

    if (status === 401) {
        if (fastApiMsg === 'invalid credentials') {
            return {
                kind: 'http',
                status,
                message: 'Неверный логин или пароль',
                details: data,
            }
        }
        return {
            kind: 'http',
            status,
            message: fastApiMsg ?? 'unauthorized',
            details: data,
        }
    }

    return {
        kind: 'http',
        status,
        message: fastApiMsg ?? `http error${status ? ` ${status}` : ''}`,
        details: data,
    }
}

export function isUnauthorized(err: unknown): boolean {
    return (
        isAxiosError(err) &&
        typeof err.response?.status === 'number' &&
        err.response.status === 401
    )
}

export function isValidationError(err: unknown): boolean {
    return (
        isAxiosError(err) &&
        typeof err.response?.status === 'number' &&
        err.response.status === 422
    )
}

export function isTokenRevokedOrExpired(err: unknown): boolean {
    if (!isAxiosError(err)) return false
    const msg = pickFastApiMessage(err.response?.data)
    return msg === 'token revoked or expired'
}
