import { useCallback } from 'react'
import {
    Image,
    Linking,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import * as MailComposer from 'expo-mail-composer'

import ScreenContainer from '@/shared/components/layout/screen-container'
import SectionCard from '@/shared/ui/section/section-card'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'
import { useTheme } from '@/shared/theme/useTheme'

import {
    InternalHeaderTitle,
    InternalHeaderTopBar,
} from '@/shared/components/headers/internal-header'

import { ToastViewport, useToast } from '@/shared/components/toast/toast-provider'
import { makeOnInvalidToast } from '@/shared/components/toast/make-on-invalid-toast'

import { pickImagesFromLibrary } from '@/shared/components/media'
import { useProfileSettingsStore } from '@/modules/profile/store/profile-settings.store'
import { useProfileSettingsForm } from '@/modules/profile/hooks/useProfileSettingsForm'
import type { ProfileSettingsFormValues } from '@/modules/profile/hooks/useProfileSettingsFormBase'
import { TOAST_SCOPES } from '@/shared/components/toast/scopes'

export default function SettingsScreen() {
    const { bottom } = useSafeAreaInsets()
    const styles = useStyles()
    const colors = useTheme().theme.colors

    const navigation = useNavigation<any>()
    const { show } = useToast()

    const settings = useProfileSettingsStore(s => s.settings)
    const updateSettings = useProfileSettingsStore(s => s.updateSettings)

    const form = useProfileSettingsForm(settings)

    const {
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        setPhotoUri,
    } = form

    const profileName = watch('profileName')
    const nickname = watch('nickname')
    const photoUri = watch('photoUri')

    const handlePickPhoto = useCallback(async () => {
        const picked = await pickImagesFromLibrary({ limit: 1 })
        const uri = picked?.[0]?.uri
        if (!uri) return
        setPhotoUri(uri)
    }, [setPhotoUri])

    const onValid = (values: ProfileSettingsFormValues) => {
        updateSettings({
            profileName: values.profileName,
            nickname: values.nickname,
            photoUri: values.photoUri,
        })

        navigation.goBack()

        requestAnimationFrame(() => {
            show('Изменения сохранены', 'success', { scope: TOAST_SCOPES.Profile })
        })
    }

    const onInvalid = makeOnInvalidToast<
        ProfileSettingsFormValues,
        readonly ['profileName']
    >({
        required: ['profileName'] as const,
        labels: { profileName: 'Имя профиля' },
        show: msg => show(msg, 'error', { scope: TOAST_SCOPES.Settings }),
    })

    const EMAIL = 'liquoree@list.ru'

    async function openSupportEmail() {
        const subject = 'Сообщить о проблеме'
        const body = 'Опишите проблему:\n\n'

        const available = await MailComposer.isAvailableAsync()
        if (available) {
            await MailComposer.composeAsync({
                recipients: [EMAIL],
                subject,
                body,
            })
            return
        }

        const url = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
        const can = await Linking.canOpenURL(url)
        if (can) await Linking.openURL(url)
    }

    return (
        <ScreenContainer>
            <View style={styles.container}>
                <View style={styles.stickyTopBar}>
                    <InternalHeaderTopBar
                        onBack={() => navigation.goBack()}
                        showAction={true}
                        onActionPress={handleSubmit(onValid, onInvalid)}
                        actionText="Сохранить"
                    />
                </View>

                <KeyboardAwareScrollView
                    style={styles.scroll}
                    contentContainerStyle={{ paddingBottom: bottom + 30 }}
                    enableOnAndroid
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    enableAutomaticScroll
                    extraScrollHeight={80}
                    extraHeight={80}
                    enableResetScrollToCoords={false}
                    keyboardDismissMode="on-drag"
                >
                    <View style={styles.titleWrap}>
                        <InternalHeaderTitle title="Настройки" />
                    </View>

                    <View style={styles.formList}>
                        <SectionCard title="Имя профиля" required>
                            <TextInput
                                value={profileName}
                                onChangeText={t =>
                                    setValue('profileName', t, { shouldValidate: true })
                                }
                                placeholder="Ваше имя"
                                placeholderTextColor={colors.textMuted}
                                style={[
                                    styles.input,
                                    errors.profileName && styles.inputError,
                                ]}
                                returnKeyType="done"
                            />
                        </SectionCard>

                        <SectionCard title="Никнейм">
                            <TextInput
                                value={nickname}
                                onChangeText={t =>
                                    setValue('nickname', t, { shouldValidate: true })
                                }
                                placeholder="Например, bezeUser"
                                placeholderTextColor={colors.textMuted}
                                style={styles.input}
                                returnKeyType="done"
                            />
                        </SectionCard>

                        <SectionCard title="Фото профиля">
                            <Pressable
                                style={styles.photoRow}
                                onPress={() => void handlePickPhoto()}
                            >
                                <View style={styles.photoCircle}>
                                    {photoUri ? (
                                        <Image
                                            source={{ uri: photoUri }}
                                            style={styles.photoImage}
                                        />
                                    ) : (
                                        <View style={styles.photoPlaceholder} />
                                    )}
                                </View>
                            </Pressable>
                        </SectionCard>

                        <Pressable onPress={() => void openSupportEmail()}>
                            <Text style={styles.reportText}>Сообщить о проблеме</Text>
                        </Pressable>
                    </View>
                </KeyboardAwareScrollView>

                <ToastViewport scope={TOAST_SCOPES.Settings} bottomOffset={75} />
            </View>
        </ScreenContainer>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.colors.background },
        stickyTopBar: { backgroundColor: theme.colors.background },
        scroll: { flex: 1 },
        titleWrap: {},
        formList: { rowGap: 15, marginTop: -7 },

        input: {
            backgroundColor: theme.colors.surface,
            minHeight: 40,
            borderRadius: 15,
            paddingHorizontal: 15,
            paddingVertical: 10,
            borderWidth: 1,
            borderColor: theme.colors.border,
            fontSize: 14,
            color: theme.colors.text,
        },
        inputError: { borderColor: theme.colors.danger },

        photoRow: {},
        photoCircle: {
            width: 90,
            height: 90,
            borderRadius: 999,
            overflow: 'hidden',
            backgroundColor: theme.colors.surface,
            justifyContent: 'center',
            alignItems: 'center',
        },
        photoImage: {
            width: '100%',
            height: '100%',
        },
        photoPlaceholder: {
            width: '100%',
            height: '100%',
            backgroundColor: theme.colors.border,
        },

        reportText: {
            marginTop: 6,
            textAlign: 'center',
            color: theme.colors.danger,
            fontFamily: 'Epilogue-Regular',
        },
    }),
)
