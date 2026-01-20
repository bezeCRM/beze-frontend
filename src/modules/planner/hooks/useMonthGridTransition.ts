import { useEffect, useMemo, useRef, useState } from 'react'
import { Animated } from 'react-native'

type Dir = 'next' | 'prev'

function monthIndex(key: string) {
    const [y, m] = key.split('-').map(Number)
    const yy = y || 0
    const mm = (m || 1) - 1
    return yy * 12 + mm
}

type State = {
    renderedMonth: string
    transitionMonth: string | null
}

export function useMonthGridTransition(monthKey: string, gridHeight: number) {
    const [state, setState] = useState<State>({
        renderedMonth: monthKey,
        transitionMonth: null,
    })

    const pendingDir = useRef<Dir | null>(null)
    const dirRef = useRef<Dir>('next')

    const currentY = useRef(new Animated.Value(0)).current
    const nextY = useRef(new Animated.Value(0)).current

    const isAnimating = state.transitionMonth !== null
    const titleMonth = state.transitionMonth ?? state.renderedMonth

    const setNextDirection = (d: Dir) => {
        pendingDir.current = d
    }

    useEffect(() => {
        if (monthKey === state.renderedMonth) return
        if (state.transitionMonth) return

        const h = gridHeight
        if (!h || h <= 0) {
            currentY.stopAnimation()
            nextY.stopAnimation()
            currentY.setValue(0)
            nextY.setValue(0)
            setState({ renderedMonth: monthKey, transitionMonth: null })
            return
        }

        const diff = monthIndex(monthKey) - monthIndex(state.renderedMonth)

        if (Math.abs(diff) !== 1) {
            currentY.stopAnimation()
            nextY.stopAnimation()
            currentY.setValue(0)
            nextY.setValue(0)
            setState({ renderedMonth: monthKey, transitionMonth: null })
            return
        }

        const dir: Dir = pendingDir.current ?? (diff > 0 ? 'next' : 'prev')
        pendingDir.current = null
        dirRef.current = dir

        setState(prev => ({
            renderedMonth: prev.renderedMonth,
            transitionMonth: monthKey,
        }))

        currentY.stopAnimation()
        nextY.stopAnimation()
        currentY.setValue(0)
        nextY.setValue(dir === 'next' ? h : -h)

        Animated.parallel([
            Animated.timing(currentY, {
                toValue: dir === 'next' ? -h : h,
                duration: 260,
                useNativeDriver: true,
            }),
            Animated.timing(nextY, {
                toValue: 0,
                duration: 260,
                useNativeDriver: true,
            }),
        ]).start(({ finished }) => {
            if (!finished) return

            // фаза 1: переключаем данные, но не сбрасываем currentY
            // current слой остается вне экрана, overlay в центре
            setState({ renderedMonth: monthKey, transitionMonth: monthKey })

            requestAnimationFrame(() => {
                // фаза 2: теперь current слой уже с новыми данными, можно вернуть в 0
                currentY.stopAnimation()
                nextY.stopAnimation()
                currentY.setValue(0)
                nextY.setValue(0)

                requestAnimationFrame(() => {
                    // фаза 3: снимаем overlay, кадр будет идентичным
                    setState({ renderedMonth: monthKey, transitionMonth: null })
                })
            })
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [monthKey, gridHeight])

    const currentAnimStyle = useMemo(
        () => ({
            transform: [{ translateY: currentY }],
        }),
        [currentY],
    )

    const nextAnimStyle = useMemo(
        () => ({
            transform: [{ translateY: nextY }],
        }),
        [nextY],
    )

    return {
        renderedMonth: state.renderedMonth,
        transitionMonth: state.transitionMonth,
        titleMonth,
        isAnimating,
        currentAnimStyle,
        nextAnimStyle,
        setNextDirection,
    }
}
