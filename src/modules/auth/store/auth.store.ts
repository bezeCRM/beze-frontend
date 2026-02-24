import { create } from 'zustand'
import * as authApi from '../api/auth.api'
import { clearTokens, getRefreshToken, saveTokens, toApiError } from '@/api'
import { getMe } from '@/api/system/me'

type AuthState = {
    isBootstrapping: boolean
    isSubmitting: boolean
    error: string | null
    isAuthed: boolean

    clearError: () => void

    signIn: (login: string, password: string) => Promise<void>
    signUp: (login: string, password: string) => Promise<void>
    signOut: () => Promise<void>
    bootstrap: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
    isBootstrapping: false,
    isSubmitting: false,
    error: null,
    isAuthed: false,

    clearError: () => {
        if (get().error) set({ error: null })
    },

    bootstrap: async () => {
        set({ isBootstrapping: true, error: null })
        try {
            const refresh = await getRefreshToken()
            if (!refresh) {
                set({ isAuthed: false, isBootstrapping: false })
                return
            }

            await getMe()
            set({ isAuthed: true, isBootstrapping: false })
        } catch (e) {
            await clearTokens()
            set({ isAuthed: false, isBootstrapping: false, error: toApiError(e).message })
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

            await getMe()
            set({ isAuthed: true, isSubmitting: false })
        } catch (e) {
            set({ error: toApiError(e).message, isSubmitting: false })
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

            await getMe()
            set({ isAuthed: true, isSubmitting: false })
        } catch (e) {
            set({ error: toApiError(e).message, isSubmitting: false })
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
            set({ isAuthed: false, isSubmitting: false })
        }
    },
}))
