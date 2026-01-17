import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'

function getNestedRouteName(route: any) {
    const state = route?.state
    if (!state?.routes?.length) return null
    const idx = state.index ?? 0
    return state.routes[idx]?.name ?? null
}

export default function DevBottomBar({ state, navigation }: BottomTabBarProps) {
    const styles = useStyles()
    const insets = useSafeAreaInsets()

    const activeTabRoute = state.routes[state.index]
    const nestedName = getNestedRouteName(activeTabRoute)

    const shouldShow =
        !nestedName || nestedName === 'ProductsList' || nestedName === 'OrdersList'

    if (!shouldShow) return null

    return (
        <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 10) }]}>
            <View style={styles.bar}>
                {state.routes.map((route, index) => {
                    const focused = state.index === index
                    const label = route.name === 'Products' ? 'Товары' : 'Заказы'

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        })

                        if (!focused && !event.defaultPrevented) {
                            navigation.navigate(route.name)
                        }
                    }

                    return (
                        <Pressable
                            key={route.key}
                            onPress={onPress}
                            style={[styles.btn, focused && styles.btnActive]}
                        >
                            <Text
                                style={[
                                    styles.text,
                                    focused ? styles.textActive : styles.textIdle,
                                ]}
                            >
                                {label}
                            </Text>
                        </Pressable>
                    )
                })}
            </View>
        </View>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        wrap: {
            backgroundColor: theme.colors.surface,
            paddingHorizontal: 15,
            paddingTop: 8,
        },
        bar: {
            height: 46,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.surface,
            flexDirection: 'row',
            overflow: 'hidden',
        },
        btn: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        btnActive: {
            backgroundColor: theme.colors.background,
        },
        text: {
            fontSize: 14,
            fontFamily: 'Epilogue-Regular',
        },
        textActive: {
            color: theme.colors.brand,
            fontFamily: 'Epilogue-SemiBold',
        },
        textIdle: {
            color: theme.colors.textMuted,
        },
    }),
)
