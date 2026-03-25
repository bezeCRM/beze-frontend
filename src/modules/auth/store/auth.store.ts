import { create } from 'zustand'
import * as authApi from '../api/auth.api'
import {
    clearTokens,
    getAccessToken,
    getRefreshToken,
    saveTokens,
    toApiError,
} from '@/api'
import { getMe } from '@/api/system/me'
import { updateProfileSettings } from '@/modules/profile/api/profile.api'

type AuthState = {
    isBootstrapping: boolean
    isSubmitting: boolean
    error: string | null
    isAuthed: boolean
    isOffline: boolean

    clearError: () => void

    signIn: (login: string, password: string) => Promise<void>
    signUp: (login: string, password: string) => Promise<void>
    signOut: () => Promise<void>
    bootstrap: () => Promise<void>
    validateSession: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
    isBootstrapping: false,
    isSubmitting: false,
    error: null,
    isAuthed: false,
    isOffline: false,

    clearError: () => {
        if (get().error) {
            set({ error: null })
        }
    },

    bootstrap: async () => {
        set({ isBootstrapping: true, error: null })

        const access = await getAccessToken()
        const refresh = await getRefreshToken()

        if (!access || !refresh) {
            await clearTokens()
            set({
                isAuthed: false,
                isOffline: false,
                isBootstrapping: false,
            })
            return
        }

        set({
            isAuthed: true,
            isOffline: false,
            isBootstrapping: false,
        })

        void get().validateSession()
    },

    validateSession: async () => {
        try {
            await getMe()
            set({
                isAuthed: true,
                isOffline: false,
                error: null,
            })
        } catch (e) {
            const apiError = toApiError(e)

            if (apiError.kind === 'network' || apiError.kind === 'timeout') {
                set({
                    isAuthed: true,
                    isOffline: true,
                    error: null,
                })
                return
            }

            if (apiError.kind === 'http' && apiError.status === 401) {
                await clearTokens()
                set({
                    isAuthed: false,
                    isOffline: false,
                    error: null,
                })
                return
            }

            set({
                isAuthed: true,
                isOffline: true,
                error: apiError.message,
            })
        }
    },

    signIn: async (login: string, password: string) => {
        set({ isSubmitting: true, error: null })

        try {
            const tokens = await authApi.login({ login, password })

            await saveTokens({
                accessToken: tokens.access_token,
                refreshToken: tokens.refresh_token,
            })

            set({
                isAuthed: true,
                isOffline: false,
                isSubmitting: false,
            })

            void get().validateSession()
        } catch (e) {
            set({
                error: toApiError(e).message,
                isSubmitting: false,
            })
        }
    },

    signUp: async (login: string, password: string) => {
        set({ isSubmitting: true, error: null })

        try {
            const tokens = await authApi.register({ login, password })

            await saveTokens({
                accessToken: tokens.access_token,
                refreshToken: tokens.refresh_token,
            })

            // сохраняем логин как никнейм по умолчанию
            await updateProfileSettings({ nickname: login })

            set({
                isAuthed: true,
                isOffline: false,
                isSubmitting: false,
            })

            void get().validateSession()
        } catch (e) {
            set({
                error: toApiError(e).message,
                isSubmitting: false,
            })
        }
    },

    signOut: async () => {
        set({ isSubmitting: true, error: null })

        try {
            const refresh = await getRefreshToken()
            if (refresh) {
                await authApi.logout({ refresh_token: refresh })
            }
        } catch {
        } finally {
            await clearTokens()
            set({
                isAuthed: false,
                isOffline: false,
                isSubmitting: false,
            })
        }
    },
}))
