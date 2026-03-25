import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import {
    ProfileSettings,
    getProfileSettings,
    updateProfileSettings,
    type ProfileSettingsUpsertRequest,
} from '@/modules/profile/api/profile.api'

type ProfileSettingsPatch = Partial<Omit<ProfileSettings, 'ownerId' | 'updatedAt'>>

type State = {
    settings: ProfileSettings | null
    hasHydrated: boolean
    isFetching: boolean

    setHasHydrated: (v: boolean) => void

    fetchSettings: () => Promise<void>
    updateSettings: (patch: ProfileSettingsPatch) => Promise<void>
    clearPhoto: () => Promise<void>

    clear: () => void
}

const STORAGE_KEY = 'data.profile_settings'
const STORAGE_VERSION = 2

function makeDefaultSettings(): ProfileSettings {
    return {
        ownerId: '',
        profileName: 'Пользователь beze',
        nickname: undefined,
        photoUri: undefined,
        updatedAt: new Date().toISOString(),
    }
}

function normalizeSettingsPatch(
    current: ProfileSettings,
    patch: ProfileSettingsPatch,
): ProfileSettingsUpsertRequest {
    const payload: ProfileSettingsUpsertRequest = {}

    if ('profileName' in patch) {
        const trimmed = String(patch.profileName ?? '').trim()
        if (trimmed) payload.profileName = trimmed
    }

    if ('nickname' in patch) {
        const trimmed = String(patch.nickname ?? '').trim()
        if (trimmed) {
            payload.nickname = trimmed.replace(/\s+/g, '_').replace(/_+/g, '_')
        } else {
            payload.nickname = undefined
        }
    }

    if ('photoUri' in patch) {
        payload.photoUri = patch.photoUri ? String(patch.photoUri) : undefined
    }

    return payload
}

export const useProfileSettingsStore = create<State>()(
    persist(
        (set, get) => ({
            settings: makeDefaultSettings(),
            hasHydrated: false,
            isFetching: false,

            setHasHydrated: v => set({ hasHydrated: v }),

            fetchSettings: async () => {
                set({ isFetching: true })
                try {
                    const settings = await getProfileSettings()
                    set({ settings, isFetching: false })
                } catch (e) {
                    set({ isFetching: false })
                    throw e
                }
            },

            updateSettings: async patch => {
                const current = get().settings
                if (!current) return

                const payload = normalizeSettingsPatch(current, patch)

                const updated = await updateProfileSettings(payload)
                set({ settings: updated })
            },

            clearPhoto: async () => {
                const current = get().settings
                if (!current) return

                const updated = await updateProfileSettings({ photoUri: undefined })
                set({ settings: updated })
            },

            clear: () =>
                set({
                    settings: makeDefaultSettings(),
                    isFetching: false,
                }),
        }),
        {
            name: STORAGE_KEY,
            version: STORAGE_VERSION,
            storage: createJSONStorage(() => AsyncStorage),

            partialize: state => ({
                settings: state.settings,
            }),

            migrate: (persistedState: any, version: number) => {
                // Миграция с версии 1 на версию 2
                if (version === 1) {
                    const oldSettings = persistedState?.settings
                    if (oldSettings && typeof oldSettings === 'object') {
                        // Добавляем ownerId (пустой, будет заполнен с сервера)
                        return {
                            settings: {
                                ownerId: '',
                                profileName:
                                    oldSettings.profileName || 'Пользователь beze',
                                nickname: oldSettings.nickname,
                                photoUri: oldSettings.photoUri,
                                updatedAt:
                                    oldSettings.updatedAt || new Date().toISOString(),
                            },
                        }
                    }
                }
                return persistedState
            },

            onRehydrateStorage: () => (state, error) => {
                if (error) {
                    // можно добавить логгер
                }
                if (!state) return

                state.setHasHydrated(true)
            },

            merge: (persisted, current) => {
                const persistedState = (persisted ?? {}) as Partial<State>
                return {
                    ...current,
                    ...persistedState,
                    hasHydrated: true,
                }
            },
        },
    ),
)
