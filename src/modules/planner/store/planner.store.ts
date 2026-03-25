import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { PlannerTask } from '@/shared/types/types'
import {
    createPlannerTask,
    deletePlannerTaskApi,
    getPlannerTasks,
    updatePlannerTaskApi,
} from '@/modules/planner/api/planner.api'

type SectionKey = 'upcoming' | 'past'

type PlannerTaskUpsertInput = {
    title: string
    date: string
    time?: string
}

type PlannerTaskPatch = Partial<PlannerTaskUpsertInput>

type State = {
    showAllTasks: boolean
    selectedDate: string
    visibleMonth: string

    upcomingExpanded: boolean
    pastExpanded: boolean

    tasks: PlannerTask[]
    completedById: Record<string, true>

    hasHydrated: boolean
    isFetching: boolean

    setHasHydrated: (v: boolean) => void

    setShowAllTasks: (next: boolean, today: string) => void
    openAllTasksFocusUpcoming: () => void
    openAllTasksFocusPast: () => void

    setSelectedDate: (date: string) => void
    setVisibleMonth: (monthStart: string) => void

    setSectionExpanded: (section: SectionKey, next: boolean) => void

    setTasks: (items: PlannerTask[]) => void
    fetchTasksInRange: (params: { from: string; to: string }) => Promise<void>

    addTask: (payload: PlannerTaskUpsertInput) => Promise<string>
    updateTask: (taskId: string, patch: PlannerTaskPatch) => Promise<void>
    toggleCompleted: (taskId: string) => void
    removeTask: (taskId: string) => Promise<void>

    cleanupArchive: (today: string) => void
    pruneCompletedIds: (validIds: string[]) => void

    getById: (taskId: string) => PlannerTask | undefined
    clear: () => void
}

const STORAGE_KEY = 'planner-store'
const STORAGE_VERSION = 2

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

function monthsAgoKey(today: string, months: number) {
    const [y, m, d] = today.split('-').map(Number)
    const base = new Date(y || 2000, (m || 1) - 1, d || 1)
    base.setMonth(base.getMonth() - months)
    return `${base.getFullYear()}-${pad2(base.getMonth() + 1)}-${pad2(base.getDate())}`
}

function addMonthsToDateKey(dateKey: string, diff: number) {
    const [y, m] = dateKey.split('-').map(Number)
    const base = new Date(y || 2000, (m || 1) - 1 + diff, 1)
    return `${base.getFullYear()}-${pad2(base.getMonth() + 1)}-01`
}

function monthEndKey(monthStart: string) {
    const [y, m] = monthStart.split('-').map(Number)
    const end = new Date(y || 2000, m || 1, 0)
    return `${end.getFullYear()}-${pad2(end.getMonth() + 1)}-${pad2(end.getDate())}`
}

function normalizeTaskUpsertPayload(
    input: PlannerTaskUpsertInput,
): PlannerTaskUpsertInput {
    const title = input.title.trim()
    const time = input.time?.trim()

    return {
        title,
        date: input.date,
        ...(time ? { time } : {}),
    }
}

function normalizeTaskPatchToApiPayload(
    current: PlannerTask,
    patch: PlannerTaskPatch,
): PlannerTaskUpsertInput {
    const merged: PlannerTaskUpsertInput = {
        title: patch.title ?? current.title,
        date: patch.date ?? current.date,
        time: 'time' in patch ? patch.time : current.time,
    }

    return normalizeTaskUpsertPayload(merged)
}

