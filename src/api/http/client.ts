import axios, { AxiosInstance, InternalAxiosRequestConfig, isAxiosError } from 'axios'
import { ENV } from '../config/env'
import { getAccessToken } from '../storage/tokenStorage'
import { attachAuthInterceptor } from './authInterceptor'
import { forceLogoutLocal, refreshTokensOnce } from './refreshManager'
import { toApiError } from './errors'
import { shouldLogoutOnRefreshError } from './refreshPolicy'

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

    console.log('apiBaseUrl:', ENV.apiBaseUrl)

    client.interceptors.response.use(
        response => response,
        async (err: unknown) => {
            if (!isAxiosError(err)) {
                throw toApiError(err)
            }

            const original = err.config as RetriableConfig | undefined
            const status = err.response?.status
            const url = original?.url

            if (!original) {
                throw toApiError(err)
            }

            if (status !== 401) {
                throw toApiError(err)
            }

            if (shouldSkipRefresh(url)) {
                throw toApiError(err)
            }

            if (original._retry) {
                throw toApiError(err)
            }
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
                if (shouldLogoutOnRefreshError(refreshErr)) {
                    await forceLogoutLocal()
                }

                throw toApiError(refreshErr)
            }
        },
    )

    return client
}

export const http = createHttpClient()
