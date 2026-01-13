import { useMemo } from 'react'
import { useGlobalImageViewer } from '@/core/providers/image-viewer.provider'

type ImageLike = { uri: string } | string | null | undefined

export function useImageViewer(input: ImageLike[], max = 3) {
    const uris = useMemo(
        () =>
            (input ?? [])
                .map(i => (typeof i === 'string' ? i : i?.uri))
                .filter((u): u is string => Boolean(u))
                .slice(0, max),
        [input, max],
    )

    const { open } = useGlobalImageViewer()

    function openAt(index: number) {
        open({ uris, index, max })
    }

    return { uris, openAt }
}
