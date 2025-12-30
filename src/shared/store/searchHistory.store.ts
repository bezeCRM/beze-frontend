import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type SearchContext = 'products' | 'orders'

type State = {
    recent: Record<SearchContext, string[]>
    addQuery: (ctx: SearchContext, query: string) => void
    clear: (ctx: SearchContext) => void
}

function normalizeQuery(q: string) {
    return q.trim().replace(/\s+/g, ' ')
}

export const useSearchHistoryStore = create<State>()(
    persist(
        (set, get) => ({
            recent: { products: [], orders: [] },

            addQuery: (ctx, query) => {
                const q = normalizeQuery(query)
                if (q.length < 3) return

                const prev = get().recent[ctx]
                const withoutDup = prev.filter(x => x.toLowerCase() !== q.toLowerCase())
                const next = [q, ...withoutDup].slice(0, 5)

                set(state => ({
                    recent: { ...state.recent, [ctx]: next },
                }))
            },

            clear: ctx => {
                set(state => ({
                    recent: { ...state.recent, [ctx]: [] },
                }))
            },
        }),
        {
            name: 'search-history-v1',
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
)
