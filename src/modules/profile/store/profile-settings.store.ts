import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type ProfileSettings = {
    profileName: string
    nickname?: string
    photoUri?: string
    updatedAt: string
}

type ProfileSettingsStore = {
    settings: ProfileSettings
    hasHydrated: boolean
    setHasHydrated: (v: boolean) => void
    updateSettings: (patch: Partial<Omit<ProfileSettings, 'updatedAt'>>) => void
    clearPhoto: () => void
}

const STORAGE_KEY = 'data.profile_settings'
const STORAGE_VERSION = 1

function makeDefaultNickname() {
    const n = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0')
    return `user${n}`
}

function makeDefaultSettings(): ProfileSettings {
    const now = new Date().toISOString()
    return {
        profileName: 'Пользователь beze',
        nickname: makeDefaultNickname(),
        photoUri: undefined,
        updatedAt: now,
    }
}

export const useProfileSettingsStore = create<ProfileSettingsStore>()(
    persist(
        (set, get) => ({
            settings: makeDefaultSettings(),
            hasHydrated: false,
            setHasHydrated: v => set({ hasHydrated: v }),

            updateSettings: patch => {
                const now = new Date().toISOString()
                const current = get().settings

                const profileName =
                    'profileName' in patch
                        ? String(patch.profileName ?? '').trim()
                        : current.profileName

                const nicknameRaw =
                    'nickname' in patch
                        ? String(patch.nickname ?? '').trim()
                        : current.nickname

                const nickname = nicknameRaw
                    ? nicknameRaw.replace(/\s+/g, '_').replace(/_+/g, '_')
                    : undefined

                const photoUri =
                    'photoUri' in patch
                        ? patch.photoUri
                            ? String(patch.photoUri)
                            : undefined
                        : current.photoUri

                set({
                    settings: {
                        ...current,
                        profileName,
                        nickname,
                        photoUri,
                        updatedAt: now,
                    },
                })
            },

            clearPhoto: () => {
                const now = new Date().toISOString()
                set(state => ({
                    settings: { ...state.settings, photoUri: undefined, updatedAt: now },
                }))
            },
        }),
        {
            name: STORAGE_KEY,
            version: STORAGE_VERSION,
            storage: createJSONStorage(() => AsyncStorage),
            partialize: s => ({ settings: s.settings }),
            onRehydrateStorage: () => (state, error) => {
                state?.setHasHydrated(true)
            },
            merge: (persisted, current) => {
                const p = (persisted ?? {}) as Partial<ProfileSettingsStore>
                const merged = {
                    ...current,
                    ...p,
                    settings: { ...current.settings, ...(p.settings ?? {}) },
                    hasHydrated: true,
                }

                // если раньше уже сохранялись пустые значения, подставим новые дефолты
                if (!String(merged.settings.profileName ?? '').trim()) {
                    merged.settings.profileName = current.settings.profileName
                }
                if (!String(merged.settings.nickname ?? '').trim()) {
                    merged.settings.nickname = current.settings.nickname
                }

                return merged
            },
        },
    ),
)
