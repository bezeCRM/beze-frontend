import React from 'react'
import { Text, StyleSheet, TextStyle } from 'react-native'
import { createThemedStyles } from '../theme/create-themed-styles'

type Props = {
    text: string
    style?: TextStyle
}

export default function Title({ text, style }: Props) {
    const styles = useStyles()
    return (
        <Text style={[styles.title, style]} allowFontScaling={false}>
            {text}
        </Text>
    )
}
const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        title: {
            fontFamily: 'Epilogue-SemiBold',
            fontSize: 28,
            lineHeight: 33.6,
            color: theme.colors.text,
        },
    }),
)
