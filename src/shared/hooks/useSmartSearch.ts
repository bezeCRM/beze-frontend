import { useMemo } from 'react'
import { useDebouncedValue } from './useDebouncedValue'
import {
    buildSearchEngine,
    runSearch,
    SearchConfig,
    SearchEngineOptions,
} from '../components/search/engine'

export type UseSmartSearchArgs<T> = {
    items: T[]
    query: string
    debounceMs?: number
    engineOptions: SearchEngineOptions<T>
    searchConfig?: SearchConfig
}

export function useSmartSearch<T>({
    items,
    query,
    debounceMs = 200,
    engineOptions,
    searchConfig,
}: UseSmartSearchArgs<T>): T[] {
    const debouncedQuery = useDebouncedValue(query, debounceMs)

    const engine = useMemo(() => {
        return buildSearchEngine(items, engineOptions)
    }, [items, engineOptions])

    const result = useMemo(() => {
        return runSearch(engine, debouncedQuery, searchConfig)
    }, [engine, debouncedQuery, searchConfig])

    return result
}
