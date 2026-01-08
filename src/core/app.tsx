import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import AppProviders from './providers/app-providers'
import AppNavigation from './navigation/app-navigation'

SplashScreen.preventAutoHideAsync()

export default function App() {
    const [fontsLoaded] = useFonts({
        'Epilogue-Regular': require('@/assets/fonts/Epilogue-Regular.ttf'),
        'Epilogue-SemiBold': require('@/assets/fonts/Epilogue-SemiBold.ttf'),
    })

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync()
        }
    }, [fontsLoaded])

    if (!fontsLoaded) return null // пока шрифт не загрузился — просто пустой экран

    return (
        <AppProviders>
            <AppNavigation />
        </AppProviders>
    )
}
