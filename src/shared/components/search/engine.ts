import Fuse from 'fuse.js'
import type { IFuseOptions } from 'fuse.js'
import { normalizeText } from './normalize'

type Doc = {
    id: string
    textNorm: string
}

export type SearchEngineOptions<T> = {
    getId: (item: T) => string
    getText: (item: T) => string
    fuseOptions?: IFuseOptions<Doc>
}

export type SearchConfig = {
    minQueryLength?: number
    returnAllWhenQueryTooShort?: boolean
    limit?: number
    useFuzzyFallback?: boolean
    fuzzyTriggerBelow?: number
    fuzzyLimit?: number
}

export type SearchEngine<T> = {
    items: T[]
    itemsById: Map<string, T>
    docs: Doc[]
    fuse: Fuse<Doc>
    cache: Map<string, string[]>
}

const defaultFuseOptions: IFuseOptions<Doc> = {
    keys: ['textNorm'],
    includeScore: true,
    threshold: 0.35,
    distance: 120,
    ignoreLocation: true,
    minMatchCharLength: 3,
}

export function buildSearchEngine<T>(
    items: T[],
    options: SearchEngineOptions<T>,
): SearchEngine<T> {
    const itemsById = new Map<string, T>()
    const docs: Doc[] = []

    for (const item of items) {
        const id = options.getId(item)
        const text = options.getText(item)
        const textNorm = normalizeText(text)

        itemsById.set(id, item)
        docs.push({ id, textNorm })
    }

    const fuse = new Fuse(docs, { ...defaultFuseOptions, ...options.fuseOptions })

    return {
        items,
        itemsById,
        docs,
        fuse,
        cache: new Map(),
    }
}

function uniqAppend(target: string[], ids: string[], limit: number) {
    const set = new Set(target)
    for (const id of ids) {
        if (target.length >= limit) return
        if (set.has(id)) continue
        set.add(id)
        target.push(id)
    }
}

export function runSearch<T>(
    engine: SearchEngine<T>,
    rawQuery: string,
    config: SearchConfig = {},
): T[] {
    const minQueryLength = config.minQueryLength ?? 3
    const returnAllWhenQueryTooShort = config.returnAllWhenQueryTooShort ?? true
    const limit = config.limit ?? 80

    const useFuzzyFallback = config.useFuzzyFallback ?? true
    const fuzzyTriggerBelow = config.fuzzyTriggerBelow ?? 10
    const fuzzyLimit = config.fuzzyLimit ?? 40

    const queryNorm = normalizeText(rawQuery)

    if (queryNorm.length < minQueryLength) {
        return returnAllWhenQueryTooShort ? engine.items.slice(0, limit) : []
    }

    const cached = engine.cache.get(queryNorm)
    if (cached) {
        const out: T[] = []
        for (const id of cached) {
            const item = engine.itemsById.get(id)
            if (item) out.push(item)
            if (out.length >= limit) break
        }
        return out
    }

    const substringIds: string[] = []
    for (const doc of engine.docs) {
        if (substringIds.length >= limit) break
        if (doc.textNorm.includes(queryNorm)) {
            substringIds.push(doc.id)
        }
    }

    const finalIds = [...substringIds]

    if (useFuzzyFallback && finalIds.length < fuzzyTriggerBelow) {
        const fuzzy = engine.fuse.search(queryNorm, { limit: fuzzyLimit })
        const fuzzyIds = fuzzy.map(r => r.item.id)
        uniqAppend(finalIds, fuzzyIds, limit)
    }

    engine.cache.set(queryNorm, finalIds)

    const result: T[] = []
    for (const id of finalIds) {
        const item = engine.itemsById.get(id)
        if (item) result.push(item)
        if (result.length >= limit) break
    }

    return result
}
