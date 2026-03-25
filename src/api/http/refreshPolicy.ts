import { isAxiosError } from 'axios'
import { toApiError, isTokenRevokedOrExpired } from './errors'

export function shouldLogoutOnRefreshError(err: unknown): boolean {
    const apiErr = toApiError(err)

    if (apiErr.kind === 'network' || apiErr.kind === 'timeout') {
        return false
    }

    if (apiErr.kind === 'http' && apiErr.status === 401) {
        return true
    }

    if (apiErr.kind === 'http' && apiErr.status === 403) {
        return true
    }

    if (isAxiosError(err) && isTokenRevokedOrExpired(err)) {
        return true
    }

    return false
}
