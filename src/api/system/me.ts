import { http } from '../http/client'

export type MeDto = {
    id: string
    email: string
    created_at: string
}

export async function getMe(): Promise<MeDto> {
    const { data } = await http.get<MeDto>('/users/me')
    return data
}
