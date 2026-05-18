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

type ProfilePhotoUploadApiDto = {
    photoUri: string
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

function getFileNameFromUri(uri: string): string {
    const fallback = `profile-photo-${Date.now()}.jpg`
    const name = uri.split('/').pop()
    return name || fallback
}

function getMimeTypeFromFileName(fileName: string): string {
    const lower = fileName.toLowerCase()

    if (lower.endsWith('.png')) return 'image/png'
    if (lower.endsWith('.webp')) return 'image/webp'
    if (lower.endsWith('.heic')) return 'image/heic'
    if (lower.endsWith('.heif')) return 'image/heif'

    return 'image/jpeg'
}

export async function uploadProfilePhoto(localUri: string): Promise<string> {
    const fileName = getFileNameFromUri(localUri)

    const formData = new FormData()
    formData.append('file', {
        uri: localUri,
        name: fileName,
        type: getMimeTypeFromFileName(fileName),
    } as any)

    const { data } = await http.post<ProfilePhotoUploadApiDto>(
        '/profile/settings/photo',
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        },
    )

    return data.photoUri
}
