import { useState } from 'react'
import { View, Text, TextInput, Button, Alert } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { AuthStackParamList } from '@/core/navigation/types'
import { forgotPassword } from '../api/auth.api'

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>

export default function ForgotPasswordScreen({ navigation }: Props) {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        if (!email) return Alert.alert('Введите email')
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
        <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
            <Text>Email</Text>
            <TextInput
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="example@mail.com"
                style={{ borderWidth: 1, padding: 8, marginVertical: 8 }}
            />
            <Button
                title={loading ? 'Отправка...' : 'Отправить'}
                onPress={handleSubmit}
                disabled={loading}
            />
            <Button title="Назад" onPress={() => navigation.goBack()} />
        </View>
    )
}
