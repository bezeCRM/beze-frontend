import { useCallback } from 'react'
import { pickImagesFromLibrary } from '@/shared/components/media'
import type { PhotoItem } from '@/shared/types/types'

type Params = {
    maxCount: number
    references: PhotoItem[]
    addReferences: (items: PhotoItem[]) => void
}

export function useOrderReferences({ maxCount, references, addReferences }: Params) {
    const handleAddReferences = useCallback(async () => {
        const remaining = maxCount - references.length
        if (remaining <= 0) return

        const picked = await pickImagesFromLibrary({ limit: remaining })
        if (!picked.length) return

        addReferences(picked)
    }, [addReferences, maxCount, references.length])

    return { handleAddReferences }
}
