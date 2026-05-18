import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Order } from '@/shared/types/types'
import {
    createOrder,
    deleteOrderApi,
    updateOrderApi,
    patchOrderApi,
    uploadOrderReference,
    type OrderPatchRequest,
    type OrderUpsertRequest,
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

function isLocalPhotoUri(uri?: string): uri is string {
    if (!uri) return false

    return (
        uri.startsWith('file://') ||
        uri.startsWith('content://') ||
        uri.startsWith('ph://') ||
        uri.startsWith('blob:')
    )
}

async function uploadLocalOrderReferences<
    T extends { references?: { uri: string }[] | null },
>(payload: T): Promise<T> {
    if (!('references' in payload)) return payload

    const references = payload.references

    if (references == null) return payload

    const uploadedReferences = await Promise.all(
        references.map(async reference => {
            if (!isLocalPhotoUri(reference.uri)) {
                return reference
            }

            const uri = await uploadOrderReference(reference.uri)
            return { ...reference, uri }
        }),
    )

    return {
        ...payload,
        references: uploadedReferences,
    }
}

export const useOrdersStore = create<OrdersStore>()(
    persist(
        (set, get) => ({
            orders: [],

            hasHydrated: false,
            setHasHydrated: v => set({ hasHydrated: v }),

            setOrders: items => set({ orders: items }),

            addOrder: async payload => {
                const payloadWithUploadedReferences =
                    await uploadLocalOrderReferences(payload)
                const created = await createOrder(payloadWithUploadedReferences)

                set(state => {
                    const orders = [created, ...state.orders]
                    reschedule(orders)
                    return { orders }
                })

                return created.id
            },

            updateOrder: async (id, payload) => {
                const payloadWithUploadedReferences =
                    await uploadLocalOrderReferences(payload)
                const updated = await updateOrderApi(id, payloadWithUploadedReferences)

                set(state => {
                    const orders = state.orders.map(o => (o.id === id ? updated : o))
                    reschedule(orders)
                    return { orders }
                })
            },

            patchOrder: async (id, patch) => {
                const patchWithUploadedReferences =
                    await uploadLocalOrderReferences(patch)
                const updated = await patchOrderApi(id, patchWithUploadedReferences)

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
