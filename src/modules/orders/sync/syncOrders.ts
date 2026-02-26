import { toApiError } from '@/api'
import { getOrders } from '@/modules/orders/api/orders.api'
import { useOrdersStore } from '@/modules/orders/store/orders.store'

export async function syncOrders(): Promise<{ ok: true } | { ok: false; error: string }> {
    try {
        const orders = await getOrders()
        useOrdersStore.getState().setOrders(orders)
        return { ok: true }
    } catch (e) {
        return { ok: false, error: toApiError(e).message }
    }
}
