import { http } from '@/api'

export type ProfileSettingsUpsertRequest = {
    profileName?: string
    nickname?: string
    photoUri?: string
}

type ProfileSettingsApiDto = {
    ownerId: string
    profileName: string
    nickname?: string | null
    photoUri?: string | null
    updatedAt: string
}

export type ProfileSettings = {
    ownerId: string
    profileName: string
    nickname?: string
    photoUri?: string
    updatedAt: string
}

function mapProfileSettingsFromApi(dto: ProfileSettingsApiDto): ProfileSettings {
    return {
        ownerId: dto.ownerId,
        profileName: dto.profileName,
        nickname: dto.nickname ?? undefined,
        photoUri: dto.photoUri ?? undefined,
        updatedAt: dto.updatedAt,
    }
}

export async function getProfileSettings(): Promise<ProfileSettings> {
    const { data } = await http.get<ProfileSettingsApiDto>('/profile/settings')
    return mapProfileSettingsFromApi(data)
}

export async function updateProfileSettings(
    payload: ProfileSettingsUpsertRequest,
): Promise<ProfileSettings> {
    const { data } = await http.patch<ProfileSettingsApiDto>('/profile/settings', payload)
    return mapProfileSettingsFromApi(data)
}
