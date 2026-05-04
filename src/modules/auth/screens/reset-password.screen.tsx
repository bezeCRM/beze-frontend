import { useState } from 'react'
import { View, Text, TextInput, Button, Alert } from 'react-native'
import { CommonActions } from '@react-navigation/native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { RootSwitchParamList } from '@/core/navigation/types'
import { resetPassword } from '@/modules/auth/api/auth.api'

type Props = NativeStackScreenProps<RootSwitchParamList, 'ResetPassword'>

export default function ResetPasswordScreen({ route, navigation }: Props) {
    const token = route.params?.token
    console.log('reset password token:', token)

    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [loading, setLoading] = useState(false)

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
        <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
            <Text>Новый пароль</Text>
            <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="Минимум 8 символов"
                style={{ borderWidth: 1, padding: 8, marginVertical: 8 }}
            />

            <Text>Повторите пароль</Text>
            <TextInput
                value={confirm}
                onChangeText={setConfirm}
                secureTextEntry
                placeholder="Повторите пароль"
                style={{ borderWidth: 1, padding: 8, marginVertical: 8 }}
            />

            <Button
                title={loading ? 'Сохранение...' : 'Сохранить'}
                onPress={handleSubmit}
                disabled={loading}
            />
        </View>
    )
}
