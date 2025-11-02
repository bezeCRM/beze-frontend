import { theme } from '@/shared/theme'
import React from 'react'
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type ScreenContainerProps = {
    children: React.ReactNode
    style?: ViewStyle
    scrollable?: boolean
    edges?: ('top' | 'bottom' | 'left' | 'right')[]
    contentContainerStyle?: ViewStyle
}

export default function ScreenContainer({
    children,
    style,
    scrollable = false,
    edges = ['top', 'left', 'right'],
    contentContainerStyle,
}: ScreenContainerProps) {
    if (scrollable) {
        return (
            <SafeAreaView style={[styles.container, style]} edges={edges}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
                >
                    {children}
                </ScrollView>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={[styles.container, style]} edges={edges}>
            <View style={[styles.inner, contentContainerStyle]}>{children}</View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.backgroundWhite,
    },
    inner: {
        flex: 1,
        paddingHorizontal: 20,
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
})
