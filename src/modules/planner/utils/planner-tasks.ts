import type { PlannerListItem } from '@/shared/types/types'
import { parseDateTime } from './planner-date'

export function splitUpcomingPast(items: PlannerListItem[], today: string) {
    const upcoming: PlannerListItem[] = []
    const past: PlannerListItem[] = []

    for (const it of items) {
        if (it.date < today) past.push(it)
        else upcoming.push(it)
    }

    return { upcoming, past }
}

export function sortUpcoming(items: PlannerListItem[]) {
    return [...items].sort((a, b) => {
        const ad = parseDateTime(a.date, a.time).getTime()
        const bd = parseDateTime(b.date, b.time).getTime()
        return ad - bd
    })
}

export function sortPast(items: PlannerListItem[]) {
    return [...items].sort((a, b) => {
        const ad = parseDateTime(a.date, a.time).getTime()
        const bd = parseDateTime(b.date, b.time).getTime()
        return bd - ad
    })
}

export function firstUpcoming(items: PlannerListItem[], today: string) {
    const sorted = sortUpcoming(items.filter(i => i.date >= today))
    return sorted[0] || null
}

export function uniqueDateSets(items: PlannerListItem[], today: string) {
    const upcoming = new Set<string>()
    const past = new Set<string>()

    for (const it of items) {
        if (it.date < today) past.add(it.date)
        else upcoming.add(it.date)
    }

    return { upcoming, past }
}

export function findUpcomingScrollIndex(
    sortedUpcoming: PlannerListItem[],
    selected: string,
) {
    const selectedTs = parseDateTime(selected, '00:00').getTime()
    const idx = sortedUpcoming.findIndex(it => {
        const ts = parseDateTime(it.date, it.time).getTime()
        return ts >= selectedTs
    })
    return idx >= 0 ? idx : 0
}

export function findPastScrollIndex(sortedPast: PlannerListItem[], selected: string) {
    const selectedTs = parseDateTime(selected, '00:00').getTime()

    let lastIdx = -1
    for (let i = 0; i < sortedPast.length; i++) {
        const ts = parseDateTime(sortedPast[i].date, sortedPast[i].time).getTime()
        if (ts >= selectedTs) lastIdx = i
    }

    return lastIdx >= 0 ? lastIdx : 0
}

export function formatTasksWord(count: number) {
    const rem10 = count % 10
    const rem100 = count % 100

    if (rem100 >= 11 && rem100 <= 14) {
        return 'задач'
    }

    if (rem10 === 1) {
        return 'задача'
    }

    if (rem10 >= 2 && rem10 <= 4) {
        return 'задачи'
    }

    return 'задач'
}
