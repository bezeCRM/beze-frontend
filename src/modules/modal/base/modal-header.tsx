import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'
import { Icon } from '@/shared/ui/icon/icon'
import { useTheme } from '@/shared/theme/useTheme'

type Props = {
    title: string
    onClose?: () => void
    onBack?: () => void
}

export default function ModalHeader({ title, onClose, onBack }: Props) {
    const styles = useStyles()
    const colors = useTheme().theme.colors
    return (
        <View style={styles.container}>
            {onBack ? (
                <TouchableOpacity onPress={onBack} style={styles.backBtn}>
                    <Icon
                        name="arrow-icon"
                        height={16}
                        color={colors.text}
                        rotateDeg={0}
                    />
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
                <Icon name="x-icon" size={14} color={colors.text} />
            </TouchableOpacity>
        </View>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        backBtn: {
            position: 'absolute',
            left: 12,
            top: 13,
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
            right: 15,
            top: 15,
        },
    }),
)
