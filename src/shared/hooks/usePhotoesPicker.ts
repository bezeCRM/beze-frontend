import { useCallback, useMemo, useState } from 'react'
import { pickImagesFromLibrary } from '@/shared/components/media'
import type { PhotoItem } from '@/shared/types/types'

type Options = {
    maxCount?: number
    copyToAppStorage?: boolean
    quality?: number
}

function mergeUniqueByUri(current: PhotoItem[], next: PhotoItem[], maxCount: number) {
    const seen = new Set(current.map(p => p.uri))
    const merged = [...current]

    for (const p of next) {
        if (merged.length >= maxCount) break
        if (seen.has(p.uri)) continue
        seen.add(p.uri)
        merged.push(p)
    }

    return merged
}

export function usePhotoesPicker(options: Options = {}) {
    const maxCount = options.maxCount ?? 3
    const copyToAppStorage = options.copyToAppStorage ?? true
    const quality = options.quality ?? 0.9

    const [photoes, setPhotoes] = useState<PhotoItem[]>([])

    const remaining = maxCount - photoes.length
    const canAdd = remaining > 0

    const addFromLibrary = useCallback(async () => {
        if (remaining <= 0) return

        const picked = await pickImagesFromLibrary({
            limit: remaining,
            copyToAppStorage,
            quality,
        })

        if (!picked.length) return

        setPhotoes(prev => mergeUniqueByUri(prev, picked, maxCount))
    }, [remaining, copyToAppStorage, quality, maxCount])

    const removeById = useCallback((id: string) => {
        setPhotoes(prev => prev.filter(p => p.id !== id))
    }, [])

    const setFromUris = useCallback(
        (uris: string[]) => {
            const next = (uris ?? []).slice(0, maxCount).map(uri => ({ id: uri, uri }))
            setPhotoes(next)
        },
        [maxCount],
    )

    const reset = useCallback(() => setPhotoes([]), [])

    const uris = useMemo(() => photoes.map(p => p.uri), [photoes])

    const pickerProps = useMemo(() => {
        return {
            photoes,
            maxCount,
            onAddPress: addFromLibrary,
            onDeletePress: removeById,
        }
    }, [photoes, maxCount, addFromLibrary, removeById])

    return {
        photoes,
        uris,
        canAdd,
        remaining,
        addFromLibrary,
        removeById,
        setFromUris,
        reset,
        pickerProps,
    }
}
