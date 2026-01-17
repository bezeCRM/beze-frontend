import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import CloseIcon from '@/assets/images/close-icon.svg'
import BackIcon from '@/assets/images/modal-back-icon.svg'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'

type Props = {
    title: string
    onClose?: () => void
    onBack?: () => void
}

export default function ModalHeader({ title, onClose, onBack }: Props) {
    const styles = useStyles()
    return (
        <View style={styles.container}>
            {onBack ? (
                <TouchableOpacity onPress={onBack} style={styles.backBtn}>
                    <BackIcon width={24} height={24} />
                </TouchableOpacity>
            ) : (
                <View style={styles.backBtn} />
            )}
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity
                onPress={onClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.closeBtn}
            >
                <CloseIcon width={24} height={24} />
            </TouchableOpacity>
        </View>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        backBtn: {
            position: 'absolute',
            left: 10,
            top: 12,
            width: 24,
            height: 24,
            marginRight: 10,
        },
        container: {
            paddingHorizontal: 10,
            paddingTop: 6,
            paddingBottom: 12,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            marginBottom: 10,
            height: 50,
        },
        title: {
            fontSize: 14,
            fontFamily: 'Epilogue-Regular',
            color: theme.colors.text,
        },
        closeBtn: {
            position: 'absolute',
            right: 10,
            top: 12,
        },
    }),
)
