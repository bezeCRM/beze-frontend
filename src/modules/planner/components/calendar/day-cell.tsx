// day-cell.tsx
import React, { memo, useMemo } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'
import type { CalendarCell } from '../../utils/planner-calendar'

type Props = {
    cell: CalendarCell
    selectedDate: string
    today: string
    hasUpcoming: boolean
    hasPast: boolean
    isWeekend: boolean
    onPress: (dateKey: string) => void
    cellWidth?: number
}

function DayCell({
    cell,
    selectedDate,
    today,
    hasUpcoming,
    hasPast,
    isWeekend,
    onPress,
    cellWidth,
}: Props) {
    const styles = useStyles()

    const isToday = cell.dateKey === today
    const isSelected = cell.dateKey === selectedDate
    const dotVisible = hasUpcoming || hasPast

    const pillStyle = useMemo(
        () => [
            styles.pill,
            isSelected && styles.pillSelected,
            isToday && styles.pillToday,
        ],
        [styles, isSelected, isToday],
    )

    const textStyle = useMemo(
        () => [
            styles.text,
            isWeekend && styles.textWeekend,
            !cell.inMonth && styles.textOutMonth,
            (hasUpcoming || hasPast) && styles.textMarked,
            hasUpcoming && styles.textUpcoming,
            hasPast && !hasUpcoming && styles.textPast,
            isToday && styles.textToday,
        ],
        [styles, isWeekend, cell.inMonth, hasUpcoming, hasPast, isToday],
    )

    const wrapStyle = useMemo(
        () => [styles.wrap, cellWidth ? { width: cellWidth } : null],
        [styles, cellWidth],
    )

    return (
        <Pressable onPress={() => onPress(cell.dateKey)} style={wrapStyle}>
            <View style={pillStyle}>
                <Text style={textStyle}>{cell.day}</Text>
            </View>

            <View style={styles.dotWrap}>
                {dotVisible && (
                    <View
                        style={[
                            styles.dot,
                            hasUpcoming ? styles.dotUpcoming : styles.dotPast,
                        ]}
                    />
                )}
            </View>
        </Pressable>
    )
}

export default memo(
    DayCell,
    (a, b) =>
        a.cell.dateKey === b.cell.dateKey &&
        a.cell.day === b.cell.day &&
        a.cell.inMonth === b.cell.inMonth &&
        a.selectedDate === b.selectedDate &&
        a.today === b.today &&
        a.hasUpcoming === b.hasUpcoming &&
        a.hasPast === b.hasPast &&
        a.isWeekend === b.isWeekend &&
        a.onPress === b.onPress &&
        a.cellWidth === b.cellWidth,
)

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        wrap: {
            width: '14.2857143%',
            height: 48,
            alignItems: 'center',
            flexGrow: 0,
            flexShrink: 0,
        },
        pill: {
            width: '85%',
            height: 25,
            borderRadius: 999,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            overflow: 'hidden',
        },
        pillSelected: {
            backgroundColor: theme.colors.border,
            paddingTop: 4,
            transform: [{ translateY: -2 }],
        },
        pillToday: {
            backgroundColor: theme.colors.brand,
            paddingTop: 4,
            transform: [{ translateY: -2 }],
        },
        text: {
            fontFamily: 'Epilogue-Regular',
            fontSize: 16,
            color: theme.colors.text,
            fontVariant: ['tabular-nums'],
            includeFontPadding: false,
        },
        textWeekend: {
            color: theme.colors.textMuted,
        },
        textOutMonth: {
            color: theme.colors.outMonth,
        },
        textMarked: {
            fontFamily: 'Epilogue-SemiBold',
        },
        textUpcoming: {
            color: theme.colors.warning,
        },
        textPast: {
            color: theme.colors.textMuted,
        },
        textToday: {
            color: theme.colors.fixedWhite,
        },
        dotWrap: {
            height: 10,
            justifyContent: 'center',
        },
        dot: {
            width: 5,
            height: 5,
            borderRadius: 999,
        },
        dotUpcoming: {
            backgroundColor: theme.colors.warning,
        },
        dotPast: {
            backgroundColor: theme.colors.textMuted,
        },
    }),
)
