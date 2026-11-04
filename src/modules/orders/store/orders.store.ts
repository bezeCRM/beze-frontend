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

function reschedule(orders: Order[]): void {
    const settings = useNotificationSettingsStore.getState().settings

    void rescheduleOrderNotifications(orders, settings).catch(error => {
        console.error('[notifications] reschedule failed', error)
    })
}

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

            setOrders: items => {
                set({ orders: items })
                reschedule(items)
            },

            addOrder: async payload => {
                const payloadWithUploadedReferences =
                    await uploadLocalOrderReferences(payload)

                const created = await createOrder(payloadWithUploadedReferences)

                set(state => ({
                    orders: [created, ...state.orders],
                }))

                reschedule(get().orders)

                return created.id
            },

            updateOrder: async (id, payload) => {
                const payloadWithUploadedReferences =
                    await uploadLocalOrderReferences(payload)

                const updated = await updateOrderApi(id, payloadWithUploadedReferences)

                set(state => ({
                    orders: state.orders.map(order =>
                        order.id === id ? updated : order,
                    ),
                }))

                reschedule(get().orders)
            },

            patchOrder: async (id, patch) => {
                const patchWithUploadedReferences =
                    await uploadLocalOrderReferences(patch)

                const updated = await patchOrderApi(id, patchWithUploadedReferences)

                set(state => ({
                    orders: state.orders.map(order =>
                        order.id === id ? updated : order,
                    ),
                }))

                reschedule(get().orders)
            },

            removeOrder: async id => {
                await deleteOrderApi(id)

                set(state => ({
                    orders: state.orders.filter(order => order.id !== id),
                }))

                reschedule(get().orders)
            },

            getById: id => get().orders.find(order => order.id === id),

            clear: () => {
                set({ orders: [] })
                reschedule([])
            },
        }),
        {
            name: STORAGE_KEY,
            version: STORAGE_VERSION,
            storage: createJSONStorage(() => AsyncStorage),

            partialize: state => ({
                orders: state.orders,
            }),

            onRehydrateStorage: () => state => {
                state?.setHasHydrated(true)
            },

            merge: (persisted, current) => {
                const persistedState = (persisted ?? {}) as Partial<OrdersStore>

                return {
                    ...current,
                    ...persistedState,
                    hasHydrated: true,
                }
            },
        },
    ),
)
