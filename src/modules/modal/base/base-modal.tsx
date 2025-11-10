import { theme } from '@/shared/theme'
import React, { ReactNode, useEffect, useMemo } from 'react'
import {
    Animated,
    BackHandler,
    Easing,
    Modal,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
} from 'react-native'

type Props = {
    visible: boolean
    onClose?: () => void
    children: ReactNode
    dismissOnBackdrop?: boolean
    blocking?: boolean
}

export default function BaseModal({
    visible,
    onClose,
    children,
    dismissOnBackdrop = true,
    blocking = false,
}: Props) {
    const opacity = useMemo(() => new Animated.Value(0), [])
    const scale = useMemo(() => new Animated.Value(0.95), [])

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 150,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.spring(scale, {
                    toValue: 1,
                    friction: 8,
                    tension: 50,
                    useNativeDriver: true,
                }),
            ]).start()
        }
    }, [visible, opacity, scale])

    // handle Android back
    useEffect(() => {
        const sub = BackHandler.addEventListener('hardwareBackPress', () => {
            if (visible && !blocking) {
                onClose?.()
                return true
            }
            return false
        })
        return () => sub.remove()
    }, [visible, blocking, onClose])

    const handleBackdropPress = () => {
        if (!blocking && dismissOnBackdrop) onClose?.()
    }

    if (!visible) return null

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <TouchableWithoutFeedback onPress={handleBackdropPress}>
                <Animated.View style={[styles.backdrop, { opacity }]} />
            </TouchableWithoutFeedback>

            <View style={styles.center}>
                <Animated.View
                    style={[
                        styles.card,
                        {
                            transform: [{ scale }],
                        },
                    ]}
                >
                    {children}
                </Animated.View>
            </View>
        </Modal>
    )
}

const { colors } = theme

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 50,
    },
    card: {
        width: '100%',
        maxWidth: 420,
        backgroundColor: colors.backgroundWhite,
        borderRadius: 25,
        overflow: 'hidden',
    },
})
