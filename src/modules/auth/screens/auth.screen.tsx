import { useMemo, useState } from 'react'
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native'
import PassHidden from '@/assets/icons/pass_hidden-icon.svg'
import PassShown from '@/assets/icons/pass_shown-icon.svg'

import ScreenContainer from '@/shared/components/layout/screen-container'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'
import Button from '@/shared/ui/button/button'
import { Icon } from '@/shared/ui/icon/icon'

import { useAuth } from '@/modules/auth/hooks/useAuth'
import AuthSegment, { AuthSegmentValue } from '../components/auth-segment'
import AuthCard from '../components/auth-card'
import AuthInput from '../components/auth-input'
import AuthLink from '../components/auth-link'
import { useTheme } from '@/shared/theme/useTheme'
import { AuthNav } from '@/core/navigation/types'
import { useNavigation } from '@react-navigation/native'
import AuthLogo from '../components/auth-logo'
import BaseModal from '@/modules/modal/base/base-modal'
import GuestStartModal from '@/modules/modal/variants/guest-start-modal'

import { LEGAL_LINKS } from '@/shared/utils/legal-links'

export default function AuthScreen() {
    const styles = useStyles()
    const colors = useTheme().theme.colors
    const { signIn, signUp, signInAsGuest, isSubmitting, clearError, error } = useAuth()
    const navigation = useNavigation<AuthNav>()

    // модалка зайти как гость
    const [guestVisible, setGuestVisible] = useState(false)

    const openGuest = (): void => {
        setGuestVisible(true)
    }

    const closeGuest = (): void => {
        setGuestVisible(false)
    }

    const startGuest = async (
        termsAccepted: boolean,
        personalDataAccepted: boolean,
    ): Promise<void> => {
        await signInAsGuest(termsAccepted, personalDataAccepted)
        closeGuest()
    }

    const [mode, setMode] = useState<AuthSegmentValue>('login')
    const [email, setEmail] = useState('')

    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')

    const [termsAccepted, setTermsAccepted] = useState(false)
    const [personalDataAccepted, setPersonalDataAccepted] = useState(false)

    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [isRepeatPasswordVisible, setIsRepeatPasswordVisible] = useState(false)

    const passwordsMatch = useMemo(() => {
        if (mode !== 'register') return true
        if (repeatPassword.length === 0) return true
        return password === repeatPassword
    }, [mode, password, repeatPassword])

    const canSubmit = useMemo(() => {
        if (login.trim().length === 0) return false
        if (password.length === 0) return false

        if (mode === 'register') {
            if (email.trim().length === 0) return false
            if (repeatPassword.length === 0) return false
            if (password !== repeatPassword) return false
            if (!termsAccepted) return false
            if (!personalDataAccepted) return false
        }

        return true
    }, [
        login,
        password,
        repeatPassword,
        email,
        mode,
        termsAccepted,
        personalDataAccepted,
    ])

    const openLegalLink = (url: string): void => {
        void Linking.openURL(url)
    }

    const onSubmit = async (): Promise<void> => {
        const cleanLogin = login.trim()

        if (mode === 'login') {
            await signIn(cleanLogin, password)
            return
        }

        if (password !== repeatPassword) return
        if (!termsAccepted || !personalDataAccepted) return

        await signUp(
            cleanLogin,
            email.trim(),
            password,
            termsAccepted,
            personalDataAccepted,
        )
    }

    return (
        <ScreenContainer>
            <View style={styles.center}>
                <AuthLogo />

                <AuthSegment
                    value={mode}
                    onChange={value => {
                        setMode(value)
                        if (error) clearError()
                    }}
                />

                <AuthCard>
                    <AuthInput
                        value={login}
                        onChangeText={v => {
                            if (error) clearError()
                            setLogin(v)
                        }}
                        placeholder={`${mode === 'login' ? 'Логин или email' : 'Логин'}`}
                        autoCapitalize="none"
                        left={isFocused => (
                            <Icon
                                name="profile-icon"
                                color={isFocused ? colors.brand : colors.textMuted}
                            />
                        )}
                    />

                    {mode === 'register' ? (
                        <AuthInput
                            value={email}
                            onChangeText={v => {
                                if (error) clearError()
                                setEmail(v)
                            }}
                            placeholder="Email"
                            autoCapitalize="none"
                            left={isFocused => (
                                <Icon
                                    name="email-icon"
                                    color={isFocused ? colors.brand : colors.textMuted}
                                />
                            )}
                        />
                    ) : null}

                    <AuthInput
                        value={password}
                        onChangeText={v => {
                            if (error) clearError()
                            setPassword(v)
                        }}
                        placeholder="Пароль"
                        autoCapitalize="none"
                        secureTextEntry={!isPasswordVisible}
                        left={isFocused => (
                            <Icon
                                name="password-icon"
                                color={isFocused ? colors.brand : colors.textMuted}
                            />
                        )}
                        right={() => (
                            <Pressable
                                onPress={() => setIsPasswordVisible(prev => !prev)}
                            >
                                {isPasswordVisible ? <PassShown /> : <PassHidden />}
                            </Pressable>
                        )}
                    />

                    {mode === 'register' ? (
                        <AuthInput
                            value={repeatPassword}
                            onChangeText={v => {
                                if (error) clearError()
                                setRepeatPassword(v)
                            }}
                            placeholder="Повторите пароль"
                            autoCapitalize="none"
                            secureTextEntry={!isRepeatPasswordVisible}
                            left={isFocused => (
                                <Icon
                                    name="password-icon"
                                    color={isFocused ? colors.brand : colors.textMuted}
                                />
                            )}
                            right={() => (
                                <Pressable
                                    onPress={() =>
                                        setIsRepeatPasswordVisible(prev => !prev)
                                    }
                                >
                                    {isRepeatPasswordVisible ? (
                                        <PassShown />
                                    ) : (
                                        <PassHidden />
                                    )}
                                </Pressable>
                            )}
                        />
                    ) : null}

                    {mode === 'register' ? (
                        <View style={styles.legalBlock}>
                            <LegalCheckbox
                                checked={termsAccepted}
                                onPress={() => {
                                    if (error) clearError()
                                    setTermsAccepted(prev => !prev)
                                }}
                            >
                                <Text style={styles.legalText}>
                                    Я принимаю{' '}
                                    <Text
                                        style={styles.legalLink}
                                        onPress={() => openLegalLink(LEGAL_LINKS.terms)}
                                    >
                                        Пользовательское соглашение bezeCRM
                                    </Text>
                                </Text>
                            </LegalCheckbox>

                            <LegalCheckbox
                                checked={personalDataAccepted}
                                onPress={() => {
                                    if (error) clearError()
                                    setPersonalDataAccepted(prev => !prev)
                                }}
                            >
                                <Text style={styles.legalText}>
                                    Я ознакомлен(а) с{' '}
                                    <Text
                                        style={styles.legalLink}
                                        onPress={() => openLegalLink(LEGAL_LINKS.privacy)}
                                    >
                                        Политикой обработки персональных данных bezeCRM
                                    </Text>{' '}
                                    и даю{' '}
                                    <Text
                                        style={styles.legalLink}
                                        onPress={() => openLegalLink(LEGAL_LINKS.consent)}
                                    >
                                        согласие на обработку моих персональных данных
                                    </Text>
                                </Text>
                            </LegalCheckbox>
                        </View>
                    ) : null}

                    {mode === 'login' ? (
                        <AuthLink
                            title="Забыли пароль?"
                            onPress={() => navigation.navigate('ForgotPassword')}
                        />
                    ) : null}

                    {!passwordsMatch ? (
                        <Text style={styles.error}>Пароли не совпадают</Text>
                    ) : null}

                    {error ? (
                        <Text style={styles.error} numberOfLines={3}>
                            {error}
                        </Text>
                    ) : null}

                    <Button
                        title={mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
                        onPress={onSubmit}
                        loading={isSubmitting}
                        disabled={!canSubmit || !passwordsMatch || isSubmitting}
                    />

                    <View style={styles.guestBlock}>
                        <View style={styles.dividerRow}>
                            <View style={styles.divider} />
                            <Text style={styles.dividerText}>или</Text>
                            <View style={styles.divider} />
                        </View>

                        <Pressable style={styles.guestButton} onPress={openGuest}>
                            <Text style={styles.guestButtonText}>
                                Попробовать без регистрации
                            </Text>
                        </Pressable>
                    </View>
                </AuthCard>
            </View>
            <BaseModal visible={guestVisible} onClose={closeGuest}>
                <GuestStartModal
                    onStart={startGuest}
                    onCancel={closeGuest}
                    onClose={closeGuest}
                    startText="Начать"
                    cancelText="Отмена"
                />
            </BaseModal>
        </ScreenContainer>
    )
}

type LegalCheckboxProps = {
    checked: boolean
    onPress: () => void
    children: React.ReactNode
}

function LegalCheckbox({ checked, onPress, children }: LegalCheckboxProps) {
    const styles = useStyles()

    return (
        <Pressable style={styles.checkboxRow} onPress={onPress}>
            <View style={[styles.checkbox, checked ? styles.checkboxChecked : null]}>
                {checked ? <Text style={styles.checkboxMark}>✓</Text> : null}
            </View>

            <View style={styles.checkboxTextContainer}>{children}</View>
        </Pressable>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        center: {
            marginTop: '15%',
            alignItems: 'center',
        },
        error: {
            fontFamily: 'Epilogue-Regular',
            color: theme.colors.danger,
            textAlign: 'center',
            alignSelf: 'center',
            width: '75%',
        },
        legalBlock: {
            width: '100%',
            gap: 12,
            marginTop: 4,
            marginBottom: 4,
        },
        checkboxRow: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 10,
        },
        checkbox: {
            width: 20,
            height: 20,
            borderRadius: 6,
            borderWidth: 1,
            borderColor: theme.colors.border,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 1,
        },
        checkboxChecked: {
            borderColor: theme.colors.brand,
            backgroundColor: theme.colors.brand,
        },
        checkboxMark: {
            fontFamily: 'Epilogue-Bold',
            color: theme.colors.background,
            fontSize: 13,
            lineHeight: 16,
        },
        checkboxTextContainer: {
            flex: 1,
        },
        legalText: {
            fontFamily: 'Epilogue-Regular',
            color: theme.colors.textMuted,
            fontSize: 12,
            lineHeight: 17,
        },
        legalLink: {
            fontFamily: 'Epilogue-Regular',
            color: theme.colors.brand,
            fontSize: 12,
            lineHeight: 17,
            textDecorationLine: 'underline',
        },
        guestBlock: {
            width: '100%',
            alignItems: 'center',
            marginTop: 12,
        },
        dividerRow: {
            width: '75%',
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 7,
        },
        divider: {
            flex: 1,
            height: 1,
            backgroundColor: theme.colors.border,
        },
        dividerText: {
            fontFamily: 'Epilogue-Regular',
            color: theme.colors.textMuted,
            fontSize: 12,
            marginHorizontal: 12,
        },
        guestButton: {
            paddingVertical: 10,
            paddingHorizontal: 16,
        },
        guestButtonText: {
            fontFamily: 'Epilogue-Semibold',
            color: theme.colors.brand,
            fontSize: 14,
        },
    }),
)
