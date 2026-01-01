import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useRef,
    useState,
    useEffect,
} from 'react'
import { View, StyleSheet, Animated, PanResponder, Easing, Text } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { theme } from '@/shared/theme'
import ErrorIcon from '@/assets/images/error-icon.svg'
import SuccessIcon from '@/assets/images/success-icon.svg'

type ToastVariant = 'error' | 'info' | 'success'
type ToastItem = {
    id: string
    message: string
    variant: ToastVariant
    duration: number
    scope: string
}

type ToastContextValue = {
    show: (
        message: string,
        variant?: ToastVariant,
        opts?: { duration?: number; scope?: string },
    ) => string
    dismiss: (id: string) => void
    clear: () => void
    clearScope: (scope: string) => void
    items: ToastItem[]
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
    const ctx = useContext(ToastContext)
    if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
    return ctx
}

const MAX_ON_SCREEN = 3
const ENTER_DURATION = 160
const EXIT_DURATION = 140
const DEFAULT_DURATION = 6000

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<ToastItem[]>([])

    const show: ToastContextValue['show'] = useCallback(
        (message, variant = 'error', opts) => {
            const id = String(Date.now())
            const duration = opts?.duration ?? DEFAULT_DURATION
            const scope = opts?.scope ?? 'global'

            setItems(prev => {
                const next = [...prev]
                const sameScopeCount = next.filter(t => t.scope === scope).length
                if (sameScopeCount >= MAX_ON_SCREEN) {
                    const idx = next.findIndex(t => t.scope === scope)
                    if (idx >= 0) next.splice(idx, 1)
                }
                next.push({ id, message, variant, duration, scope })
                return next
            })
            return id
        },
        [],
    )

    const dismiss = useCallback((id: string) => {
        setItems(prev => prev.filter(t => t.id !== id))
    }, [])

    const clear = useCallback(() => setItems([]), [])
    const clearScope = useCallback((scope: string) => {
        setItems(prev => prev.filter(t => t.scope !== scope))
    }, [])

    const value = useMemo(
        () => ({ show, dismiss, clear, clearScope, items }),
        [show, dismiss, clear, clearScope, items],
    )

    return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

function ToastCard({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
    const onDismissRef = useRef(onDismiss)
    const translateY = useRef(new Animated.Value(16)).current
    const opacity = useRef(new Animated.Value(0)).current
    const translateX = useRef(new Animated.Value(0)).current
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    const Icon = item.variant === 'success' ? SuccessIcon : ErrorIcon
    const variantCardStyle =
        item.variant === 'success' ? styles.successCard : styles.errorCard

    useEffect(() => {
        onDismissRef.current = onDismiss
    }, [onDismiss])

    useEffect(() => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: 0,
                duration: ENTER_DURATION,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: ENTER_DURATION,
                useNativeDriver: true,
            }),
        ]).start()

        timerRef.current = setTimeout(() => {
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: EXIT_DURATION,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: 16,
                    duration: EXIT_DURATION,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                onDismissRef.current()
            })
        }, item.duration)

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current)
                timerRef.current = null
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const pan = useMemo(
        () =>
            PanResponder.create({
                onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 6,
                onPanResponderMove: (_, g) => translateX.setValue(g.dx),
                onPanResponderRelease: (_, g) => {
                    if (Math.abs(g.dx) > 60) {
                        if (timerRef.current) clearTimeout(timerRef.current)
                        Animated.timing(translateX, {
                            toValue: g.dx > 0 ? 300 : -300,
                            duration: EXIT_DURATION,
                            useNativeDriver: true,
                        }).start(onDismiss)
                    } else {
                        Animated.spring(translateX, {
                            toValue: 0,
                            useNativeDriver: true,
                        }).start()
                    }
                },
            }),
        [translateX, onDismiss],
    )

    return (
        <Animated.View
            style={[
                styles.card,
                variantCardStyle,
                { opacity, transform: [{ translateY }, { translateX }] },
            ]}
            {...pan.panHandlers}
        >
            <Icon width={25} height={25} style={styles.icon} />
            <Text style={styles.message} numberOfLines={3}>
                {item.message}
            </Text>
        </Animated.View>
    )
}

export function ToastViewport({
    scope,
    bottomOffset = 90,
}: {
    scope: string
    bottomOffset?: number
}) {
    const { items, dismiss, clearScope } = useToast()
    const { bottom } = useSafeAreaInsets()
    const scoped = items.filter(i => i.scope === scope)

    useEffect(() => {
        return () => clearScope(scope)
    }, [clearScope, scope])

    if (scoped.length === 0) return null

    return (
        <View
            pointerEvents="box-none"
            style={[
                StyleSheet.absoluteFill,
                { justifyContent: 'flex-end', paddingBottom: bottom + bottomOffset },
            ]}
        >
            <View pointerEvents="box-none" style={styles.stack}>
                {scoped.map(item => (
                    <ToastCard
                        key={item.id}
                        item={item}
                        onDismiss={() => dismiss(item.id)}
                    />
                ))}
            </View>
        </View>
    )
}

const { colors } = theme
const styles = StyleSheet.create({
    stack: { gap: 8 },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 18,
        backgroundColor: colors.mainWhite,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOpacity: 0.12,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 2 },
        elevation: 8,
    },

    errorCard: { borderWidth: 1, borderColor: colors.lineGray },
    successCard: { borderWidth: 1, borderColor: colors.lineGray },

    icon: { marginRight: 12 },

    message: {
        flex: 1,
        fontSize: 16,
        lineHeight: 19.2,
        color: colors.mainBlack,
        fontFamily: 'Epilogue-SemiBold',
    },
})
