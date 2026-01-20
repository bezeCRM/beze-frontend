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
    const idx = sortedUpcoming.findIndex(it => it.date >= selected)
    return idx >= 0 ? idx : 0
}

export function findPastScrollIndex(sortedPast: PlannerListItem[], selected: string) {
    // past list is sorted desc (closest to today is first)
    let lastIdx = -1
    for (let i = 0; i < sortedPast.length; i++) {
        if (sortedPast[i].date >= selected) lastIdx = i
    }
    if (lastIdx >= 0) return lastIdx
    return 0
}
