import React from 'react'
import { Text, StyleSheet, TextStyle } from 'react-native'
import { theme } from '@/shared/theme'

type Props = {
    text: string
    style?: TextStyle
}

export default function Title({ text, style }: Props) {
    return (
        <Text style={[styles.title, style]} allowFontScaling={false}>
            {text}
        </Text>
    )
}

const styles = StyleSheet.create({
    title: {
        fontFamily: 'Epilogue-SemiBold',
        fontSize: 28,
        lineHeight: 33.6,
        color: theme.colors.mainBlack,
    },
})
