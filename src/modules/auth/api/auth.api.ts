import { http } from '@/api'
import type { TokensDto } from '@/api'

export async function login(payload: {
    credential: string
    password: string
}): Promise<TokensDto> {
    const { data } = await http.post<TokensDto>('/auth/login', payload)
    return data
}

export async function register(payload: {
    login: string
    email: string
    password: string
}): Promise<TokensDto> {
    const { data } = await http.post<TokensDto>('/auth/register', payload)
    return data
}

export async function logout(payload: { refresh_token: string }): Promise<void> {
    await http.post('/auth/logout', payload)
}

export async function forgotPassword(payload: { email: string }): Promise<void> {
    await http.post('/auth/forgot-password', payload)
}

export async function resetPassword(payload: {
    token: string
    password: string
}): Promise<void> {
    await http.post('/auth/reset-password', payload)
}
