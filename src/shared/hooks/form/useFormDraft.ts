import { useEffect, useMemo, useRef } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { useWatch } from 'react-hook-form'

type MergeDraft<T> = (base: T, draft: T) => T

type Params<T extends Record<string, any>> = {
    enabled?: boolean
    form: UseFormReturn<T>
    defaultValues: T

    draft?: T
    hasHydrated: boolean
    setDraft: (draft: T) => void
    clearPersistedDraft: () => void

    hasMeaningfulValues: (values?: T) => boolean
    mergeDraft?: MergeDraft<T>
    debounceMs?: number
}

function defaultMerge<T extends Record<string, any>>(base: T, draft: T): T {
    return { ...base, ...draft }
}

export function useFormDraft<T extends Record<string, any>>(params: Params<T>) {
    const {
        enabled = true,
        form,
        defaultValues,
        draft,
        hasHydrated,
        setDraft,
        clearPersistedDraft,
        hasMeaningfulValues,
        mergeDraft = defaultMerge,
        debounceMs = 250,
    } = params

    const hydratedApplied = useRef(false)
    const savingPaused = useRef(true)
    const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const watched = useWatch({ control: form.control }) as T

    const hasDraft = useMemo(() => {
        if (!enabled) return false
        return hasMeaningfulValues(watched)
    }, [enabled, watched, hasMeaningfulValues])

    useEffect(() => {
        if (!enabled) return
        if (!hasHydrated) return
        if (hydratedApplied.current) return

        hydratedApplied.current = true

        if (draft) {
            savingPaused.current = true
            form.reset(mergeDraft(defaultValues, draft))
            setTimeout(() => {
                savingPaused.current = false
            }, 0)
        } else {
            savingPaused.current = false
        }
    }, [enabled, hasHydrated, draft, form, defaultValues, mergeDraft])

    useEffect(() => {
        if (!enabled) return
        if (!hasHydrated) return
        if (savingPaused.current) return

        if (saveTimer.current) clearTimeout(saveTimer.current)

        if (!hasMeaningfulValues(watched)) {
            clearPersistedDraft()
            return
        }

        saveTimer.current = setTimeout(() => {
            setDraft(watched)
        }, debounceMs)

        return () => {
            if (saveTimer.current) clearTimeout(saveTimer.current)
        }
    }, [
        enabled,
        hasHydrated,
        watched,
        setDraft,
        clearPersistedDraft,
        hasMeaningfulValues,
        debounceMs,
    ])

    function clearDraft() {
        if (enabled) clearPersistedDraft()
        form.reset(defaultValues)
    }

    return { hasDraft, clearDraft }
}
