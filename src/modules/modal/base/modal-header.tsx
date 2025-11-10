import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import CloseIcon from '@/assets/images/close-icon.svg'
import { theme } from '@/shared/theme'

type Props = {
    title: string
    onClose?: () => void
}

export default function ModalHeader({ title, onClose }: Props) {
    return (
        <View style={styles.container}>
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

const { colors } = theme

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingTop: 6,
        paddingBottom: 12,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginBottom: 10,
        height: 50,
    },
    title: {
        fontSize: 16,
        fontFamily: 'Epilogue-Regular',
        color: colors.mainBlack,
        marginTop: 2,
    },
    closeBtn: {
        position: 'absolute',
        right: 10,
        top: 12,
    },
})
