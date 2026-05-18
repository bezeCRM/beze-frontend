import { useState } from 'react'
import { Alert, StyleSheet, Text, View } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import ScreenContainer from '@/shared/components/layout/screen-container'
import { createThemedStyles } from '@/shared/theme/create-themed-styles'
import { useTheme } from '@/shared/theme/useTheme'
import Button from '@/shared/ui/button/button'
import { Icon } from '@/shared/ui/icon/icon'

import type { AuthStackParamList } from '@/core/navigation/types'
import { forgotPassword } from '../api/auth.api'
import AuthCard from '../components/auth-card'
import AuthInput from '../components/auth-input'
import AuthLink from '../components/auth-link'
import AuthLogo from '../components/auth-logo'

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>

export default function ForgotPasswordScreen({ navigation }: Props) {
    const styles = useStyles()
    const colors = useTheme().theme.colors

    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        if (!email) {
            return Alert.alert('Введите email')
        }

        setLoading(true)

        try {
            await forgotPassword({ email: email.trim().toLowerCase() })

            Alert.alert(
                'Готово',
                'Если этот email зарегистрирован, ссылка для сброса отправлена',
            )

            navigation.goBack()
        } catch {
            Alert.alert('Ошибка', 'Не удалось отправить запрос')
        } finally {
            setLoading(false)
        }
    }

    return (
        <ScreenContainer>
            <View style={styles.center}>
                <AuthLogo />

                <Text style={styles.title}>Восстановление пароля</Text>
                <Text style={styles.subtitle}>
                    Укажите email, и мы отправим ссылку для сброса пароля
                </Text>

                <AuthCard>
                    <AuthInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Email"
                        autoCapitalize="none"
                        keyboardEmail
                        left={isFocused => (
                            <Icon
                                name="email-icon"
                                color={isFocused ? colors.brand : colors.textMuted}
                            />
                        )}
                    />

                    <Button
                        title={loading ? 'Отправка...' : 'Отправить'}
                        onPress={handleSubmit}
                        loading={loading}
                        disabled={loading}
                        style={styles.btn}
                    />

                    <AuthLink title="Назад" onPress={() => navigation.goBack()} />
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
            fontFamily: 'Epilogue-SemiBold',
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
        btn: {
            marginTop: 3,
            marginBottom: 3,
        },
    }),
)
