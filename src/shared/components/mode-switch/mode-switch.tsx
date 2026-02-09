import React, { ReactNode, useEffect, useMemo, useState } from 'react'
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    LayoutChangeEvent,
    ViewStyle,
    TextStyle,
} from 'react-native'
import MaskedView from '@react-native-masked-view/masked-view'
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'
import { useTheme } from '@/shared/theme/useTheme'

export type SwitchItem<Key extends string = string> = {
    key: Key
    label: string
    // вместо icon?: ReactNode делаем функцию, чтобы корректно менять цвет
    renderIcon?: (color: string) => ReactNode
}

type Props<Key extends string> = {
    items: SwitchItem<Key>[]
    value: Key
    onChange: (next: Key) => void

    layout?: 'content' | 'equal'

    height?: number
    radius?: number
    pillRadius?: number
    inset?: number
    itemGap?: number
    contentPaddingX?: number

    // для таббара: вертикальная компоновка (иконка над текстом)
    variant?: 'default' | 'tabbar'
    tabIconSize?: number
    tabGap?: number

    containerStyle?: ViewStyle
    labelStyle?: TextStyle

    colors?: {
        background: string
        border: string
        pill: string
        inactiveText: string
        activeText: string
    }

    animationMs?: number
}

type ItemLayout = { x: number; w: number }

