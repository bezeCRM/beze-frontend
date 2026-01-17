import { createThemedStyles } from '@/shared/theme/create-themed-styles'
import { ReactNode, useEffect } from 'react'
import {
    BackHandler,
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
    const styles = useStyles()
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
                <View style={styles.backdrop} />
            </TouchableWithoutFeedback>

            <View style={styles.center}>
                <View style={styles.card}>{children}</View>
            </View>
        </Modal>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
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
            backgroundColor: theme.colors.background,
            borderRadius: 25,
            overflow: 'hidden',
        },
    }),
)
