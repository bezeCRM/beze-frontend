import { fromDateKey, toDateKey, weekdayMon0 } from './planner-date'

export type CalendarCell = {
    dateKey: string
    day: number
    inMonth: boolean
}

export function buildMonthGrid(monthStart: string) {
    const first = fromDateKey(monthStart)
    const y = first.getFullYear()
    const m = first.getMonth()

    const monthFirst = new Date(y, m, 1, 12, 0, 0, 0)
    const offset = weekdayMon0(monthFirst) // monday start

    const start = new Date(y, m, 1 - offset, 12, 0, 0, 0)
    const cells: CalendarCell[] = []

    for (let i = 0; i < 42; i++) {
        const d = new Date(start)
        d.setDate(start.getDate() + i)

        cells.push({
            dateKey: toDateKey(d),
            day: d.getDate(),
            inMonth: d.getMonth() === m,
        })
    }

    return cells
}
