import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'
import { ModeSwitch } from '@/shared/components/mode-switch/mode-switch'
import { useMemo } from 'react'
import { Icon } from '@/shared/ui/icon/icon'

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
        !nestedName ||
        nestedName === 'ProductsList' ||
        nestedName === 'OrdersList' ||
        nestedName === 'PlannerHome' ||
        nestedName === 'ProfileHome'

    const items = useMemo(
        () => [
            {
                key: 'Planner',
                label: 'Планер',
                renderIcon: (color: string) => (
                    <Icon name="planner-icon" color={color} height={23} />
                ),
            },
            {
                key: 'Orders',
                label: 'Заказы',
                renderIcon: (color: string) => (
                    <Icon name="orders-icon" color={color} height={23} />
                ),
            },
            {
                key: 'Products',
                label: 'Товары',
                renderIcon: (color: string) => (
                    <Icon name="products-icon" color={color} height={23} />
                ),
            },
            {
                key: 'Profile',
                label: 'Профиль',
                renderIcon: (color: string) => (
                    <Icon name="profile-icon" color={color} height={23} />
                ),
            },
        ],
        [],
    )

    if (!shouldShow) return null

    const value = state.routes[state.index]?.name

    return (
        <View pointerEvents="box-none" style={styles.fixedWrap}>
            <View style={[styles.float, { bottom: Math.max(insets.bottom, 10) + 12 }]}>
                <ModeSwitch
                    layout="equal"
                    variant="tabbar"
                    items={items}
                    value={value}
                    onChange={routeName => {
                        const route = state.routes.find(r => r.name === routeName)
                        if (!route) return

                        const focused = route.key === state.routes[state.index].key

                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        })

                        if (!focused && !event.defaultPrevented) {
                            navigation.navigate(routeName as never)
                        }
                    }}
                    height={62}
                    radius={999}
                    pillRadius={999}
                    inset={3}
                    containerStyle={styles.menu}
                />
            </View>
        </View>
    )
}

const useStyles = createThemedStyles(theme => {
    const s = StyleSheet.create({
        fixedWrap: {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
        },
        float: {
            position: 'absolute',
            left: 15,
            right: 15,
        },
        bar: {
            borderWidth: 0,
            shadowOpacity: 0.18,
            shadowRadius: 18,
            shadowOffset: { width: 0, height: 10 },
            elevation: 10,
        },
        menu: {
            borderWidth: 0,
            shadowOpacity: 0.18,
            shadowRadius: 18,
            shadowOffset: { width: 0, height: 10 },
            elevation: 10,
        },
    })

    ;(s as any)._colors = {
        surface: theme.colors.surface,
        border: theme.colors.border,
        brand: theme.colors.brand,
        textMuted: theme.colors.textMuted,
        onBrand: '#ffffff',
    }

    return s as typeof s & { _colors: any }
})