function dedupeTasks(items: PlannerTask[]): PlannerTask[] {
    const map = new Map<string, PlannerTask>()

    for (const item of items) {
        map.set(item.id, item)
    }

    return Array.from(map.values())
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

            hasHydrated: false,
            isFetching: false,

            setHasHydrated: v => set({ hasHydrated: v }),

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

            openAllTasksFocusPast: () => {
                set({
                    showAllTasks: true,
                    upcomingExpanded: false,
                    pastExpanded: true,
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

            setTasks: items => set({ tasks: dedupeTasks(items) }),

            fetchTasksInRange: async ({ from, to }) => {
                set({ isFetching: true })
                try {
                    const items = await getPlannerTasks({ from, to })
                    set(state => {
                        const nextTasks = dedupeTasks(items)
                        const validIds = new Set(nextTasks.map(t => t.id))
                        const nextCompleted: Record<string, true> = {}

                        for (const taskId of Object.keys(state.completedById)) {
                            if (validIds.has(taskId)) nextCompleted[taskId] = true
                        }

                        return {
                            tasks: nextTasks,
                            completedById: nextCompleted,
                            isFetching: false,
                        }
                    })
                } catch (e) {
                    set({ isFetching: false })
                    throw e
                }
            },

            addTask: async payload => {
                const normalized = normalizeTaskUpsertPayload(payload)
                const created = await createPlannerTask(normalized)

                set(state => ({
                    tasks: dedupeTasks([created, ...state.tasks]),
                }))

                return created.id
            },

            updateTask: async (taskId, patch) => {
                const current = get().tasks.find(t => t.id === taskId)
                if (!current) return

                const payload = normalizeTaskPatchToApiPayload(current, patch)
                const updated = await updatePlannerTaskApi(taskId, payload)

                set(state => ({
                    tasks: state.tasks.map(t => (t.id === taskId ? updated : t)),
                }))
            },

            toggleCompleted: taskId => {
                set(state => {
                    const has = !!state.completedById[taskId]
                    const next = { ...state.completedById }

                    if (has) delete next[taskId]
                    else next[taskId] = true

                    return { completedById: next }
                })
            },

            removeTask: async taskId => {
                await deletePlannerTaskApi(taskId)

                set(state => {
                    const nextTasks = state.tasks.filter(t => t.id !== taskId)
                    const nextCompleted = { ...state.completedById }

                    if (nextCompleted[taskId]) delete nextCompleted[taskId]

                    return {
                        tasks: nextTasks,
                        completedById: nextCompleted,
                    }
                })
            },

            cleanupArchive: today => {
                const threshold = monthsAgoKey(today, 6)

                set(state => {
                    const nextTasks = state.tasks.filter(t => {
                        const isPast = t.date < today
                        if (!isPast) return true
                        return t.date >= threshold
                    })

                    const validIds = new Set(nextTasks.map(t => t.id))
                    const nextCompleted: Record<string, true> = {}

                    for (const taskId of Object.keys(state.completedById)) {
                        if (validIds.has(taskId)) nextCompleted[taskId] = true
                    }

                    return {
                        tasks: nextTasks,
                        completedById: nextCompleted,
                    }
                })
            },

            pruneCompletedIds: validIds => {
                set(state => {
                    const setValid = new Set(validIds)
                    const next: Record<string, true> = {}

                    for (const k of Object.keys(state.completedById)) {
                        if (setValid.has(k)) next[k] = true
                    }

                    return { completedById: next }
                })
            },

            getById: taskId => get().tasks.find(t => t.id === taskId),

            clear: () =>
                set({
                    showAllTasks: false,
                    selectedDate: todayKey(),
                    visibleMonth: monthStartKey(todayKey()),
                    upcomingExpanded: false,
                    pastExpanded: false,
                    tasks: [],
                    completedById: {},
                    isFetching: false,
                }),
        }),
        {
            name: STORAGE_KEY,
            version: STORAGE_VERSION,
            storage: createJSONStorage(() => AsyncStorage),

            partialize: state => ({
                showAllTasks: state.showAllTasks,
                selectedDate: state.selectedDate,
                visibleMonth: state.visibleMonth,
                upcomingExpanded: state.upcomingExpanded,
                pastExpanded: state.pastExpanded,
                tasks: state.tasks,
                completedById: state.completedById,
            }),

            onRehydrateStorage: () => (state, error) => {
                if (error) {
                    // тут можно добавить логгер
                }
                if (!state) return

                const date = state.selectedDate || todayKey()
                state.setVisibleMonth(monthStartKey(date))
                state.setHasHydrated(true)
            },

            merge: (persisted, current) => {
                const persistedState = (persisted ?? {}) as Partial<State>
                return { ...current, ...persistedState, hasHydrated: true }
            },
        },
    ),
)

export { addMonthsToDateKey, monthEndKey }
