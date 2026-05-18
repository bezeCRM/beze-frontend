import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { getAccessToken } from '../storage/tokenStorage'

export function attachAuthInterceptor(client: AxiosInstance): void {
    client.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
        const isFormData = config.data instanceof FormData

        if (!isFormData) {
            config.headers['Content-Type'] = 'application/json'
        }

        const token = await getAccessToken()
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        config.headers.Accept = 'application/json'

        return config
    })
}
