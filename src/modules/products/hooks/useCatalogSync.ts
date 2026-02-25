import { useCallback, useEffect, useRef, useState } from 'react'
import { toApiError } from '@/api'
import { useCategoryStore } from '@/modules/products/store/categories.store'
import { useProductsStore } from '@/modules/products/store/products.store'
import { syncCatalog } from '@/modules/products/sync/syncCatalog'

type UseCatalogSyncResult = {
    hasHydrated: boolean
    isSyncing: boolean
    error: string | null
    refetch: () => Promise<void>
}

export function useCatalogSync(): UseCatalogSyncResult {
    const catHydrated = useCategoryStore(s => s.hasHydrated)
    const prodHydrated = useProductsStore(s => s.hasHydrated)
    const hasHydrated = catHydrated && prodHydrated

    const [isSyncing, setIsSyncing] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const didAutoSyncRef = useRef(false)

    const runSync = useCallback(async () => {
        if (isSyncing) return
        setIsSyncing(true)
        setError(null)
        try {
            const res = await syncCatalog()
            if (!res.ok) setError(res.error)
        } catch (e) {
            setError(toApiError(e).message)
        } finally {
            setIsSyncing(false)
        }
    }, [isSyncing])

    useEffect(() => {
        if (!hasHydrated) return
        if (didAutoSyncRef.current) return
        didAutoSyncRef.current = true
        void runSync()
    }, [hasHydrated, runSync])

    const refetch = useCallback(async () => {
        await runSync()
    }, [runSync])

    return { hasHydrated, isSyncing, error, refetch }
}
