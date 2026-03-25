import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'

/**
 * Вызвать один раз при старте приложения (в App.tsx / root layout).
 * Запрашивает разрешения и создаёт Android-канал.
 * Возвращает true если разрешения выданы.
 */
export async function setupNotifications(): Promise<boolean> {
    // Android 8+ требует канал
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('orders', {
            name: 'Заказы',
            description: 'Напоминания о приготовлении и выдаче заказов',
            importance: Notifications.AndroidImportance.HIGH,
            lightColor: '#FF231F7C',
        })
    }

    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldPlaySound: true,
            shouldSetBadge: false,
            shouldShowBanner: true,
            shouldShowList: true,
        }),
    })

    const { status: existing } = await Notifications.getPermissionsAsync()
    if (existing === 'granted') return true

    const { status } = await Notifications.requestPermissionsAsync()
    return status === 'granted'
}
