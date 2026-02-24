import { http } from '@/api'
import type { TokensDto } from '@/api'

export async function login(payload: {
    login: string
    password: string
}): Promise<TokensDto> {
    const { data } = await http.post<TokensDto>('/auth/login', payload)
    return data
}

export async function register(payload: {
    login: string
    password: string
}): Promise<TokensDto> {
    const { data } = await http.post<TokensDto>('/auth/register', payload)
    return data
}

export async function logout(payload: { refresh_token: string }): Promise<void> {
    await http.post('/auth/logout', payload)
}
