import { useEffect, useMemo } from 'react'
import { usePlannerStore } from '../store/planner.store'
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

    const setSelectedDate = usePlannerStore(s => s.setSelectedDate)
    const setVisibleMonth = usePlannerStore(s => s.setVisibleMonth)

    const upcomingExpanded = usePlannerStore(s => s.upcomingExpanded)
    const pastExpanded = usePlannerStore(s => s.pastExpanded)
    const setSectionExpanded = usePlannerStore(s => s.setSectionExpanded)

    const toggleCompleted = usePlannerStore(s => s.toggleCompleted)
    const addTask = usePlannerStore(s => s.addTask)
    const removeTask = usePlannerStore(s => s.removeTask)
    const cleanupArchive = usePlannerStore(s => s.cleanupArchive)

    const { upcoming, past, items } = usePlannerItems(today)

    useEffect(() => {
        cleanupArchive(today)
    }, [cleanupArchive, today])

    const marks = useMemo(() => uniqueDateSets(items as any, today), [items, today])

    // ближайшая задача на/после выбранной даты (среди предстоящих относительно today)
    const nearbyUpcoming = useMemo(() => {
        if (!upcoming.length) return []
        const idx = upcoming.findIndex(it => it.date >= selectedDate)
        if (idx < 0) return []
        return upcoming.slice(idx)
    }, [upcoming, selectedDate])

    const next = useMemo(() => nearbyUpcoming[0] ?? null, [nearbyUpcoming])
    const nearbyCount = useMemo(() => nearbyUpcoming.length, [nearbyUpcoming])

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
        nextUpcoming: next,
        nearbyUpcomingCount: nearbyCount,

        setShowAllTasks: (nextVal: boolean) => setShowAllTasks(nextVal, today),
        openAllTasksFocusUpcoming,

        setSelectedDate,
        setVisibleMonth,

        setSectionExpanded,
        toggleCompleted,
        addTask,
        removeTask,
    }
}
