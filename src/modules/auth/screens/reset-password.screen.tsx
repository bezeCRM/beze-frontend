import { useState } from 'react'
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import { CommonActions } from '@react-navigation/native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import PassHidden from '@/assets/icons/pass_hidden-icon.svg'
import PassShown from '@/assets/icons/pass_shown-icon.svg'

import ScreenContainer from '@/shared/components/layout/screen-container'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'
import { useTheme } from '@/shared/theme/useTheme'
import Button from '@/shared/ui/button/button'
import { Icon } from '@/shared/ui/icon/icon'

import type { RootSwitchParamList } from '@/core/navigation/types'
import { resetPassword } from '@/modules/auth/api/auth.api'
import AuthCard from '../components/auth-card'
import AuthInput from '../components/auth-input'
import AuthLogo from '../components/auth-logo'

type Props = NativeStackScreenProps<RootSwitchParamList, 'ResetPassword'>

export default function ResetPasswordScreen({ route, navigation }: Props) {
    const styles = useStyles()
    const colors = useTheme().theme.colors

    const token = route.params?.token
    console.log('reset password token:', token)

    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [loading, setLoading] = useState(false)

    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [isConfirmVisible, setIsConfirmVisible] = useState(false)

    const goToAuth = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'Auth' }],
            }),
        )
    }

    const handleSubmit = async () => {
        if (!token) {
            return Alert.alert('Ошибка', 'Ссылка для сброса пароля некорректна')
        }

        if (!password || !confirm) {
            return Alert.alert('Заполните все поля')
        }

        if (password !== confirm) {
            return Alert.alert('Пароли не совпадают')
        }

        setLoading(true)

        try {
            await resetPassword({ token, password })

            Alert.alert('Готово', 'Пароль изменён', [
                {
                    text: 'OK',
                    onPress: goToAuth,
                },
            ])
        } catch {
            Alert.alert('Ошибка', 'Неверная или устаревшая ссылка')
        } finally {
            setLoading(false)
        }
    }

    return (
        <ScreenContainer>
            <View style={styles.center}>
                <AuthLogo />

                <Text style={styles.title}>Новый пароль</Text>
                <Text style={styles.subtitle}>
                    Придумайте новый пароль и повторите его ниже
                </Text>

                <AuthCard>
                    <AuthInput
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Минимум 8 символов"
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

                    <AuthInput
                        value={confirm}
                        onChangeText={setConfirm}
                        placeholder="Повторите пароль"
                        autoCapitalize="none"
                        secureTextEntry={!isConfirmVisible}
                        left={isFocused => (
                            <Icon
                                name="password-icon"
                                color={isFocused ? colors.brand : colors.textMuted}
                            />
                        )}
                        right={() => (
                            <Pressable onPress={() => setIsConfirmVisible(prev => !prev)}>
                                {isConfirmVisible ? <PassShown /> : <PassHidden />}
                            </Pressable>
                        )}
                    />

                    <Button
                        title={loading ? 'Сохранение...' : 'Сохранить'}
                        onPress={handleSubmit}
                        loading={loading}
                        disabled={loading}
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
        title: {
            marginTop: 28,
            fontFamily: 'Epilogue-Regular',
            fontSize: 22,
            color: theme.colors.text,
            textAlign: 'center',
        },
        subtitle: {
            marginTop: 8,
            width: '82%',
            fontFamily: 'Epilogue-Regular',
            fontSize: 14,
            lineHeight: 20,
            color: theme.colors.textMuted,
            textAlign: 'center',
        },
    }),
)
