import { RootTabParamList } from '@/core/navigation/root-navigation'
import { AppStackParamList } from '@/core/navigation/types'
import MainHeader from '@/shared/components/headers/main-header'
import ScreenContainer from '@/shared/components/layout/screen-container'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import {
    CompositeNavigationProp,
    useFocusEffect,
    useNavigation,
} from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    ActivityIndicator,
    Linking,
} from 'react-native'
import ProfileHeader from '../components/profile/profile-header'
import ProfileUserInfo from '../components/profile/profile-user-info'
import { Items } from '../utils/profile-list-items'
import ProfileListItem from '../components/profile/profile-list-item'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'
import { ToastViewport, useToast } from '@/shared/components/toast/toast-provider'
import { TOAST_SCOPES } from '@/shared/components/toast/scopes'
import { useProfileSettingsStore } from '../store/profile-settings.store'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { useCallback, useEffect, useState } from 'react'
import { toApiError } from '@/api'
import BaseModal from '@/modules/modal/base/base-modal'
import ConfirmModal from '@/modules/modal/variants/confirm-modal'

import { LEGAL_LINKS } from '@/shared/utils/legal-links'

// навигация
type ProfileNav = CompositeNavigationProp<
    BottomTabNavigationProp<RootTabParamList, 'Profile'>,
    NativeStackNavigationProp<AppStackParamList>
>

function useProfileNav() {
    return useNavigation<ProfileNav>()
}

export default function ProfileScreen() {
    const { signOut, deleteAccount } = useAuth()
    const { show } = useToast()

    const styles = useStyles()
    const navigation = useProfileNav()

    // docs
    const openDocuments = (): void => {
        void Linking.openURL(LEGAL_LINKS.docs)
    }

    const ProfileNavFunctions: (() => void)[] = [
        () => navigation.navigate('Orders'),
        () => navigation.navigate('Products'),
        () => navigation.navigate('Planner'),
        () => navigation.navigate('Finances'),
        () => navigation.navigate('Settings'),
        () => navigation.navigate('Help'),
        () => openDocuments(),
    ]

    const settings = useProfileSettingsStore(s => s.settings)
    const hasHydrated = useProfileSettingsStore(s => s.hasHydrated)
    const fetchSettings = useProfileSettingsStore(s => s.fetchSettings)

    const [showLogoutModal, setShowLogoutModal] = useState(false)
    const [showDeleteUserModal, setShowDeleteUserModal] = useState(false)

    const refreshSettings = useCallback(async () => {
        if (!hasHydrated) return

        try {
            await fetchSettings()
        } catch (err) {
            const apiErr = toApiError(err)
            show(apiErr.message, 'error', { scope: TOAST_SCOPES.Profile })
        }
    }, [hasHydrated, fetchSettings, show])

    useEffect(() => {
        void refreshSettings()
    }, [refreshSettings])

    useFocusEffect(
        useCallback(() => {
            void refreshSettings()
        }, [refreshSettings]),
    )

    if (!settings) {
        return (
            <ScreenContainer>
                <MainHeader />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" />
                </View>
            </ScreenContainer>
        )
    }

    const handleDeleteAccount = async () => {
        try {
            await deleteAccount()
            setShowDeleteUserModal(false)
        } catch {
            setShowDeleteUserModal(false)
        }
    }

    return (
        <ScreenContainer>
            <MainHeader />
            <ProfileHeader />
            <ProfileUserInfo
                name={settings.profileName}
                nick={settings.nickname ?? ''}
                image={settings.photoUri}
            />
            <View style={styles.list}>
                {Items.map(item => (
                    <ProfileListItem
                        key={item.id}
                        icon={item.icon}
                        title={item.name}
                        arrow={item.arrow}
                        nav={ProfileNavFunctions[Number(item.id) - 1]}
                    />
                ))}
            </View>
            <Pressable onPress={() => setShowLogoutModal(true)}>
                <Text style={styles.leave}>Выйти</Text>
            </Pressable>
            <Pressable onPress={() => setShowDeleteUserModal(true)}>
                <Text style={styles.leave}>Удалить аккаунт</Text>
            </Pressable>

            <ToastViewport
                scope={TOAST_SCOPES.Profile}
                bottomOffset={80}
                horizontalInset={20}
            />
            <BaseModal
                visible={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
            >
                <ConfirmModal
                    title="Выход из аккаунта"
                    message={'Вы уверены, что хотите выйти из аккаунта?'}
                    onConfirm={() => signOut()}
                    onClose={() => setShowLogoutModal(false)}
                    confirmText="Выйти"
                    cancelText="Отмена"
                />
            </BaseModal>

            <BaseModal
                visible={showDeleteUserModal}
                onClose={() => setShowDeleteUserModal(false)}
            >
                <ConfirmModal
                    title="Удаление аккаунта"
                    message={
                        'Вы уверены, что хотите удалить аккаунт? Это приведет к безвозвратной потере всех данных'
                    }
                    onConfirm={() => handleDeleteAccount()}
                    onClose={() => setShowDeleteUserModal(false)}
                    confirmText="Удалить"
                    cancelText="Отмена"
                />
            </BaseModal>
        </ScreenContainer>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        list: {
            rowGap: 7,
            marginBottom: 30,
        },
        leave: {
            fontFamily: 'Epilogue-Regular',
            color: theme.colors.danger,
            fontSize: 16,
            textAlign: 'center',
            marginBottom: 22,
        },
    }),
)
