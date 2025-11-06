import React from 'react'
import { View, Text, StyleSheet, Pressable, ViewStyle, TextStyle } from 'react-native'
import BackIcon from '@/assets/images/back-icon.svg'
import { theme } from '@/shared/theme'

type Props = {
    title: string
    onBack?: () => void
    onEditPress?: () => void
    showEdit?: boolean
    editText?: string
    containerStyle?: ViewStyle
    titleStyle?: TextStyle
}

export default function InternalHeader({
    title,
    onBack,
    onEditPress,
    showEdit = false,
    editText = 'Изменить',
    containerStyle,
    titleStyle,
}: Props) {
    return (
        <View style={[styles.container, containerStyle]}>
            {/* верхняя строка с кнопками */}
            <View style={styles.topBar}>
                <Pressable
                    onPress={onBack}
                    style={styles.backBtn}
                    android_ripple={{ color: theme.colors.mainPink }}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <BackIcon width={12} height={21} />
                    <Text style={styles.backText}>Назад</Text>
                </Pressable>

                {showEdit ? (
                    <Pressable
                        onPress={onEditPress}
                        style={styles.editBtn}
                        android_ripple={{ color: theme.colors.mainPink }}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                        <Text style={styles.editText}>{editText}</Text>
                    </Pressable>
                ) : (
                    <View style={styles.editSpacer} />
                )}
            </View>

            {/* заголовок во второй строке */}
            <Text style={[styles.title, titleStyle]}>{title}</Text>
        </View>
    )
}

const { colors } = theme

const styles = StyleSheet.create({
    container: {},
    topBar: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 7,
    },
    backBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    backText: {
        color: colors.mainPink,
        fontSize: 16,
        fontFamily: 'Epilogue-Regular',
    },
    editBtn: {
        paddingHorizontal: 6,
        paddingVertical: 4,
    },
    editText: {
        color: colors.mainPink,
        fontSize: 16,
        fontFamily: 'Epilogue-Regular',
    },
    editSpacer: {
        width: 70,
    },
    title: {
        color: colors.mainBlack,
        fontSize: 28,
        fontFamily: 'Epilogue-SemiBold',
        lineHeight: 33.6,
        marginBottom: 20,
    },
})
