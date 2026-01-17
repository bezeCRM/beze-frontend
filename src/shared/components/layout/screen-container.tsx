import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import DismissKeyboard from '../keyboard/dismiss-keyboard'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'

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
    const styles = useStyles()
    if (scrollable) {
        return (
            <DismissKeyboard>
                <SafeAreaView style={[styles.container, style]} edges={edges}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={[
                            styles.scrollContent,
                            contentContainerStyle,
                        ]}
                    >
                        {children}
                    </ScrollView>
                </SafeAreaView>
            </DismissKeyboard>
        )
    }

    return (
        <SafeAreaView style={[styles.container, style]} edges={edges}>
            <View style={[styles.inner, contentContainerStyle]}>{children}</View>
        </SafeAreaView>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        inner: {
            flex: 1,
            paddingHorizontal: 20,
        },
        scrollContent: {
            paddingHorizontal: 20,
        },
    }),
)
