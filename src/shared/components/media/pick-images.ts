import { Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { saveImageToAppStorage } from './save-to-app-storage'
import type { PhotoItem } from '@/shared/types/types'

type PickImagesArgs = {
    limit: number
    copyToAppStorage?: boolean
    quality?: number
}

function makeId() {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export async function pickImagesFromLibrary(args: PickImagesArgs): Promise<PhotoItem[]> {
    const { limit, copyToAppStorage = true, quality = 0.9 } = args
    if (limit <= 0) return []

    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!perm.granted) {
        Alert.alert(
            'Доступ к фото',
            'Разреши доступ к медиатеке в настройках, чтобы выбрать фото.',
        )
        return []
    }

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        selectionLimit: limit,
        quality,
    })

    if (result.canceled) return []

    const assets = result.assets ?? []
    const trimmed = assets.slice(0, limit)

    const uris = copyToAppStorage
        ? await Promise.all(trimmed.map(a => saveImageToAppStorage(a.uri)))
        : trimmed.map(a => a.uri)

    return uris.map(uri => ({ id: makeId(), uri }))
}
