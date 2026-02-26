import { View, Text, StyleSheet } from 'react-native'
import ModalHeader from '@/modules/modal/base/modal-header'
import ModalFooter from '@/modules/modal/base/modal-footer'
import { BaseModalProps } from '@/modules/modal/types/base-modal-props'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'

export type ConfirmModalProps = BaseModalProps & {
    title: string
    message: string
    onConfirm: (() => void) | ((orderId: string) => Promise<void>)
    onCancel?: () => void
    confirmText?: string
    cancelText?: string
}

export default function ConfirmModal({
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = 'Удалить',
    cancelText = 'Отмена',
    onClose,
}: ConfirmModalProps) {
    const styles = useStyles()
    return (
        <View style={styles.container}>
            <ModalHeader title={title} onClose={onClose} />
            <Text style={styles.text}>{message}</Text>

            <ModalFooter
                primaryTitle={confirmText}
                secondaryTitle={cancelText}
                onPrimaryPress={onConfirm}
                onSecondaryPress={onCancel || onClose}
                danger
            />
        </View>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        container: { paddingBottom: 18 },
        text: {
            fontSize: 16,
            paddingHorizontal: 40,
            textAlign: 'center',
            color: theme.colors.text,
            fontFamily: 'Epilogue-Semibold',
            lineHeight: 19.2,
            marginBottom: 25,
        },
    }),
)