export function ModeSwitch<Key extends string>(props: Props<Key>) {
    const styles = useStyles()
    const stylesColors = useTheme().theme.colors

    const {
        items,
        value,
        onChange,

        layout = 'content',

        height = 40,
        radius = 15,
        pillRadius = 12,
        inset = 2,
        itemGap = 20,
        contentPaddingX = 12,

        variant = 'default',
        tabGap = 6,

        containerStyle,
        labelStyle,
        colors = {
            background: stylesColors.surface,
            border: stylesColors.brand,
            pill: stylesColors.brand,
            inactiveText: stylesColors.brand,
            activeText: stylesColors.fixedWhite,
        },
        animationMs = 220,
    } = props

    const indexByKey = useMemo(() => {
        const m = new Map<Key, number>()
        items.forEach((it, i) => m.set(it.key, i))
        return m
    }, [items])

    const selectedIndex = indexByKey.get(value) ?? 0

    const [containerW, setContainerW] = useState(0)
    const onContainerLayout = (e: LayoutChangeEvent) => {
        setContainerW(e.nativeEvent.layout.width)
    }

    const [layouts, setLayouts] = useState<(ItemLayout | null)[]>(() =>
        items.map(() => null),
    )

    useEffect(() => {
        setLayouts(prev => {
            if (prev.length === items.length) return prev
            return items.map(() => null)
        })
    }, [items.length, items])

    const x = useSharedValue(0)
    const w = useSharedValue(0)
    const pillVisible = useSharedValue(0)

    useEffect(() => {
        if (layout !== 'equal') return
        if (containerW <= 0 || items.length === 0) return

        const segW = containerW / items.length
        const nextX = inset + selectedIndex * segW
        const nextW = Math.max(0, segW - inset * 2)

        pillVisible.value = 1
        x.value = withTiming(nextX, { duration: animationMs })
        w.value = withTiming(nextW, { duration: animationMs })
    }, [
        layout,
        containerW,
        items.length,
        selectedIndex,
        inset,
        animationMs,
        x,
        w,
        pillVisible,
    ])

    useEffect(() => {
        if (layout !== 'content') return
        const l = layouts[selectedIndex]
        if (!l) return

        pillVisible.value = 1
        x.value = withTiming(l.x, { duration: animationMs })
        w.value = withTiming(l.w, { duration: animationMs })
    }, [layout, selectedIndex, layouts, animationMs, x, w, pillVisible])

    const pillAnim = useAnimatedStyle(() => ({
        transform: [{ translateX: x.value }],
        width: w.value,
        opacity: pillVisible.value,
    }))

    const renderPill = (bg: string) => (
        <Animated.View
            pointerEvents="none"
            style={[
                {
                    position: 'absolute',
                    top: inset,
                    bottom: inset,
                    left: 0,
                    borderRadius: pillRadius,
                    backgroundColor: bg,
                },
                pillAnim,
            ]}
        />
    )

    const onItemLayout = (i: number) => (e: LayoutChangeEvent) => {
        const { x: itemX, width: itemW } = e.nativeEvent.layout
        setLayouts(prev => {
            if (prev[i]?.x === itemX && prev[i]?.w === itemW) return prev
            const next = [...prev]
            next[i] = { x: itemX, w: itemW }
            return next
        })
    }

    const renderContent = (it: SwitchItem<Key>, color: string) => {
        if (variant === 'tabbar') {
            return (
                <View style={[styles.tabContent, { rowGap: tabGap }]}>
                    {it.renderIcon ? (
                        <View style={styles.tabIconWrap}>{it.renderIcon(color)}</View>
                    ) : null}
                    <Text
                        numberOfLines={1}
                        style={[styles.tabLabel, { color }, labelStyle]}
                    >
                        {it.label}
                    </Text>
                </View>
            )
        }

        return (
            <View style={styles.content}>
                {it.renderIcon ? (
                    <View style={styles.iconWrap}>{it.renderIcon(color)}</View>
                ) : null}
                <Text numberOfLines={1} style={[styles.label, { color }, labelStyle]}>
                    {it.label}
                </Text>
            </View>
        )
    }

    const renderRow = (textColor: string, pointerEvents: 'auto' | 'none') => (
        <View
            style={[styles.row, { paddingHorizontal: inset }]}
            pointerEvents={pointerEvents}
        >
            {items.map((it, i) => (
                <Pressable
                    key={it.key}
                    onPress={() => onChange(it.key)}
                    onLayout={
                        pointerEvents === 'auto' && layout === 'content'
                            ? onItemLayout(i)
                            : undefined
                    }
                    style={[
                        styles.item,
                        layout === 'equal'
                            ? { flex: 1 }
                            : {
                                  paddingHorizontal: contentPaddingX,
                                  marginRight: i === items.length - 1 ? 0 : itemGap,
                              },
                    ]}
                >
                    {renderContent(it, textColor)}
                </Pressable>
            ))}
        </View>
    )

    return (
        <View
            onLayout={onContainerLayout}
            style={[
                styles.container,
                variant === 'tabbar' && styles.containerTabbar,
                {
                    height,
                    borderRadius: radius,
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                },
                containerStyle,
            ]}
        >
            {renderPill(colors.pill)}

            {renderRow(colors.inactiveText, 'auto')}

            <MaskedView
                pointerEvents="none"
                style={StyleSheet.absoluteFill}
                androidRenderingMode="software"
                maskElement={
                    <View style={StyleSheet.absoluteFill} pointerEvents="none">
                        {renderPill('#000')}
                    </View>
                }
            >
                <View
                    style={{ flex: 1, backgroundColor: 'transparent' }}
                    pointerEvents="none"
                >
                    {renderRow(colors.activeText, 'none')}
                </View>
            </MaskedView>
        </View>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        container: {
            borderWidth: 1,
        },
        containerTabbar: {
            marginHorizontal: 'auto',
            width: '90%',
            shadowColor: '#000',
            shadowOpacity: 0.05,
            shadowRadius: 18,
            shadowOffset: { width: 0, height: 0 },
            elevation: 10,
        },
        row: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'stretch',
        },
        item: {
            alignItems: 'center',
            justifyContent: 'center',
        },

        // default variant
        content: {
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: 8,
        },
        iconWrap: {
            width: 18,
            height: 18,
            alignItems: 'center',
            justifyContent: 'center',
        },
        label: {
            fontSize: 14,
            fontFamily: 'Epilogue-Regular',
        },

        // tabbar variant
        tabContent: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        tabIconWrap: {
            height: 23,
            alignItems: 'center',
            justifyContent: 'center',
        },
        tabLabel: {
            fontSize: 11,
            fontFamily: 'Epilogue-Regular',
        },
    }),
)
