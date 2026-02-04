// usePlannerScreen.ts

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

    // важно: нужен экшен для перехода в "все задачи" с раскрытием конкретной секции
    const openAllTasksFocusUpcoming = usePlannerStore(s => s.openAllTasksFocusUpcoming)
    const openAllTasksFocusPast = usePlannerStore(s => (s as any).openAllTasksFocusPast)

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

    // как и раньше: ближайшая задача на/после выбранной даты (среди upcoming)
    const nearbyUpcoming = useMemo(() => {
        if (!upcoming.length) return []
        const idx = upcoming.findIndex(it => it.date >= selectedDate)
        if (idx < 0) return []
        return upcoming.slice(idx)
    }, [upcoming, selectedDate])

    const nextUpcoming = useMemo(() => nearbyUpcoming[0] ?? null, [nearbyUpcoming])
    const nearbyUpcomingCount = useMemo(() => nearbyUpcoming.length, [nearbyUpcoming])

    // новое: прошедшие задачи в диапазоне от selectedDate до today (включительно)
    const nearbyPastInRange = useMemo(() => {
        if (!past.length) return []
        if (selectedDate >= today) return []
        return past.filter(it => it.date >= selectedDate && it.date <= today)
    }, [past, selectedDate, today])

    const nearbyPastCount = useMemo(() => nearbyPastInRange.length, [nearbyPastInRange])

    // самая поздняя прошедшая задача в этом диапазоне (ближайшая к today)
    const nearbyPastTask = useMemo(() => {
        if (!nearbyPastInRange.length) return null

        const sorted = [...nearbyPastInRange].sort((a, b) => {
            const aKey = `${a.date} ${a.time ?? '23:59'}`
            const bKey = `${b.date} ${b.time ?? '23:59'}`
            return aKey.localeCompare(bKey)
        })

        return sorted[sorted.length - 1] ?? null
    }, [nearbyPastInRange])

    // итоговый режим карточки: past, если selectedDate < today и в диапазоне есть прошедшие задачи
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

    // ключевая часть: единая функция нажатия по карточке,
    // которая ведет в "все задачи" и открывает правильную секцию
    const openAllTasksFocusNearby = useMemo(() => {
        return () => {
            if (nearbyMode === 'past') {
                if (typeof openAllTasksFocusPast === 'function') {
                    openAllTasksFocusPast()
                } else {
                    // если в сторе еще нет openAllTasksFocusPast, делаем эквивалент на экране:
                    // включаем "все задачи" и раскрываем past секцию
                    setShowAllTasks(true, today)
                    setSectionExpanded('past', true)
                    setSectionExpanded('upcoming', false)
                }
                return
            }

            openAllTasksFocusUpcoming()
        }
    }, [
        nearbyMode,
        openAllTasksFocusPast,
        openAllTasksFocusUpcoming,
        setShowAllTasks,
        setSectionExpanded,
        today,
    ])

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

        // новое
        nearbyMode,
        nearbyTask,
        nearbyCount,
        openAllTasksFocusNearby,

        // старое можно оставить, если где-то используется
        nextUpcoming,
        nearbyUpcomingCount,

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
