import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

export const ProfileSettingsSchema = z.object({
    profileName: z.string().trim().min(1, 'обязательное поле'),
    nickname: z.string().trim().optional(),
    photoUri: z.string().optional(),
})

export type ProfileSettingsFormValues = z.input<typeof ProfileSettingsSchema>

export function makeProfileSettingsDefaultValues(): ProfileSettingsFormValues {
    return {
        profileName: '',
        nickname: '',
        photoUri: undefined,
    }
}

export function useProfileSettingsFormBase(defaultValues: ProfileSettingsFormValues) {
    const form = useForm<ProfileSettingsFormValues>({
        defaultValues,
        resolver: zodResolver(ProfileSettingsSchema),
        mode: 'onSubmit',
    })

    function setPhotoUri(uri?: string) {
        form.setValue('photoUri', uri || undefined, {
            shouldValidate: true,
            shouldDirty: true,
        })
    }

    return { ...form, setPhotoUri }
}
