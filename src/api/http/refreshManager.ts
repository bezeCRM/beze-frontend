import axios, { AxiosError } from 'axios'
import { ENV } from '../config/env'
import { clearTokens, getRefreshToken, saveTokens } from '../storage/tokenStorage'
import { toApiError } from './errors'

export type TokensDto = {
    access_token: string
    refresh_token: string
    token_type: 'bearer'
}

let refreshPromise: Promise<TokensDto> | null = null

async function runRefresh(): Promise<TokensDto> {
    const refreshToken = await getRefreshToken()
    if (!refreshToken) {
        throw new AxiosError('unauthorized', undefined, undefined, undefined, {
            status: 401,
            statusText: 'Unauthorized',
            headers: {},
            config: {},
            data: { detail: 'unauthorized' },
        } as any)
    }

    const resp = await axios.post<TokensDto>(
        `${ENV.apiBaseUrl}/auth/refresh`,
        { refresh_token: refreshToken },
        {
            timeout: ENV.requestTimeoutMs,
            headers: { 'Content-Type': 'application/json' },
        },
    )

    await saveTokens({
        accessToken: resp.data.access_token,
        refreshToken: resp.data.refresh_token,
    })
    return resp.data
}

export async function refreshTokensOnce(): Promise<TokensDto> {
    if (!refreshPromise) {
        refreshPromise = runRefresh().finally(() => {
            refreshPromise = null
        })
    }
    return await refreshPromise
}

export async function forceLogoutLocal(): Promise<void> {
    await clearTokens()
}

export function normalizeRefreshError(err: unknown): Error {
    const apiErr = toApiError(err)
    return new Error(apiErr.message)
}
