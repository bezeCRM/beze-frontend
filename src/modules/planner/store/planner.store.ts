import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { PlannerTask } from '@/shared/types/types'

type SectionKey = 'upcoming' | 'past'

type State = {
    showAllTasks: boolean
    selectedDate: string // yyyy-mm-dd
    visibleMonth: string // yyyy-mm-dd first day of month

    upcomingExpanded: boolean
    pastExpanded: boolean

    tasks: PlannerTask[]
    completedById: Record<string, true>

    setShowAllTasks: (next: boolean, today: string) => void
    openAllTasksFocusUpcoming: () => void

    setSelectedDate: (date: string) => void
    setVisibleMonth: (monthStart: string) => void

    setSectionExpanded: (section: SectionKey, next: boolean) => void

    addTask: (payload: { title: string; date: string; time?: string }) => void
    toggleCompleted: (taskId: string) => void
    removeTask: (taskId: string) => void

    cleanupArchive: (today: string) => void
    pruneCompletedIds: (validIds: string[]) => void
}

function pad2(n: number) {
    return String(n).padStart(2, '0')
}

function todayKey() {
    const d = new Date()
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

function monthStartKey(dateKey: string) {
    const [y, m] = dateKey.split('-').map(Number)
    return `${y}-${pad2(m || 1)}-01`
}

function toIsoNow() {
    return new Date().toISOString()
}

function makeId() {
    return `task_${Date.now()}_${Math.random().toString(16).slice(2)}`
}

function monthsAgoKey(today: string, months: number) {
    const [y, m, d] = today.split('-').map(Number)
    const base = new Date(y || 2000, (m || 1) - 1, d || 1)
    base.setMonth(base.getMonth() - months)
    return `${base.getFullYear()}-${pad2(base.getMonth() + 1)}-${pad2(base.getDate())}`
}

export const usePlannerStore = create<State>()(
    persist(
        (set, get) => ({
            showAllTasks: false,
            selectedDate: todayKey(),
            visibleMonth: monthStartKey(todayKey()),

            upcomingExpanded: false,
            pastExpanded: false,

            tasks: [],
            completedById: {},

            setShowAllTasks: (next, today) => {
                const selected = get().selectedDate
                const isSelectedPast = selected < today

                set({
                    showAllTasks: next,
                    upcomingExpanded: next ? !isSelectedPast : false,
                    pastExpanded: next ? isSelectedPast : false,
                })
            },

            openAllTasksFocusUpcoming: () => {
                set({
                    showAllTasks: true,
                    upcomingExpanded: true,
                    pastExpanded: false,
                })
            },

            setSelectedDate: date =>
                set({
                    selectedDate: date,
                    visibleMonth: monthStartKey(date),
                }),

            setVisibleMonth: monthStart => set({ visibleMonth: monthStart }),

            setSectionExpanded: (section, next) =>
                set(
                    section === 'upcoming'
                        ? { upcomingExpanded: next }
                        : { pastExpanded: next },
                ),

            addTask: payload => {
                const now = toIsoNow()
                const t: PlannerTask = {
                    id: makeId(),
                    title: payload.title,
                    date: payload.date,
                    time: payload.time,
                    createdAt: now,
                    updatedAt: now,
                }

                set(s => ({ tasks: [t, ...s.tasks] }))
            },

            toggleCompleted: taskId => {
                set(s => {
                    const has = !!s.completedById[taskId]
                    const next = { ...s.completedById }
                    if (has) delete next[taskId]
                    else next[taskId] = true
                    return { completedById: next }
                })
            },

            removeTask: taskId => {
                set(s => {
                    const nextTasks = s.tasks.filter(t => t.id !== taskId)
                    const nextCompleted = { ...s.completedById }
                    if (nextCompleted[taskId]) delete nextCompleted[taskId]
                    return { tasks: nextTasks, completedById: nextCompleted }
                })
            },

            cleanupArchive: today => {
                const threshold = monthsAgoKey(today, 6)
                set(s => {
                    const nextTasks = s.tasks.filter(t => {
                        const isPast = t.date < today
                        if (!isPast) return true
                        return t.date >= threshold
                    })
                    return { tasks: nextTasks }
                })
            },

            pruneCompletedIds: validIds => {
                set(s => {
                    const setValid = new Set(validIds)
                    const next: Record<string, true> = {}
                    for (const k of Object.keys(s.completedById)) {
                        if (setValid.has(k)) next[k] = true
                    }
                    return { completedById: next }
                })
            },
        }),
        {
            name: 'planner-store',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: s => ({
                showAllTasks: s.showAllTasks,
                selectedDate: s.selectedDate,
                visibleMonth: s.visibleMonth,
                upcomingExpanded: s.upcomingExpanded,
                pastExpanded: s.pastExpanded,
                tasks: s.tasks,
                completedById: s.completedById,
            }),
            onRehydrateStorage: () => state => {
                if (!state) return
                state.visibleMonth = monthStartKey(state.selectedDate || todayKey())
            },
        },
    ),
)
