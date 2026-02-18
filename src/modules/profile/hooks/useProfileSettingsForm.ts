import { useEffect, useRef } from 'react'
import type { ProfileSettings } from '../store/profile-settings.store'
import {
    makeProfileSettingsDefaultValues,
    useProfileSettingsFormBase,
    type ProfileSettingsFormValues,
} from './useProfileSettingsFormBase'

export function useProfileSettingsForm(settings?: ProfileSettings | null) {
    const form = useProfileSettingsFormBase(makeProfileSettingsDefaultValues())
    const lastUpdatedAt = useRef<string | null>(null)

    useEffect(() => {
        if (!settings) return
        if (lastUpdatedAt.current === settings.updatedAt) return
        lastUpdatedAt.current = settings.updatedAt

        const values: ProfileSettingsFormValues = {
            profileName: settings.profileName ?? '',
            nickname: settings.nickname ?? '',
            photoUri: settings.photoUri,
        }

        form.reset(values)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [settings?.updatedAt])

    return form
}
