import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import ModalHeader from '@/modules/modal/base/modal-header'
import ModalFooter from '@/modules/modal/base/modal-footer'
import { BaseModalProps } from '@/modules/modal/types/base-modal-props'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'
import { Icon } from '@/shared/ui/icon/icon'
import { useTheme } from '@/shared/theme/useTheme'

export type StatusModalProps = BaseModalProps & {
    title: string
    message: string
    success?: boolean
}

export default function StatusModal({
    title,
    message,
    success,
    onClose,
}: StatusModalProps) {
    const styles = useStyles()
    const colors = useTheme().theme.colors

    return (
        <View style={styles.container}>
            <ModalHeader title={title} onClose={onClose} />

            <Text style={[styles.text, success && styles.textSuccess]}>{message}</Text>
            {success && (
                <View style={styles.iconContainer}>
                    <Icon
                        name="success-icon"
                        size={50}
                        color={colors.success}
                        rotateDeg={0}
                    />
                </View>
            )}

            <ModalFooter primaryTitle="Закрыть" onPrimaryPress={onClose} />
        </View>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        container: {
            alignItems: 'center',
        },
        text: {
            fontSize: 15,
            color: theme.colors.text,
            textAlign: 'center',
        },
        textSuccess: {
            color: theme.colors.text,
            fontSize: 16,
            fontFamily: 'Epilogue-SemiBold',
        },
        iconContainer: { marginTop: 15, marginBottom: 20 },
    }),
)
