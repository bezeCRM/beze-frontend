import { useCallback, useEffect, useRef, useState } from 'react'
import { toApiError } from '@/api'
import { useOrdersStore } from '@/modules/orders/store/orders.store'
import { syncOrders } from '@/modules/orders/sync/syncOrders'

type UseOrdersSyncResult = {
    hasHydrated: boolean
    isSyncing: boolean
    error: string | null
    refetch: () => Promise<void>
}

export function useOrdersSync(): UseOrdersSyncResult {
    const hasHydrated = useOrdersStore(s => s.hasHydrated)

    const [isSyncing, setIsSyncing] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const didAutoSyncRef = useRef(false)

    const runSync = useCallback(async () => {
        if (isSyncing) return
        setIsSyncing(true)
        setError(null)
        try {
            const res = await syncOrders()
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
