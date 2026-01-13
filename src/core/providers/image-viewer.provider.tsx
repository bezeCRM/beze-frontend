import React, {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useRef,
    useState,
} from 'react'
import ImageView from 'react-native-image-viewing'

type ImageSource = { uri: string }

type OpenPayload = {
    uris: string[]
    index?: number
    max?: number
}

type Ctx = {
    open: (p: OpenPayload) => void
    close: () => void
}

const ImageViewerContext = createContext<Ctx | null>(null)

export function ImageViewerProvider({ children }: { children: React.ReactNode }) {
    const [visible, setVisible] = useState(false)
    const [images, setImages] = useState<ImageSource[]>([])
    const [openIndex, setOpenIndex] = useState(0)
    const currentIndexRef = useRef(0)

    const close = useCallback(() => {
        setVisible(false)
    }, [])

    const open = useCallback(({ uris, index = 0, max = 3 }: OpenPayload) => {
        const normalized = (uris ?? []).filter(Boolean).slice(0, max)
        if (normalized.length === 0) return

        const nextImages = normalized.map(uri => ({ uri }))
        const last = nextImages.length - 1
        const nextIndex = Math.max(0, Math.min(index, last))

        currentIndexRef.current = nextIndex
        setImages(nextImages)
        setOpenIndex(nextIndex)
        setVisible(true)
    }, [])

    const ctx = useMemo(() => ({ open, close }), [open, close])

    return (
        <ImageViewerContext.Provider value={ctx}>
            {children}

            <ImageView
                images={images}
                imageIndex={openIndex}
                visible={visible}
                onRequestClose={close}
                onImageIndexChange={i => {
                    currentIndexRef.current = i
                }}
                swipeToCloseEnabled
                presentationStyle="overFullScreen"
                animationType="slide"
                backgroundColor="#000000"
            />
        </ImageViewerContext.Provider>
    )
}

export function useGlobalImageViewer() {
    const ctx = useContext(ImageViewerContext)
    if (!ctx) throw new Error('ImageViewerProvider is missing')
    return ctx
}
