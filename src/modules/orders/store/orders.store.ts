import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Order } from '@/shared/types/types'
import {
    createOrder,
    deleteOrderApi,
    OrderPatchRequest,
    updateOrderApi,
    type OrderUpsertRequest,
    patchOrderApi,
} from '@/modules/orders/api/orders.api'
import { rescheduleOrderNotifications } from '@/modules/notifications/utils/reschedule-notifications'
import { useNotificationSettingsStore } from '@/modules/notifications/store/notification-settings.store'

// Хелпер чтобы не повторять две строки везде
function reschedule(orders: Order[]) {
    const notifSettings = useNotificationSettingsStore.getState().settings
    void rescheduleOrderNotifications(orders, notifSettings)
}

type OrdersStore = {
    orders: Order[]

    hasHydrated: boolean
    setHasHydrated: (v: boolean) => void

    setOrders: (items: Order[]) => void

    addOrder: (payload: OrderUpsertRequest) => Promise<string>
    updateOrder: (id: string, payload: OrderUpsertRequest) => Promise<void>
    patchOrder: (id: string, patch: OrderPatchRequest) => Promise<void>
    removeOrder: (id: string) => Promise<void>

    getById: (id: string) => Order | undefined
    clear: () => void
}

const STORAGE_KEY = 'data.orders'
const STORAGE_VERSION = 1

export const useOrdersStore = create<OrdersStore>()(
    persist(
        (set, get) => ({
            orders: [],

            hasHydrated: false,
            setHasHydrated: v => set({ hasHydrated: v }),

            setOrders: items => set({ orders: items }),

            addOrder: async payload => {
                const created = await createOrder(payload)
                set(state => {
                    const orders = [created, ...state.orders]
                    reschedule(orders)
                    return { orders }
                })
                return created.id
            },

            updateOrder: async (id, payload) => {
                const updated = await updateOrderApi(id, payload)
                set(state => {
                    const orders = state.orders.map(o => (o.id === id ? updated : o))
                    reschedule(orders)
                    return { orders }
                })
            },

            patchOrder: async (id, patch) => {
                const updated = await patchOrderApi(id, patch)
                set(state => {
                    const orders = state.orders.map(o => (o.id === id ? updated : o))
                    reschedule(orders)
                    return { orders }
                })
            },

            removeOrder: async id => {
                await deleteOrderApi(id)
                set(state => {
                    const orders = state.orders.filter(o => o.id !== id)
                    reschedule(orders)
                    return { orders }
                })
            },

            getById: id => get().orders.find(o => o.id === id),

            clear: () => set({ orders: [] }),
        }),
        {
            name: STORAGE_KEY,
            version: STORAGE_VERSION,
            storage: createJSONStorage(() => AsyncStorage),
            partialize: state => ({ orders: state.orders }),
            onRehydrateStorage: () => state => {
                state?.setHasHydrated(true)
            },
            merge: (persisted, current) => {
                const persistedState = (persisted ?? {}) as Partial<OrdersStore>
                return { ...current, ...persistedState, hasHydrated: true }
            },
        },
    ),
)
