import { useEffect, useRef } from 'react'
import { FlatList, InteractionManager } from 'react-native'

type Params = {
  itemsLength: number
  enabled?: boolean
}

export function useAutoScroll<T = { id: string }>({ itemsLength, enabled = true }: Params) {
  const listRef = useRef<FlatList<T>>(null)
  const prevLenRef = useRef(itemsLength)
  const shouldScrollRef = useRef(false)

  // эффект: скроллим только когда длина выросла
    useEffect(() => {
    if (!enabled) return
    if (itemsLength > prevLenRef.current) {
        shouldScrollRef.current = true
    }
    prevLenRef.current = itemsLength
    }, [itemsLength, enabled])

    const onContentSizeChange = () => {
        if (!enabled) return
        if (shouldScrollRef.current) {
            // небольшой таймаут гарантирует, что layout закончен
            setTimeout(() => {
            listRef.current?.scrollToEnd({ animated: true })
            }, 80)
            shouldScrollRef.current = false
        }
    }

    const scrollToItem = (index: number) => {
    if (!listRef.current) return

    InteractionManager.runAfterInteractions(() => {
        try {
        listRef.current?.scrollToIndex({
            index,
            animated: true,
            viewPosition: 0,
            viewOffset: 8
        })
        } catch {
        // если индекс вне диапазона — игнорируем
        }
    })
    }
  return { listRef, onContentSizeChange, scrollToItem }
}
