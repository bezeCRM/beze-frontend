import { useMemo, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Logo from '@/assets/images/logo.svg'
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

export default function AuthScreen() {
    const styles = useStyles()
    const colors = useTheme().theme.colors
    const { signIn, signUp, isSubmitting, clearError, error } = useAuth()
    const navigation = useNavigation<AuthNav>()

    const [mode, setMode] = useState<AuthSegmentValue>('login')
    const [email, setEmail] = useState('')

    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')

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
        }

        return true
    }, [login, password, repeatPassword, email, mode])

    const onSubmit = async (): Promise<void> => {
        const cleanLogin = login.trim()

        if (mode === 'login') {
            await signIn(cleanLogin, password)
            return
        }

        if (password !== repeatPassword) return
        await signUp(cleanLogin, email.trim(), password)
    }

    return (
        <ScreenContainer>
            <View style={styles.center}>
                <Logo width={110} height={42} />

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
                        placeholder="Логин"
                        autoCapitalize="none"
                        left={isFocused => (
                            <Icon
                                name="email-icon"
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

                    {mode === 'login' ? (
                        <AuthLink title="Забыли пароль?" onPress={() => navigation.navigate('ForgotPassword')} />
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
                </AuthCard>
            </View>
        </ScreenContainer>
    )
}

const useStyles = createThemedStyles(theme =>
    StyleSheet.create({
        center: {
            marginTop: '20%',
            alignItems: 'center',
        },
        error: {
            fontFamily: 'Epilogue-Regular',
            color: theme.colors.danger,
            textAlign: 'center',
            alignSelf: 'center',
            width: '75%',
        },
    }),
)
