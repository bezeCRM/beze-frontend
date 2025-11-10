import { View, Text, StyleSheet } from 'react-native'
import ModalHeader from '@/modules/modal/base/modal-header'
import ModalFooter from '@/modules/modal/base/modal-footer'
import { theme } from '@/shared/theme'
import { BaseModalProps } from '@/modules/modal/types/base-modal-props'

export type ConfirmModalProps = BaseModalProps & {
    title: string
    message: string
    onConfirm: () => void
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

const { colors } = theme
const styles = StyleSheet.create({
    container: { paddingHorizontal: 20, paddingBottom: 10 },
    text: {
        fontSize: 15,
        textAlign: 'center',
        color: colors.mainBlack,
        marginBottom: 10,
    },
})
