import { Pressable, StyleSheet, Text, View, Animated } from 'react-native'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'
import { formatMonthTitle, monthStartKey } from '../../utils/planner-date'
import DayCell from './day-cell'
import NativeDateTimeField from '@/shared/ui/native-datetime-field/native-datetime-field'
import { useMonthGridTransition } from '../../hooks/useMonthGridTransition'
import { useMemo, useCallback } from 'react'
import { useMonthGridCache } from '../../hooks/useMonthGridCache'
import { Icon } from '@/shared/ui/icon/icon'
import { useTheme } from '@/shared/theme/useTheme'

type Props = {
    monthStart: string
    selectedDate: string
    today: string
    upcomingDates: Set<string>
    pastDates: Set<string>
    onSelect: (dateKey: string) => void
    onPrevMonth: () => void
    onNextMonth: () => void
}

const ROWS = 6
const CELL_H = 48
const GRID_H = ROWS * CELL_H

export default function MonthCalendar({
    monthStart,
    selectedDate,
    today,
    upcomingDates,
    pastDates,
    onSelect,
    onPrevMonth,
    onNextMonth,
}: Props) {
    const styles = useStyles()
    const colors = useTheme().theme.colors

    const monthKey = monthStartKey(monthStart)
    const { get } = useMonthGridCache(monthKey)

    const {
        renderedMonth,
        transitionMonth,
        titleMonth,
        isAnimating,
        currentAnimStyle,
        nextAnimStyle,
        setNextDirection,
    } = useMonthGridTransition(monthKey, GRID_H)

    const cells = useMemo(() => get(renderedMonth), [get, renderedMonth])
    const nextCells = useMemo(
        () => (transitionMonth ? get(transitionMonth) : null),
        [get, transitionMonth],
    )

    const monthTitle = formatMonthTitle(titleMonth)

    const handlePressDay = useCallback((dateKey: string) => onSelect(dateKey), [onSelect])

    return (
        <View style={styles.wrap}>
            <View style={styles.monthBar}>
                <Pressable
                    onPress={() => {
                        if (isAnimating) return
                        setNextDirection('prev')
                        onPrevMonth()
                    }}
                    style={styles.iconBtn}
                    hitSlop={20}
                >
                    <Icon name={'arrow-icon'} color={colors.text} height={14} />
                </Pressable>

                <View style={styles.monthCenter}>
                    <NativeDateTimeField
                        mode="date"
                        value={selectedDate}
                        placeholder="XX.XX.XX"
                        onChange={onSelect}
                        width="100%"
                        variant="ghost"
                        displayValue={monthTitle}
                        textStyle={styles.monthText}
                    />
                </View>

                <Pressable
                    onPress={() => {
                        if (isAnimating) return
                        setNextDirection('next')
                        onNextMonth()
                    }}
                    style={styles.iconBtn}
                    hitSlop={20}
                >
                    <Icon
                        name={'arrow-icon'}
                        color={colors.text}
                        rotateDeg={180}
                        height={14}
                    />
                </Pressable>
            </View>

            <View style={styles.weekdays}>
                {['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'].map((w, idx) => (
                    <Text
                        key={w}
                        style={[styles.weekday, idx >= 5 && styles.weekdayWeekend]}
                    >
                        {w}
                    </Text>
                ))}
            </View>

            <View style={styles.gridHost}>
                <Animated.View style={[styles.grid, currentAnimStyle]}>
                    {cells.map(c => (
                        <DayCell
                            key={`${renderedMonth}:${c.dateKey}`}
                            cell={c}
                            selectedDate={selectedDate}
                            today={today}
                            hasUpcoming={upcomingDates.has(c.dateKey)}
                            hasPast={pastDates.has(c.dateKey)}
                            isWeekend={c.isWeekend}
                            onPress={handlePressDay}
                        />
                    ))}
                </Animated.View>

                {!!nextCells && transitionMonth && (
                    <Animated.View style={[styles.gridOverlay, nextAnimStyle]}>
                        {nextCells.map(c => (
                            <DayCell
                                key={`${transitionMonth}:${c.dateKey}`}
                                cell={c}
                                selectedDate={selectedDate}
                                today={today}
                                hasUpcoming={upcomingDates.has(c.dateKey)}
                                hasPast={pastDates.has(c.dateKey)}
                                isWeekend={c.isWeekend}
                                onPress={handlePressDay}
                            />
                        ))}
                    </Animated.View>
                )}
            </View>
        </View>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        wrap: {},
        monthBar: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: theme.colors.surface,
            borderRadius: 15,
            borderWidth: 1,
            borderColor: theme.colors.border,
            paddingHorizontal: 30,
            height: 40,
        },
        iconBtn: {
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
        },
        monthCenter: {
            flex: 1,
            marginHorizontal: 8,
        },
        monthText: {
            fontFamily: 'Epilogue-Regular',
            fontSize: 14,
            color: theme.colors.text,
            textAlign: 'center',
        },
        weekdays: {
            flexDirection: 'row',
            marginTop: 22,
            marginBottom: 24,
        },
        weekday: {
            width: '14.2857143%',
            textAlign: 'center',
            fontFamily: 'Epilogue-Regular',
            fontSize: 14,
            color: theme.colors.text,
        },
        weekdayWeekend: {
            color: theme.colors.textMuted,
        },
        gridHost: {
            position: 'relative',
            overflow: 'hidden',
            height: GRID_H,
        },
        grid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
        },
        gridOverlay: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            flexDirection: 'row',
            flexWrap: 'wrap',
        },
    }),
)
