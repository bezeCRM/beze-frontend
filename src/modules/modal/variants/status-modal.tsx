import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import ModalHeader from '@/modules/modal/base/modal-header'
import ModalFooter from '@/modules/modal/base/modal-footer'
import { theme } from '@/shared/theme'
import CheckIcon from '@/assets/images/success-icon.svg'
import { BaseModalProps } from '@/modules/modal/types/base-modal-props'

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
    return (
        <View style={styles.container}>
            <ModalHeader title={title} onClose={onClose} />

            <Text style={[styles.text, success && styles.textSuccess]}>{message}</Text>
            {success && (
                <View style={styles.iconContainer}>
                    <CheckIcon width={48} height={48} />
                </View>
            )}

            <ModalFooter primaryTitle="Закрыть" onPrimaryPress={onClose} />
        </View>
    )
}

const { colors } = theme

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    text: {
        fontSize: 15,
        color: colors.mainBlack,
        textAlign: 'center',
    },
    textSuccess: {
        color: colors.mainBlack,
        fontSize: 16,
        fontFamily: 'Epilogue-SemiBold',
    },
    iconContainer: { marginTop: 15, marginBottom: 20 },
})
