import Constants from 'expo-constants'
import { Platform } from 'react-native'

export async function setupNotifications(): Promise<boolean> {
    if (Platform.OS === 'android' && Constants.expoGoConfig != null) {
        return false
    }

    const Notifications = await import('expo-notifications')

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
