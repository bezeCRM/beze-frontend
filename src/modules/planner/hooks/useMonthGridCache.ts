import { useCallback, useEffect, useRef } from 'react'
import type { CalendarCell } from '../utils/planner-calendar'
import { buildMonthGrid } from '../utils/planner-calendar'
import { addMonths, fromDateKey, weekdayMon0 } from '../utils/planner-date'

export type CalendarCellEx = CalendarCell & { isWeekend: boolean }

export function useMonthGridCache(anchorMonthKey: string) {
    const cacheRef = useRef(new Map<string, CalendarCellEx[]>())

    const get = useCallback((monthKey: string): CalendarCellEx[] => {
        const cached = cacheRef.current.get(monthKey)
        if (cached) return cached

        const base = buildMonthGrid(monthKey)
        const extended: CalendarCellEx[] = base.map(c => {
            const wd = weekdayMon0(fromDateKey(c.dateKey))
            return { ...c, isWeekend: wd >= 5 }
        })

        cacheRef.current.set(monthKey, extended)
        return extended
    }, [])

    useEffect(() => {
        get(anchorMonthKey)
        get(addMonths(anchorMonthKey, -1))
        get(addMonths(anchorMonthKey, 1))

        // чтобы впервые тоже не лагало
        get(addMonths(anchorMonthKey, -2))
        get(addMonths(anchorMonthKey, 2))
    }, [anchorMonthKey, get])

    return { get }
}
