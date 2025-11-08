import React, { PropsWithChildren } from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { theme } from '@/shared/theme'

type Props = PropsWithChildren<{ title?: string; style?: ViewStyle }>

export default function SectionCard({ title, children, style }: Props) {
    return (
        <View style={[styles.wrap, style]}>
            {!!title && <Text style={styles.title}>{title}</Text>}
            <View style={styles.card}>{children}</View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrap: {
        paddingBottom: 18,
        paddingTop: 15,
        paddingHorizontal: 15,
        borderRadius: 25,
        backgroundColor: theme.colors.mainWhite,
    },
    title: {
        fontSize: 13,
        color: theme.colors.mainGray,
        marginBottom: 10,
        fontFamily: 'Epilogue-Regular',
    },
    card: {
        shadowColor: '#888888',
        shadowOpacity: 0.03,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: 7 },
    },
})
