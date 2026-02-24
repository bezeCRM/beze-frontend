import { useCallback } from 'react'
import { useAuthStore } from '../store/auth.store'

type UseAuthResult = {
    isSubmitting: boolean
    isBootstrapping: boolean
    error: string | null
    isAuthed: boolean

    clearError: () => void

    signIn: (login: string, password: string) => Promise<void>
    signUp: (login: string, password: string) => Promise<void>
    signOut: () => Promise<void>
    bootstrap: () => Promise<void>
}

export function useAuth(): UseAuthResult {
    const isSubmitting = useAuthStore(s => s.isSubmitting)
    const isBootstrapping = useAuthStore(s => s.isBootstrapping)
    const error = useAuthStore(s => s.error)
    const isAuthed = useAuthStore(s => s.isAuthed)

    const clearError = useAuthStore(s => s.clearError)

    const signInRaw = useAuthStore(s => s.signIn)
    const signUpRaw = useAuthStore(s => s.signUp)
    const signOutRaw = useAuthStore(s => s.signOut)
    const bootstrapRaw = useAuthStore(s => s.bootstrap)

    const signIn = useCallback(
        async (login: string, password: string) => {
            await signInRaw(login, password)
        },
        [signInRaw],
    )

    const signUp = useCallback(
        async (login: string, password: string) => {
            await signUpRaw(login, password)
        },
        [signUpRaw],
    )

    const signOut = useCallback(async () => {
        await signOutRaw()
    }, [signOutRaw])

    const bootstrap = useCallback(async () => {
        await bootstrapRaw()
    }, [bootstrapRaw])

    return {
        isSubmitting,
        isBootstrapping,
        error,
        clearError,
        isAuthed,
        signIn,
        signUp,
        signOut,
        bootstrap,
    }
}
