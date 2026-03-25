import { useEffect, useMemo } from 'react'
import { usePlannerStore, addMonthsToDateKey, monthEndKey } from '../store/planner.store'
import { pad2 } from '../utils/planner-date'
import { usePlannerItems } from './usePlannerItems'
import { uniqueDateSets } from '../utils/planner-tasks'

function todayKey() {
    const d = new Date()
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

export function usePlannerScreen() {
    const today = useMemo(() => todayKey(), [])

    const showAllTasks = usePlannerStore(s => s.showAllTasks)
    const selectedDate = usePlannerStore(s => s.selectedDate)
    const visibleMonth = usePlannerStore(s => s.visibleMonth)

    const setShowAllTasks = usePlannerStore(s => s.setShowAllTasks)

    const openAllTasksFocusUpcoming = usePlannerStore(s => s.openAllTasksFocusUpcoming)
    const openAllTasksFocusPast = usePlannerStore(s => s.openAllTasksFocusPast)

    const setSelectedDate = usePlannerStore(s => s.setSelectedDate)
    const setVisibleMonth = usePlannerStore(s => s.setVisibleMonth)

    const upcomingExpanded = usePlannerStore(s => s.upcomingExpanded)
    const pastExpanded = usePlannerStore(s => s.pastExpanded)
    const setSectionExpanded = usePlannerStore(s => s.setSectionExpanded)

    const toggleCompleted = usePlannerStore(s => s.toggleCompleted)
    const addTask = usePlannerStore(s => s.addTask)
    const removeTask = usePlannerStore(s => s.removeTask)
    const cleanupArchive = usePlannerStore(s => s.cleanupArchive)
    const fetchTasksInRange = usePlannerStore(s => s.fetchTasksInRange)
    const isFetching = usePlannerStore(s => s.isFetching)

    const { upcoming, past, items } = usePlannerItems(today)

    const tasksForSelectedDate = useMemo(
        () => items.filter(t => t.date === selectedDate),
        [items, selectedDate],
    )

    useEffect(() => {
        cleanupArchive(today)
    }, [cleanupArchive, today])

    useEffect(() => {
        const monthStart = `${selectedDate.slice(0, 7)}-01`
        const from = addMonthsToDateKey(monthStart, -6)
        const to = monthEndKey(addMonthsToDateKey(monthStart, 6))

        void fetchTasksInRange({ from, to })
    }, [fetchTasksInRange, selectedDate])

    const marks = useMemo(() => uniqueDateSets(items as any, today), [items, today])

    const nearbyUpcoming = useMemo(() => {
        if (!upcoming.length) return []
        const idx = upcoming.findIndex(it => it.date >= selectedDate)
        if (idx < 0) return []
        return upcoming.slice(idx)
    }, [upcoming, selectedDate])

    const nextUpcoming = useMemo(() => nearbyUpcoming[0] ?? null, [nearbyUpcoming])
    const nearbyUpcomingCount = useMemo(() => nearbyUpcoming.length, [nearbyUpcoming])

    const nearbyPastInRange = useMemo(() => {
        if (!past.length) return []
        if (selectedDate >= today) return []
        return past.filter(it => it.date >= selectedDate && it.date <= today)
    }, [past, selectedDate, today])

    const nearbyPastCount = useMemo(() => nearbyPastInRange.length, [nearbyPastInRange])

    const nearbyPastTask = useMemo(() => {
        if (!nearbyPastInRange.length) return null

        const sorted = [...nearbyPastInRange].sort((a, b) => {
            const aKey = `${a.date} ${a.time ?? '23:59'}`
            const bKey = `${b.date} ${b.time ?? '23:59'}`
            return aKey.localeCompare(bKey)
        })

        return sorted[sorted.length - 1] ?? null
    }, [nearbyPastInRange])

    const nearbyMode = useMemo<'past' | 'upcoming'>(() => {
        if (selectedDate < today && nearbyPastCount > 0) return 'past'
        return 'upcoming'
    }, [selectedDate, today, nearbyPastCount])

    const nearbyTask = useMemo(() => {
        return nearbyMode === 'past' ? nearbyPastTask : nextUpcoming
    }, [nearbyMode, nearbyPastTask, nextUpcoming])

    const nearbyCount = useMemo(() => {
        return nearbyMode === 'past' ? nearbyPastCount : nearbyUpcomingCount
    }, [nearbyMode, nearbyPastCount, nearbyUpcomingCount])

    const openAllTasksFocusNearby = useMemo(() => {
        return () => {
            if (nearbyMode === 'past') {
                openAllTasksFocusPast()
                return
            }

            openAllTasksFocusUpcoming()
        }
    }, [nearbyMode, openAllTasksFocusPast, openAllTasksFocusUpcoming])

    return {
        today,
        showAllTasks,
        selectedDate,
        visibleMonth,

        upcomingExpanded,
        pastExpanded,

        upcoming,
        past,
        marks,

        nearbyMode,
        nearbyTask,
        nearbyCount,
        openAllTasksFocusNearby,

        isFetching,

        setShowAllTasks: (nextVal: boolean) => setShowAllTasks(nextVal, today),
        openAllTasksFocusUpcoming,
        openAllTasksFocusPast,

        setSelectedDate,
        setVisibleMonth,

        setSectionExpanded,
        toggleCompleted,
        addTask,
        removeTask,
        tasksForSelectedDate,
    }
}
