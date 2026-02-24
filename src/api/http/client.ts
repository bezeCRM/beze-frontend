import axios, { AxiosInstance, InternalAxiosRequestConfig, isAxiosError } from 'axios'
import { ENV } from '../config/env'
import { getAccessToken } from '../storage/tokenStorage'
import { attachAuthInterceptor } from './authInterceptor'
import { forceLogoutLocal, refreshTokensOnce } from './refreshManager'

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean }

const SKIP_REFRESH_PATHS = [
    '/auth/login',
    '/auth/register',
    '/auth/refresh',
    '/auth/logout',
]

function shouldSkipRefresh(url?: string): boolean {
    if (!url) return false
    return SKIP_REFRESH_PATHS.some(p => url.includes(p))
}

export function createHttpClient(): AxiosInstance {
    const client = axios.create({
        baseURL: ENV.apiBaseUrl,
        timeout: ENV.requestTimeoutMs,
    })

    attachAuthInterceptor(client)

    client.interceptors.response.use(
        r => r,
        async (err: unknown) => {
            if (!isAxiosError(err)) throw err

            const original = err.config as RetriableConfig | undefined
            const status = err.response?.status
            const url = original?.url

            if (!original) throw err

            // 1) если это не 401, ничего не делаем
            if (status !== 401) throw err

            // 2) не делаем refresh для auth запросов (логин, регистрация и т.д.)
            if (shouldSkipRefresh(url)) throw err

            // 3) защищаемся от бесконечного цикла
            if (original._retry) throw err
            original._retry = true

            try {
                await refreshTokensOnce()
                const access = await getAccessToken()
                if (access) {
                    original.headers = original.headers ?? {}
                    original.headers.Authorization = `Bearer ${access}`
                }
                return await client.request(original)
            } catch (refreshErr) {
                await forceLogoutLocal()
                throw refreshErr
            }
        },
    )

    return client
}

export const http = createHttpClient()
