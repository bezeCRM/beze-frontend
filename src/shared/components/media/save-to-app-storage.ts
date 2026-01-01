import * as FileSystem from 'expo-file-system/legacy'

function getExt(uri: string, fallback = 'jpg') {
    const clean = uri.split('?')[0]
    const idx = clean.lastIndexOf('.')
    if (idx === -1) return fallback
    const ext = clean.slice(idx + 1).toLowerCase()
    return ext || fallback
}

function makeId() {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export async function saveImageToAppStorage(inputUri: string): Promise<string> {
    const baseDir = FileSystem.documentDirectory ?? FileSystem.cacheDirectory
    if (!baseDir) return inputUri

    const dir = `${baseDir}media/`
    try {
        await FileSystem.makeDirectoryAsync(dir, { intermediates: true })
    } catch {
        // папка может уже существовать, это ок
    }

    const ext = getExt(inputUri)
    const filename = `${makeId()}.${ext}`
    const target = `${dir}${filename}`

    try {
        await FileSystem.copyAsync({ from: inputUri, to: target })
        return target
    } catch {
        return inputUri
    }
}
