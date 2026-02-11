import type { SortOption } from './types'

export type SortComparator<T> = (a: T, b: T) => number
export type SortMap<T, Id extends string> = Record<Id, SortComparator<T>>

export function stableSort<T>(items: T[], cmp: SortComparator<T>) {
    return items
        .map((item, index) => ({ item, index }))
        .sort((a, b) => {
            const res = cmp(a.item, b.item)
            return res !== 0 ? res : a.index - b.index
        })
        .map(x => x.item)
}

export function applySort<T, Id extends string>(
    items: T[],
    sortId: Id,
    comparators: SortMap<T, Id>,
) {
    const cmp = comparators[sortId]
    return stableSort(items, cmp)
}

export function makeNumberComparator<T>(
    getValue: (x: T) => number,
    dir: 'asc' | 'desc',
): SortComparator<T> {
    const k = dir === 'asc' ? 1 : -1
    return (a, b) => (getValue(a) - getValue(b)) * k
}

type Dateish = string | Date | null | undefined

function toLocalDateTimestamp(v: Dateish) {
    if (!v) return NaN
    if (v instanceof Date) return v.getTime()

    // поддержка yyyy-mm-dd как локальной даты
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
        const [y, m, d] = v.split('-').map(Number)
        const dt = new Date()
        dt.setFullYear(y, (m || 1) - 1, d || 1)
        dt.setHours(0, 0, 0, 0)
        return dt.getTime()
    }

    const parsed = new Date(v)
    return parsed.getTime()
}

export function makeDateComparator<T>(
    getValue: (x: T) => Dateish,
    dir: 'asc' | 'desc',
): SortComparator<T> {
    const k = dir === 'asc' ? 1 : -1
    return (a, b) => {
        const ta = toLocalDateTimestamp(getValue(a))
        const tb = toLocalDateTimestamp(getValue(b))

        const aBad = Number.isNaN(ta)
        const bBad = Number.isNaN(tb)
        if (aBad && bBad) return 0
        if (aBad) return 1
        if (bBad) return -1

        return (ta - tb) * k
    }
}

export function getOptionLabel<Id extends string>(
    options: SortOption<Id>[],
    value: Id,
    fallback = 'Сортировка',
) {
    return options.find(o => o.id === value)?.label ?? fallback
}
