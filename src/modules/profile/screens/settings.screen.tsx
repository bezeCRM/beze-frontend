import { useCallback, useState } from 'react'
import {
    Image,
    Linking,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
    ActivityIndicator,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import * as MailComposer from 'expo-mail-composer'

import ScreenContainer from '@/shared/components/layout/screen-container'
import SectionCard from '@/shared/ui/section/section-card'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'
import { useTheme } from '@/shared/theme/useTheme'

import { uploadProfilePhoto } from '@/modules/profile/api/profile.api'

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

import {
    useNotificationSettingsStore,
    EVENING_REMINDER_OPTIONS,
    COOKING_REMINDER_OPTIONS,
    PICKUP_REMINDER_OPTIONS,
    type NotificationSettings,
} from '@/modules/notifications/store/notification-settings.store'

import { rescheduleOrderNotifications } from '@/modules/notifications/utils/reschedule-notifications'
import { useOrdersStore } from '@/modules/orders/store/orders.store'
import { NotificationRow } from '../components/settings/notification-row'

export default function SettingsScreen() {
    const { bottom } = useSafeAreaInsets()
    const styles = useStyles()
    const colors = useTheme().theme.colors

    const navigation = useNavigation<any>()
    const { show } = useToast()

    const [isSaving, setIsSaving] = useState(false)

    const settings = useProfileSettingsStore(s => s.settings)
    const updateSettings = useProfileSettingsStore(s => s.updateSettings)

    const notifSettings = useNotificationSettingsStore(s => s.settings)
    const updateNotifSettings = useNotificationSettingsStore(s => s.updateSettings)

    // Заказы нужны чтобы пересчитать уведомления после смены настроек
    const orders = useOrdersStore(s => s.orders)

    const form = useProfileSettingsForm(settings ?? undefined)

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

    function isLocalPhotoUri(uri?: string): uri is string {
        if (!uri) return false

        return (
            uri.startsWith('file://') ||
            uri.startsWith('content://') ||
            uri.startsWith('ph://') ||
            uri.startsWith('blob:')
        )
    }

    const onValid = async (values: ProfileSettingsFormValues) => {
        if (isSaving) return

        setIsSaving(true)

        try {
            let photoUri = values.photoUri

            if (isLocalPhotoUri(photoUri)) {
                photoUri = await uploadProfilePhoto(photoUri)
            }

            await updateSettings({
                profileName: values.profileName,
                nickname: values.nickname,
                photoUri,
            })

            navigation.goBack()

            requestAnimationFrame(() => {
                show('Изменения сохранены', 'success', { scope: TOAST_SCOPES.Profile })
            })
        } catch {
            show('Ошибка соединения', 'error', { scope: TOAST_SCOPES.Settings })
        } finally {
            setIsSaving(false)
        }
    }

    const onInvalid = makeOnInvalidToast<
        ProfileSettingsFormValues,
        readonly ['profileName']
    >({
        required: ['profileName'] as const,
        labels: { profileName: 'Имя профиля' },
        show: msg => show(msg, 'error', { scope: TOAST_SCOPES.Settings }),
    })

    const handleNotifChange = <K extends keyof NotificationSettings>(
        key: K,
        value: NotificationSettings[K],
    ) => {
        const nextSettings: NotificationSettings = { ...notifSettings, [key]: value }
        updateNotifSettings({ [key]: value })
        void rescheduleOrderNotifications(orders, nextSettings)
    }

    const EMAIL = 'liquoree@list.ru'

    async function openSupportEmail() {
        const subject = 'Сообщить о проблеме'
        const body = 'Опишите проблему:\n\n'

        const available = await MailComposer.isAvailableAsync()
        if (available) {
            await MailComposer.composeAsync({ recipients: [EMAIL], subject, body })
            return
        }

        const url = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
        const can = await Linking.canOpenURL(url)
        if (can) await Linking.openURL(url)
    }

    if (!settings) {
        return (
            <ScreenContainer>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" />
                </View>
            </ScreenContainer>
        )
    }

    return (
        <ScreenContainer>
            <View style={styles.container}>
                <View style={styles.stickyTopBar}>
                    <InternalHeaderTopBar
                        onBack={() => navigation.goBack()}
                        showAction={true}
                        onActionPress={handleSubmit(onValid, onInvalid)}
                        actionText={isSaving ? 'Сохранение...' : 'Сохранить'}
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
                        {/* ── Профиль ── */}

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
                                editable={!isSaving}
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
                                editable={!isSaving}
                            />
                        </SectionCard>

                        <SectionCard title="Фото профиля">
                            <Pressable
                                style={styles.photoRow}
                                onPress={() => void handlePickPhoto()}
                                disabled={isSaving}
                            >
                                <View style={styles.photoCircle}>
                                    {photoUri ? (
                                        <Image
                                            source={{ uri: photoUri }}
                                            style={styles.photoImage}
                                            resizeMode="cover"
                                            onLoad={() => {
                                                console.log(
                                                    'profile settings image loaded:',
                                                    photoUri,
                                                )
                                            }}
                                            onError={e => {
                                                console.log(
                                                    'profile settings image error:',
                                                    {
                                                        uri: photoUri,
                                                        error: e.nativeEvent.error,
                                                    },
                                                )
                                            }}
                                        />
                                    ) : (
                                        <View style={styles.photoPlaceholder} />
                                    )}
                                    <Image
                                        source={require('@/assets/images/camera.png')}
                                        style={styles.cameraImg}
                                        resizeMode="contain"
                                    />
                                    <View style={styles.photoCoverer} />
                                </View>
                            </Pressable>
                        </SectionCard>

                        {/* ── Уведомления ── */}

                        <SectionCard title="Уведомления">
                            <View style={styles.notifSection}>
                                <NotificationRow
                                    label="Накануне вечером"
                                    hint="Напомним о заказах на следующий день"
                                    options={EVENING_REMINDER_OPTIONS}
                                    value={notifSettings.eveningReminder}
                                    onChange={v =>
                                        handleNotifChange('eveningReminder', v)
                                    }
                                />

                                <View style={styles.divider} />

                                <NotificationRow
                                    label="Начать готовить"
                                    hint="За сколько часов до выдачи напомнить о готовке"
                                    options={COOKING_REMINDER_OPTIONS}
                                    value={notifSettings.cookingReminder}
                                    onChange={v =>
                                        handleNotifChange('cookingReminder', v)
                                    }
                                />

                                <View style={styles.divider} />

                                <NotificationRow
                                    label="Перед выдачей"
                                    hint="Напомним незадолго до выдачи заказа"
                                    options={PICKUP_REMINDER_OPTIONS}
                                    value={notifSettings.pickupReminder}
                                    onChange={v => handleNotifChange('pickupReminder', v)}
                                />
                            </View>
                        </SectionCard>

                        {/* ── Поддержка ── */}
                        <Pressable onPress={() => void openSupportEmail()}>
                            <Text style={styles.reportText}>Сообщить о проблеме</Text>
                        </Pressable>
                    </View>
                </KeyboardAwareScrollView>

                <ToastViewport scope={TOAST_SCOPES.Settings} bottomOffset={15} />
            </View>
        </ScreenContainer>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.colors.background },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
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
            position: 'relative',
        },
        photoImage: { width: '100%', height: '100%' },
        photoPlaceholder: {
            width: '100%',
            height: '100%',
            backgroundColor: theme.colors.background,
        },

        photoCoverer: {
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            position: 'absolute',
            zIndex: 3,
        },

        cameraImg: {
            width: 40,
            height: 40,
            position: 'absolute',
            zIndex: 4,
        },

        notifSection: { rowGap: 16 },
        divider: {
            height: 1,
            backgroundColor: theme.colors.border,
            opacity: 0.6,
        },

        reportText: {
            marginTop: 6,
            textAlign: 'center',
            color: theme.colors.danger,
            fontFamily: 'Epilogue-Regular',
        },
    }),
)
