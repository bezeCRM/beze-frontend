import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

// ─── Option types ────────────────────────────────────────────────────────────

export type EveningReminderOption = 'disabled' | '18:00' | '20:00' | '22:00'
export type CookingReminderOption = 'disabled' | '3h' | '4h' | '5h' | '6h' | '8h'
export type PickupReminderOption = 'disabled' | '30min' | '1h' | '2h'

export type NotificationSettings = {
    /** Напоминание накануне вечером — фиксированное время */
    eveningReminder: EveningReminderOption
    /** Напомнить начать готовить — за N часов до выдачи */
    cookingReminder: CookingReminderOption
    /** Напомнить перед выдачей — за N до выдачи */
    pickupReminder: PickupReminderOption
}

// ─── Option lists (для UI) ───────────────────────────────────────────────────

export const EVENING_REMINDER_OPTIONS: { value: EveningReminderOption; label: string }[] =
    [
        { value: 'disabled', label: 'Откл.' },
        { value: '18:00', label: '18:00' },
        { value: '20:00', label: '20:00' },
        { value: '22:00', label: '22:00' },
    ]

export const COOKING_REMINDER_OPTIONS: { value: CookingReminderOption; label: string }[] =
    [
        { value: 'disabled', label: 'Откл.' },
        { value: '3h', label: 'за 3 ч' },
        { value: '4h', label: 'за 4 ч' },
        { value: '5h', label: 'за 5 ч' },
        { value: '6h', label: 'за 6 ч' },
        { value: '8h', label: 'за 8 ч' },
    ]

export const PICKUP_REMINDER_OPTIONS: { value: PickupReminderOption; label: string }[] = [
    { value: 'disabled', label: 'Откл.' },
    { value: '30min', label: 'за 30 мин' },
    { value: '1h', label: 'за 1 ч' },
    { value: '2h', label: 'за 2 ч' },
]

// ─── Defaults ────────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS: NotificationSettings = {
    eveningReminder: 'disabled',
    cookingReminder: 'disabled',
    pickupReminder: 'disabled',
}

// ─── Store ───────────────────────────────────────────────────────────────────

type State = {
    settings: NotificationSettings
    hasHydrated: boolean

    setHasHydrated: (v: boolean) => void
    updateSettings: (patch: Partial<NotificationSettings>) => void
    reset: () => void
}

export const useNotificationSettingsStore = create<State>()(
    persist(
        set => ({
            settings: DEFAULT_SETTINGS,
            hasHydrated: false,

            setHasHydrated: v => set({ hasHydrated: v }),

            updateSettings: patch =>
                set(state => ({
                    settings: { ...state.settings, ...patch },
                })),

            reset: () => set({ settings: DEFAULT_SETTINGS }),
        }),
        {
            name: 'data.notification_settings',
            version: 1,
            storage: createJSONStorage(() => AsyncStorage),
            partialize: state => ({ settings: state.settings }),

            onRehydrateStorage: () => state => {
                state?.setHasHydrated(true)
            },
        },
    ),
)
