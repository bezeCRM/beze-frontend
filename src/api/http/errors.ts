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
    const m = String(msg ?? '')

    if (m.includes('at least 8 characters')) {
        return 'Пароль должен содержать минимум 8 символов'
    }

    if (m.includes('at least 3 characters')) {
        return 'Логин должен содержать минимум 3 символа'
    }

    if (m.includes('Field required')) {
        return 'Поле обязательно для заполнения'
    }

    if (m.includes('login already exists')) {
        return 'Логин занят'
    }

    return m
}

function translateHttpMessage(status: number, msg: string | null): string | null {
    if (status === 409) {
        if (msg === 'product is used in orders') {
            return 'Нельзя удалить товар: он используется в заказах'
        }
        if (msg === 'product already exists') {
            return 'Товар с таким названием уже существует'
        }
        return 'Конфликт данных. Обновите список и попробуйте снова'
    }

    if (status === 422) {
        // если пришла "Input should be ..." или другие системные штуки, можно дать общий текст
        if (msg && /input/i.test(msg)) {
            return 'Некорректные данные в одном из полей'
        }
        return null
    }

    return null
}

function pickFastApiMessage(data: unknown): string | null {
    if (typeof data === 'string' && data.trim().length > 0) {
        return translateValidationMessage(data)
    }

    if (!isObject(data)) return null

    const detail = data['detail']

    // detail: "some text"
    if (typeof detail === 'string' && detail.trim().length > 0) {
        return translateValidationMessage(detail)
    }

    // detail: [{ msg: "..." }, ...]
    if (Array.isArray(detail)) {
        const first = detail[0]
        if (isObject(first)) {
            const msg = first['msg']
            if (typeof msg === 'string' && msg.trim().length > 0) {
                return translateValidationMessage(msg)
            }
        }
        return 'Ошибка валидации'
    }

    // detail: { msg/message/error: "..." }
    if (isObject(detail)) {
        const msg = detail['msg']
        const message = detail['message']
        const error = detail['error']

        const text =
            (typeof msg === 'string' && msg) ||
            (typeof message === 'string' && message) ||
            (typeof error === 'string' && error) ||
            null

        if (text && text.trim().length > 0) {
            return translateValidationMessage(text)
        }
    }

    // fallback: { message: "..." }
    if (typeof data['message'] === 'string' && (data['message'] as string).trim()) {
        return translateValidationMessage(data['message'] as string)
    }

    return null
}

function isTimeoutError(e: AxiosError<unknown>): boolean {
    const code = typeof e.code === 'string' ? e.code : ''
    const msg = typeof e.message === 'string' ? e.message.toLowerCase() : ''
    return code === 'ECONNABORTED' || code === 'ETIMEDOUT' || msg.includes('timeout')
}

export function toApiError(err: unknown): ApiError {
    if (!isAxiosError(err)) {
        if (err instanceof Error) {
            return { kind: 'unknown', status: null, message: err.message, details: err }
        }
        return {
            kind: 'unknown',
            status: null,
            message: 'Неизвестная ошибка',
            details: err,
        }
    }

    const e = err as AxiosError<unknown>
    const status = typeof e.response?.status === 'number' ? e.response.status : null
    const data = e.response?.data

    // 1) таймауты (axios иногда не ставит ECONNABORTED, поэтому проверяем message тоже)
    if (isTimeoutError(e)) {
        return {
            kind: 'timeout',
            status,
            message: 'Не удалось подключиться к серверу',
            details: err,
        }
    }

    // 2) нет ответа от сервера вообще: нет интернета, сервер упал, dns, ssl, etc.
    if (!e.response) {
        return {
            kind: 'network',
            status: null,
            message: 'Не удалось подключиться к серверу',
            details: err,
        }
    }

    // 3) есть response -> это http-ошибка
    const fastApiMsg = pickFastApiMessage(data)

    // 3.1) auth
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
            message: fastApiMsg ?? 'Требуется авторизация',
            details: data,
        }
    }

    // 3.2) 422 отдельно, чтобы не получать "http error 422"
    if (status === 422) {
        const translated = translateHttpMessage(status, fastApiMsg)
        return {
            kind: 'http',
            status,
            message: translated ?? fastApiMsg ?? 'Ошибка валидации',
            details: data,
        }
    }

    // 3.3) специфичные http ошибки (например 409)
    if (status != null) {
        const translated = translateHttpMessage(status, fastApiMsg)
        if (translated) {
            return {
                kind: 'http',
                status,
                message: translated,
                details: data,
            }
        }
    }

    // 4) серверные ошибки
    if (status != null && status >= 500) {
        return {
            kind: 'http',
            status,
            message: 'Ошибка сервера, попробуйте позже',
            details: data,
        }
    }

    // 5) остальное
    return {
        kind: 'http',
        status,
        message: fastApiMsg ?? `http error${status ? ` ${status}` : ''}`,
        details: data,
    }
}

export function isUnauthorized(err: unknown): boolean {
    const e = toApiError(err)
    return e.kind === 'http' && e.status === 401
}

export function isValidationError(err: unknown): boolean {
    const e = toApiError(err)
    return e.kind === 'http' && e.status === 422
}

export function isTokenRevokedOrExpired(err: unknown): boolean {
    if (!isAxiosError(err)) return false
    const msg = pickFastApiMessage(err.response?.data)
    return msg === 'token revoked or expired'
}
