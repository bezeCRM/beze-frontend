export const RU_WEEKDAYS = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'] as const
export const RU_MONTHS_TITLE = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
] as const

export const RU_MONTHS_GEN = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
] as const

export const RU_MONTHS_SHORT = [
    'янв',
    'фев',
    'мар',
    'апр',
    'май',
    'июн',
    'июл',
    'авг',
    'сен',
    'окт',
    'ноя',
    'дек',
] as const

export function pad2(n: number) {
    return String(n).padStart(2, '0')
}

export function toDateKey(d: Date) {
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

export function fromDateKey(key: string) {
    const [y, m, d] = key.split('-').map(Number)
    return new Date(y || 2000, (m || 1) - 1, d || 1, 12, 0, 0, 0)
}

export function normalizeToDateKey(input: string) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input

    const m = /^(\d{2})\.(\d{2})\.(\d{2}|\d{4})$/.exec(input)
    if (!m) return input

    const dd = Number(m[1])
    const mm = Number(m[2])
    let yy = Number(m[3])
    if (yy < 100) yy += 2000

    return `${yy}-${pad2(mm)}-${pad2(dd)}`
}

export function addDays(key: string, delta: number) {
    const d = fromDateKey(key)
    d.setDate(d.getDate() + delta)
    return toDateKey(d)
}

export function monthStartKey(key: string) {
    const [y, m] = key.split('-').map(Number)
    return `${y}-${pad2(m || 1)}-01`
}

export function addMonths(monthStart: string, delta: number) {
    const [y, m] = monthStart.split('-').map(Number)
    const d = new Date(y || 2000, (m || 1) - 1, 1, 12, 0, 0, 0)
    d.setMonth(d.getMonth() + delta)
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-01`
}

export function parseDateTime(date: string, time?: string) {
    const t = time || '23:59'
    const [hh, mm] = t.split(':').map(Number)
    const d = fromDateKey(date)
    d.setHours(hh || 0, mm || 0, 0, 0)
    return d
}

export function weekdayMon0(d: Date) {
    // monday as 0
    return (d.getDay() + 6) % 7
}

export function formatMonthTitle(monthStart: string) {
    const d = fromDateKey(monthStart)
    return `${RU_MONTHS_TITLE[d.getMonth()]} ${d.getFullYear()}`
}

export function formatSelectedDayTitle(selected: string, today: string) {
    const d = fromDateKey(selected)
    const day = d.getDate()
    const month = RU_MONTHS_GEN[d.getMonth()]

    if (selected === today) return `${day} ${month}, сегодня`
    if (selected === addDays(today, 1)) return `${day} ${month}, завтра`
    return `${day} ${month}`
}

export function formatTaskMeta(date: string, time?: string) {
    const d = parseDateTime(date, time)
    const wd = RU_WEEKDAYS[weekdayMon0(d)]
    const day = d.getDate()
    const month = RU_MONTHS_SHORT[d.getMonth()]
    const hh = pad2(d.getHours())
    const mm = pad2(d.getMinutes())
    return `${wd}, ${day} ${month}, ${hh}:${mm}`
}
