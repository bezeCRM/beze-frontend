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
    icon?: ReactNode
}

type Props<Key extends string> = {
    items: SwitchItem<Key>[]
    value: Key
    onChange: (next: Key) => void

    height?: number
    radius?: number
    pillRadius?: number
    inset?: number
    itemGap?: number
    contentPaddingX?: number

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

        height = 40,
        radius = 15,
        pillRadius = 12,
        inset = 2,
        itemGap = 20,
        contentPaddingX = 12,

        containerStyle,
        labelStyle,
        colors = {
            background: stylesColors.surface,
            border: stylesColors.brand,
            pill: stylesColors.brand,
            inactiveText: stylesColors.text,
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

    const [layouts, setLayouts] = useState<(ItemLayout | null)[]>(() =>
        items.map(() => null),
    )

    useEffect(() => {
        setLayouts(items.map(() => null))
    }, [items])

    const x = useSharedValue(0)
    const w = useSharedValue(0)
    const pillVisible = useSharedValue(0)

    useEffect(() => {
        const l = layouts[selectedIndex]
        if (!l) return
        pillVisible.value = 1
        x.value = withTiming(l.x, { duration: animationMs })
        w.value = withTiming(l.w, { duration: animationMs })
    }, [selectedIndex, layouts, animationMs, x, w, pillVisible])

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
            const next = [...prev]
            next[i] = { x: itemX, w: itemW }
            return next
        })
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
                    onLayout={pointerEvents === 'auto' ? onItemLayout(i) : undefined}
                    style={[
                        styles.item,
                        {
                            paddingHorizontal: contentPaddingX,
                            marginRight: i === items.length - 1 ? 0 : itemGap,
                        },
                    ]}
                >
                    <View style={styles.content}>
                        {it.icon ? <View style={styles.iconWrap}>{it.icon}</View> : null}
                        <Text
                            numberOfLines={1}
                            style={[styles.label, { color: textColor }, labelStyle]}
                        >
                            {it.label}
                        </Text>
                    </View>
                </Pressable>
            ))}
        </View>
    )

    return (
        <View
            style={[
                styles.container,
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
            overflow: 'hidden',
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
    }),
)
